import { ChatInputCommandInteraction } from "discord.js";
import { youtube as yt } from 'scrape-youtube';
import ytdl from 'ytdl-core';
import fs from 'fs';

const songs: any[] = []

export async function resolveQuery(interaction: ChatInputCommandInteraction, query: string) {
    await yt.search(query).then((results: any) => {
        // Unless you specify a custom type you will only receive 'video' results
        console.log(results.videos);
        const title = results.videos[0].title;
        const link = results.videos[0].link;
        const duration = results.videos[0].duration;
        songs.push({ title: title, link: link, duration: duration });
    });

    await interaction.reply('play command');
    console.log(songs)
    ytdl(songs[0].link).pipe(fs.createWriteStream('video.mp4'));
}

export async function playTrack() {

}

export async function playList() {

}
