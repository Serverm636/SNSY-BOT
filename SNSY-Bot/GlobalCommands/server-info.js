const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'server-info',
    description: 'displays server info',
    async execute(client, interaction) {
        const { guild } = interaction;
        const mesaj = new MessageEmbed()
        .setColor("RED")
        .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addField(
            'ℹ️ | GENERAL',
            `Name: ${guild.name}
            Created: <t:${parseInt(guild.createdTimestamp / 1000)}:R>
            Owner: <@${guild.ownerId}>`
        )
        .addField(
            '🧑‍💼 | USERS',
            `Total: ${guild.memberCount}`
        )
        .addField(
            '📚 | CHANNELS',
            `- Text: ${guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
            - Voice: ${guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
            - Categories: ${guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
            
            Total: ${guild.channels.cache.size}`
        )
        .addField(
            '🙂 | EMOJIS',
            `- Animated: ${guild.emojis.cache.filter((e) => e.animated).size}
            - Static: ${guild.emojis.cache.filter((e) => !e.animated).size}
            - Stickers: ${guild.stickers.cache.size}
            
            Total: ${guild.stickers.cache.size + guild.emojis.cache.size}`
        )
        .addField(
            '✨ | NITRO',
            `- Boosts: ${guild.premiumSubscriptionCount}`
        )
        .setFooter(`${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
        await interaction.reply({embeds: [mesaj]});
    }
}