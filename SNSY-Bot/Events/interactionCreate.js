const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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
                return;
            }
            if (!result.bannedCategory) {
                return;
            }
            const category = result.bannedCategory

            if (!result.notificationsChannel) {
                return;
            }
            const canalStaffNotif = result.notificationsChannel

            if (!result.staffRole) {
                return;
            }
            const staff = result.staffRole.split(' ')
            if (interaction.customId === "open-ticket") {
                await interaction.deferUpdate()

                let user = interaction.member.id;
                let nameOfChannel = "unban-" + user;
                if ((interaction.guild.channels.cache.find(c => c.name === nameOfChannel))) {
                    return;
                }
                await interaction.guild.channels.create(`unban-${user}}`, {
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: user,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                        },
                        {
                            id: guildId,
                            deny: ['VIEW_CHANNEL']
                        }
                    ]
                }).then(async channel => {
                    for (const role of staff){
                        await channel.permissionOverwrites.edit(role, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true,
                            MANAGE_MESSAGES: false,
                        });
                    }
                    let row = new MessageActionRow()
                        .addComponents(new MessageButton()
                            .setCustomId("close-ticket")
                            .setLabel("Close the ticket")
                            .setStyle("DANGER")
                        );
                    const mesaj = new MessageEmbed()
                    .setTitle('Ticket')
                    .setDescription('A staff member will take over your ticket as soon as notified.')
                    .setColor('RED')
                    await channel.send({content: `<@${user}> Here is your unban ticket`, embeds: [mesaj], components: [row]});
                    await client.channels.cache.get(canalStaffNotif).send(`<@&${staff}> user <@${user}> opened the unban ticket <#${channel.id}>`)
                });
            }
            else if (interaction.customId === "close-ticket" && interaction.member.roles.cache.has(staff[0])) {
                await interaction.deferUpdate()
                await interaction.channel.delete();
            }
        }

        /*

        SLASH COMMANDS - HANDLER

        */
        if (interaction.isCommand()) {
            // await interaction.deferReply({ ephemeral: false }).catch(() => {});

            const command = client.commands.get(interaction.commandName)
            if (!command) {
                return;
            }
            command.execute(client, interaction);
        }
    }
}