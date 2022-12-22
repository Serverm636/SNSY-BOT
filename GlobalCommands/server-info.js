const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'server-info',
    description: 'displays informations about the server',
    async execute(client, interaction) {
        const { guild } = interaction;
        const mesaj = new MessageEmbed()
        .setColor("RED")
        .setAuthor({
            name: guild.name,
            iconURL: guild.iconURL({dynamic: true})
        })
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields({
            name: 'ℹ️ | GENERAL',
            value: `Name: ${guild.name}
            Created: <t:${parseInt(guild.createdTimestamp / 1000)}:R>
            Owner: <@${guild.ownerId}>`
        })
        .addFields({
            name: '🧑‍💼 | USERS',
            value: `Total: ${guild.memberCount}`
        })
        .addFields({
            name: '📚 | CHANNELS',
            value: `- Text: ${guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
            - Voice: ${guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
            - Categories: ${guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
            
            Total: ${guild.channels.cache.size}`
        })
        .addFields({
            name: '🙂 | EMOJIS',
            value: `- Animated: ${guild.emojis.cache.filter((e) => e.animated).size}
            - Static: ${guild.emojis.cache.filter((e) => !e.animated).size}
            - Stickers: ${guild.stickers.cache.size}
            
            Total: ${guild.stickers.cache.size + guild.emojis.cache.size}`
        })
        .addFields({
            name: '✨ | NITRO',
            value: `- Boosts: ${guild.premiumSubscriptionCount}`
        })
        .setFooter({
            text: `${new Date(interaction.createdTimestamp).toLocaleDateString()}`
        })
        await interaction.reply({embeds: [mesaj]});
    }
}