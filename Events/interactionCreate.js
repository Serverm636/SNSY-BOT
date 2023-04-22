const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType } = require('discord.js')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'interactionCreate',
    description: 'tickets / slash commands',
    on: true,
    async execute(interaction, client) {
        /*

        TICKET - UNBAN

        */
        if (interaction.isButton()) {
            const guildId = interaction.guild.id
            const result = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result.bannedChannel) {
                return
            }
            if (!result.bannedCategory) {
                return
            }
            const category = result.bannedCategory

            if (!result.notificationsChannel) {
                return
            }
            const canalStaffNotif = result.notificationsChannel

            if (!result.staffRole) {
                return
            }
            const staff = result.staffRole.split(' ')
            if (interaction.customId === "open-ticket") {
                await interaction.deferUpdate()

                let user = interaction.member.id;
                let nameOfChannel = "unban-" + user;
                if ((interaction.guild.channels.cache.find(c => c.name === nameOfChannel))) {
                    return
                }
                await interaction.guild.channels.create({
                    name: `unban-${user}}`,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: user,
                            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                        },
                        {
                            id: guildId,
                            deny: ['ViewChannel']
                        }
                    ]
                }).then(async channel => {
                    for (const role of staff){
                        await channel.permissionOverwrites.edit(role, {
                            ViewChannel: true,
                            SendMessages: true,
                            ReadMessageHistory: true,
                            ManageMessages: false,
                        })
                    }
                    let row = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                            .setCustomId("close-ticket")
                            .setLabel("Close the ticket")
                            .setStyle(ButtonStyle.Danger)
                        );
                    const mesaj = new EmbedBuilder()
                        .setTitle('Unban ticket')
                        .setDescription('A staff member will take over your ticket as soon as possible.')
                        .setColor('Red')
                    await channel.send({ content: `<@${user}> Here is your unban ticket`, embeds: [mesaj], components: [row] })
                    await client.channels.cache.get(canalStaffNotif).send(`<@&${staff}> <@${user}> **has opened an unban request ⇒** <#${channel.id}>`)
                })
            }
            else if (interaction.customId === "close-ticket" && interaction.member.roles.cache.has(staff[0])) {
                await interaction.deferUpdate()
                await interaction.channel.delete()
            }
        }

        /*

        SLASH COMMANDS - HANDLER

        */
        if (interaction.type === InteractionType.ApplicationCommand) {
            // await interaction.deferReply({ ephemeral: false }).catch(() => {});

            const command = client.commands.get(interaction.commandName)
            if (!command) {
                return
            }
            command.execute(client, interaction)
        }
    }
}