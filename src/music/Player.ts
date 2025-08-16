import { AudioPlayer, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, entersState, VoiceConnectionDisconnectReason, joinVoiceChannel, VoiceConnectionStatus, VoiceConnection } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import { Logger } from '../utils/logger';

export interface QueueItem {
  title: string;
  url: string;
  requestedBy: string;
}

export class MusicPlayer {
  private hasPlayed = false;
  private autoplay = false;
  private volume = 100;
  private muted = false;

  private queue: QueueItem[] = [];
  private audioPlayer: AudioPlayer;
  private connection: VoiceConnection | null = null;
  private current: QueueItem | null = null;
  private logger: Logger;
  private consecutiveFailures = 0;
  // Placeholder: no external YouTube libraries; user will supply implementation later.

  constructor() {
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    });

    // Reuse global logger instance (must have been initialized elsewhere)
    this.logger = Logger.getInstance();

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.playNext();
    });
  }

  public async connect(channel: VoiceBasedChannel) {
    if (this.connection) return;
    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false, // Set to false so the bot doesn't appear deafened (optional)
      selfMute: false  // Ensure bot isn't self-muted
    });

    this.connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
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
    this.logger.debug('Enqueue track', { title: item.title, url: item.url, requestedBy: item.requestedBy });
    this.queue.push(item);
    if (!this.current) {
      this.playNext();
    }
  }

  private async playNext(): Promise<void> {
    this.current = this.queue.shift() || null;
    if (!this.current) {
      if (this.autoplay) {
        // TODO: Implement actual autoplay (fetch related track)
        this.logger.debug('Autoplay: Adding dummy related track');
        this.enqueue({
          title: 'Dummy Autoplay Track',
          url: 'dummy-autoplay-url',
          requestedBy: 'autoplay'
        });
        return this.playNext();
      }
      this.logger.debug('Queue ended');
      return;
    }

    if (!this.current.url) {
      this.logger.error('Current track missing URL, skipping', { track: this.current });
      this.current = null;
      return this.playNext();
    }

  // Streaming removed; just skip items until queue empty.
  this.logger.warn('Playback disabled (no media libraries). Skipping track.', { title: this.current.title, url: this.current.url });
  this.current = null;
  return this.playNext();
  }

  public play() {
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
    } else if (this.audioPlayer.state.status === AudioPlayerStatus.Idle && this.queue.length > 0) {
      this.playNext();
    }
    this.hasPlayed = true;
  }

  public pause() {
    this.audioPlayer.pause();
  }

  public resume() {
    this.audioPlayer.unpause();
  }

  public togglePause(): boolean {
    if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      this.audioPlayer.pause();
      return true; // now paused
    }
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
      return false; // now playing
    }
    // If idle, treat as starting playback if queue exists
    if (this.queue.length > 0) {
      this.play();
      return false;
    }
    return false;
  }

  public isPaused(): boolean {
    return this.audioPlayer.state.status === AudioPlayerStatus.Paused;
  }

  public isPlaying(): boolean {
    return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  public isIdle(): boolean {
    return this.audioPlayer.state.status === AudioPlayerStatus.Idle;
  }

  public hasQueue(): boolean {
    return this.queue.length > 0;
  }

  public isActive(): boolean {
    return this.isPlaying() || this.isPaused();
  }

  public stop() {
    this.audioPlayer.stop();
    this.queue = [];
    this.current = null;
  }

  public shuffle() {
    this.queue = this.queue.sort(() => Math.random() - 0.5);
  }

  public toggleAutoplay(): boolean {
    this.autoplay = !this.autoplay;
    return this.autoplay;
  }

  public getAutoplay(): boolean {
    return this.autoplay;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(200, volume));
    // TODO: Apply to audio resource when playback enabled
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public hasPlayedBefore(): boolean {
    return this.hasPlayed;
  }

  public getQueue() {
    return this.queue;
  }

  public getCurrent() {
    return this.current;
  }

  // No sanitize or fallback methods: user will implement when selecting dependencies.
}

export const players = new Map<string, MusicPlayer>();

export function getPlayer(guildId: string) {
  if (!players.has(guildId)) {
    players.set(guildId, new MusicPlayer());
  }
  return players.get(guildId)!;
}
