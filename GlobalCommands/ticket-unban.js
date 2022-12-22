const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'ticket',
    description: 'generates the unban ticket',
    options: [
        {
            name: 'unban',
            type: 'SUB_COMMAND',
            description: 'generates the unban ticket',
        },
    ],
    async execute(client, interaction) {
        try {
            if (interaction.member.permissions.has('ADMINISTRATOR')) {
                let row = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setCustomId("open-ticket")
                        .setLabel("Open ticket")
                        .setEmoji("📩")
                        .setStyle("PRIMARY")
                    );
                const mesaj = new MessageEmbed()
                    .setTitle('Unban ticket')
                    .setDescription('If you see this it means that you are banned.\nTo open an unban ticket, please click on the button below.')
                    .setColor('RED')

                const guildId = interaction.guild.id
                let schema = await guildCommandsSchema.findOne({
                    guildID: guildId,
                })
                if (!schema.bannedChannel) {
                    return await interaction.reply({content: '**❌ You have not set up the banned channel. Please use `/set banned-channel`**'})
                }
                const channel = schema.bannedChannel

                if (!schema.bannedCategory) {
                    return await interaction.reply({content: '**❌ You have not set up the banned category. Please use `/set banned-category`**'})
                }
                if (!schema.staffRole) {
                    return await interaction.reply({content: '**❌ You have not set up the staff role. Please use `/set staff-role`**'})
                }
                if (!schema.notificationsChannel) {
                    return await interaction.reply({content: '**❌ You have not set up the notifications channel for staff. Please use `/set notifications-channel`**'})
                }
                client.channels.cache.get(channel).send({embeds: [mesaj], components: [row]})
                return await interaction.reply({content: '✅ Generated'})
            }
            return await interaction.reply({content: '**❌ You are not authorized to use this**'})
        } catch (err) {
            console.log(err)
            return await interaction.reply({ content: "Something went wrong 🤔 if you don't know what's the issue, contact me via Discord. Sergetec#6803" })
        }
    }
}