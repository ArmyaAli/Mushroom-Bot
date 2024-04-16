import { promises as fs } from 'fs'
import  path from 'path'
import { __COMMANDPATH } from './constants'
import { queryType, queryMap, queryDispatchMap, __botCommands, __commandTree } from './globals';
import { resolveYoutubeTrack, resolveSpotifyTrack, resolveSpotifyPlaylist, resolveYoutubePlaylist, resolveSearch } from './music-player-api';

// Node 20... has a recursive file walk??
(async function loadCommands() {
  const files = await fs.readdir(__COMMANDPATH, { recursive: true });
  for (const file of files) {
      if(/(.js$|.ts$)/.test(file)) {
        const command = await import(path.join(__COMMANDPATH, file));
        __botCommands.set(command.default.data.name, command.default);
      }
  }
})();

// TODO(Ali): I don't think this piece of code belongs here. Let's find a new place to move it. The functionality is quite localized to the music-player-api and 
// not really part of the entire system as a whole
(async function setup() {
  queryMap.set(queryType.YoutubeTrack, /https:\/\/www.youtube\.com\/watch?.*/);
  queryMap.set(queryType.YoutubePlaylist, /https:\/\/youtube\.com\/playlist.*/);
  queryMap.set(queryType.SpotifyTrack, /https:\/\/(open\.?)spotify\.com\/track*/);
  queryMap.set(queryType.SpotifyPlaylist, /https:\/\/(open\.)?spotify\.com\/playlist*/);

  queryDispatchMap.set(queryType.YoutubeTrack, resolveYoutubeTrack);
  queryDispatchMap.set(queryType.SpotifyTrack, resolveSpotifyTrack);
  queryDispatchMap.set(queryType.SpotifyPlaylist, resolveSpotifyPlaylist);
  queryDispatchMap.set(queryType.YoutubePlaylist, resolveYoutubePlaylist);
  queryDispatchMap.set(queryType.SearchQuery, resolveSearch);
})();

export {};
