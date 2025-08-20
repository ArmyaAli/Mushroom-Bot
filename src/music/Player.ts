import { AudioPlayer, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, entersState, VoiceConnectionDisconnectReason, joinVoiceChannel, VoiceConnectionStatus, VoiceConnection, createAudioResource, AudioResource } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import { Logger } from '../utils/logger';
import { YtDlp } from 'ytdlp-nodejs';

export interface QueueItem {
  title: string;
  url: string;
  requestedBy: string;
}

export class MusicPlayer {
  // Basic state
  private hasPlayed = false;
  private autoplay = false; // placeholder for future related-track feature
  private volume = 100;     // 0 - 200 (scaled percent)
  private muted = false;

  // Core runtime objects
  private queue: QueueItem[] = [];
  private audioPlayer: AudioPlayer;
  private connection: VoiceConnection | null = null;
  private current: QueueItem | null = null;
  private currentResource: AudioResource | null = null;

  // Support
  private logger: Logger;
  private ytdlp: YtDlp;
  private consecutiveFailures = 0;

  constructor() {
    this.audioPlayer = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
    this.logger = Logger.getInstance();
    this.ytdlp = new YtDlp({
      binaryPath: process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
    });

    // When a track finishes, advance automatically
    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      void this.playNext();
    });
  }

  public async connect(channel: VoiceBasedChannel) {
    if (this.connection) return;
    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    });

    this.connection.on(VoiceConnectionStatus.Disconnected, async (_old, newState) => {
      if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
        try {
          await entersState(this.connection!, VoiceConnectionStatus.Connecting, 5_000);
        } catch {
          this.connection?.destroy();
          this.connection = null;
        }
      } else if (!this.connection?.rejoinAttempts || this.connection.rejoinAttempts < 5) {
        await new Promise(res => setTimeout(res, (this.connection!.rejoinAttempts + 1) * 5_000));
        this.connection?.rejoin();
      } else {
        this.connection?.destroy();
        this.connection = null;
      }
    });

    this.connection.subscribe(this.audioPlayer);
  }

  public enqueue(item: QueueItem) {
    this.logger.debug('Enqueue', { title: item.title, url: item.url, requestedBy: item.requestedBy });
    this.queue.push(item);
    if (!this.current) void this.playNext();
  }

  private async playNext(): Promise<void> {
    this.current = this.queue.shift() || null;
    if (!this.current) {
      // Autoplay placeholder: no action yet.
      return;
    }

    if (!this.current.url) {
      this.logger.error('Current track missing URL, skipping', { track: this.current });
      this.current = null;
      return void this.playNext();
    }

    try {
      // Get video info for metadata and format selection
      const info: any = await this.ytdlp.getInfoAsync(this.current.url);
      
      // Handle playlists by taking the first entry
      if (info._type === 'playlist' && Array.isArray(info.entries) && info.entries.length) {
        const first = info.entries[0];
        if (first?.title) this.current.title = first.title;
      } else if (info.title) {
        this.current.title = info.title;
      }

      // Get stream with best audio quality
      const stream = await this.ytdlp.stream(this.current.url, {
        format: {
          filter: 'audioonly' as const
        }
      });

      if (!stream) {
        throw new Error('Failed to create audio stream');
      }

      // Create and play resource
      const resource = createAudioResource(stream as any, { inlineVolume: true });
      this.currentResource = resource;
      this.applyVolume();
      this.audioPlayer.play(resource);
      
      this.logger.info('Playing', { 
        title: this.current.title, 
        url: this.current.url,
        duration: info.duration ? new Date(info.duration * 1000).toISOString().slice(11, 19) : 'unknown'
      });
      
      this.consecutiveFailures = 0;

    } catch (err) {
      this.logger.error('Playback error', { 
        error: (err as Error).message, 
        url: this.current?.url,
        stack: (err as Error).stack
      });
      
      this.current = null;
      this.consecutiveFailures++;
      
      if (this.consecutiveFailures >= 5) {
        this.logger.error('Too many failures; clearing queue');
        this.queue = [];
        this.consecutiveFailures = 0;
        return;
      }
      
      return void this.playNext();
    }
  }

  public play() {
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
    } else if (this.audioPlayer.state.status === AudioPlayerStatus.Idle && this.queue.length > 0) {
      void this.playNext();
    }
    this.hasPlayed = true;
  }

  public pause() { this.audioPlayer.pause(); }
  public resume() { this.audioPlayer.unpause(); }

  public togglePause(): boolean {
    if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      this.audioPlayer.pause();
      return true; // now paused
    }
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
      return false; // now playing
    }
    if (this.audioPlayer.state.status === AudioPlayerStatus.Idle && this.queue.length > 0) {
      this.play();
      return false;
    }
  return false;
  }

  public isPaused() { return this.audioPlayer.state.status === 'paused'; }
  public isPlaying() { return this.audioPlayer.state.status === 'playing'; }
  public isIdle() { return this.audioPlayer.state.status === 'idle'; }
  public hasQueue() { return this.queue.length > 0; }
  public isActive() { return this.isPlaying() || this.isPaused(); }

  public stop() { this.audioPlayer.stop(); this.queue = []; this.current = null; }
  public shuffle() { this.queue = [...this.queue].sort(() => Math.random() - 0.5); }

  public toggleAutoplay() { this.autoplay = !this.autoplay; return this.autoplay; }
  public getAutoplay() { return this.autoplay; }

  public setVolume(volume: number) { this.volume = Math.max(0, Math.min(200, volume)); this.applyVolume(); }
  public getVolume() { return this.volume; }
  public toggleMute() { this.muted = !this.muted; this.applyVolume(); return this.muted; }
  public isMuted() { return this.muted; }
  public hasPlayedBefore() { return this.hasPlayed; }
  public getQueue() { return this.queue; }
  public getCurrent() { return this.current; }

  private applyVolume() {
    if (!this.currentResource) return;
    const volNode = (this.currentResource as any).volume;
    if (!volNode) return;
    const target = this.muted ? 0 : this.volume / 100;
    try { volNode.setVolume(target); } catch {/* ignore */}
  }
}

export const players = new Map<string, MusicPlayer>();
export function getPlayer(guildId: string) {
  if (!players.has(guildId)) players.set(guildId, new MusicPlayer());
  return players.get(guildId)!;
}
