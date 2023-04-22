const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'serverinfo',
    description: 'Displays informations about the server',
    async execute(client, interaction) {
        const { guild } = interaction
        const message = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({
                name: guild.name,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields({
                name: ':id: Server ID',
                value: `${guild.id}`,
                inline: true,
            })
            .addFields({
                name: ':date: Created',
                value: `**<t:${parseInt(guild.createdTimestamp / 1000)}:R>**`,
                inline: true,
            })
            .addFields({
                name: ':crown: Owner',
                value: `<@${guild.ownerId}>`,
                inline: true,
            })
            .addFields({
                name: ':busts_in_silhouette: Users',
                value: `**${guild.memberCount}** Users
                **${guild.premiumSubscriptionCount}** Boosts`,
                inline: true,
            })
            .addFields({
                name: ':speech_balloon: CHANNELS',
                value: `**${guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}** Text | **${guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}** Voice
                **${guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}** Categories`,
                inline: true,
            })
            .addFields({
                name: '🙂 EMOJIS',
                value: `**${guild.emojis.cache.filter((e) => e.animated).size}** Animated | **${guild.emojis.cache.filter((e) => !e.animated).size}** Static
                **${guild.stickers.cache.size}** Stickers`,
                inline: true,
            })
            .setTimestamp(Date.now())

        return await interaction.reply({ embeds: [message] })
    }
}