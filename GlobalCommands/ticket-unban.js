const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ApplicationCommandOptionType, ButtonStyle } = require('discord.js')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'ticket',
    description: 'Generates the unban ticket',
    options: [
        {
            name: 'unban',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Generates the unban ticket',
        },
    ],
    async execute(client, interaction) {
        try {
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                let row = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setCustomId("open-ticket")
                        .setLabel("Open ticket")
                        .setEmoji("📩")
                        .setStyle(ButtonStyle.Primary)
                    )

                const mesaj = new EmbedBuilder()
                    .setTitle('Unban ticket')
                    .setDescription('If you see this it means that you are banned.\nTo open an unban ticket, please click on the button below.')
                    .setColor('Red')

                const guildId = interaction.guild.id
                let schema = await guildCommandsSchema.findOne({
                    guildID: guildId,
                })
                if (!schema.bannedChannel) {
                    return await interaction.reply({ content: '**❌ You have not set up the banned channel. Please use `/set banned-channel`**' })
                }
                const channel = schema.bannedChannel

                if (!schema.bannedCategory) {
                    return await interaction.reply({ content: '**❌ You have not set up the banned category. Please use `/set banned-category`**' })
                }
                if (!schema.staffRole) {
                    return await interaction.reply({ content: '**❌ You have not set up the staff role. Please use `/set staff-role`**' })
                }
                if (!schema.notificationsChannel) {
                    return await interaction.reply({ content: '**❌ You have not set up the notifications channel for staff. Please use `/set notifications-channel`**' })
                }
                client.channels.cache.get(channel).send({ embeds: [mesaj], components: [row] })
                return await interaction.reply({ content: '✅ Generated' })
            }
            return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
        } catch (err) {
            console.log(err)
            return await interaction.reply({ content: "Something went wrong 🤔 if you don't know what's the issue, contact me via Discord. Sergetec#6803" })
        }
    }
}