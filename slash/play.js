const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Searches for song")
        .addStringOption((option) => option.setName("search").setDescription("the search keywords").setRequired(true)),
            
    run: async ({client, interaction}) => {
        if (!interaction.member.voice.channel)
                return interaction.editReply("You need to be in a VC to use command")

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()

        let url = interaction.options.getString("search")

        if(url.match("list"))
        {
            console.log("youtube playlist")
            console.log(url)
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            console.log(result)
            if (result.tracks.length === 0)
                    return interaction.editReply("No results")
                
                const playlist = await result.playlist
                await queue.addTracks(result.tracks)
                embed
                    .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                    .setThumbnail(result.tracks[0].thumbnail)
        }
        else if (url.match("www.youtube.com"))
        {
            console.log("here we go")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No Result")

            const song = result.tracks[0]
            console.log(song)
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})**\n\n has been added to the queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }
        else if (url.match(/^https?:\/\/(soundcloud.com|soundcloud.com)(.*)\/sets(.*)$/))
        {
            
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const playlist = await result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(result.tracks[0].thumbnail)
        }
        else if (url.match("album"))
        {
            console.log("spotify ------>")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            console.log(result)
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const playlist = await result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(result.tracks[0].thumbnail)
        }
        else if (url.match("bandcamp.com"))
        {
           
            //return await interaction.editReply("Bandcamp not handled yet !!! work in progress !!!")
            // const result = await client.player.search(url, {
            //     requestedBy: interaction.user,
            //     searchEngine: QueryType.
            // })
            // if (result.tracks.length === 0)
            //     return interaction.editReply("No Result")

            // const song = result.tracks[0]
            // await queue.addTrack(song)
            // embed
            //     .setDescription(`**[${song.title}](${song.url})**\n\n has been added to the queue`)
            //     .setThumbnail(song.thumbnail)
            //     .setFooter({ text: `Duration: ${song.duration}`})
        }
        else{
            console.log("here we go2")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No Result")

            const song = result.tracks[0]
            console.log(song)
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})**\n\n has been added to the queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    },
}