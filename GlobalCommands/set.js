const { Client, CommandInteraction } = require('discord.js')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'set',
    description: 'Setup channel/roles',
    options: [
        {
            name: 'main-role',
            type: 'SUB_COMMAND',
            description: 'The member role',
            options: [
                {
                    name: 'role',
                    description: 'The member role',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: 'warns-channel',
            type: 'SUB_COMMAND',
            description: 'The warns channel to display warns',
            options: [
                {
                    name: 'channel',
                    description: 'The warns channel',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'notifications-channel',
            type: 'SUB_COMMAND',
            description: 'The banned-notifications channel only for staff members',
            options: [
                {
                    name: 'channel',
                    description: 'The banned-notification channel only for staff members',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'staff-role',
            type: 'SUB_COMMAND',
            description: 'The staff-role to be tagged',
            options: [
                {
                    name: 'role',
                    description: 'The staff-role to be tagged',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction) {
        try {
            if (interaction.member.permissions.has('ADMINISTRATOR')) {
                const guildID = interaction.guild.id;
                let schema
                const subCommand = interaction.options.getSubcommand()
                switch (subCommand) {
                    case 'main-role':
                        const mainRole = interaction.options.getRole('role')
                        await interaction.reply(`✅ Role: ${mainRole} have been set as the main role.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.mainRole = mainRole
                            await schema.save();
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                mainRole: mainRole,
                            })
                            await schema.save();
                        }

                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        let newMainRole = schema.mainRole;
                        newMainRole = newMainRole.replaceAll('<', '');
                        newMainRole = newMainRole.replaceAll('@', '');
                        newMainRole = newMainRole.replaceAll('&', '');
                        newMainRole = newMainRole.replaceAll('>', '');
                        schema.mainRole = newMainRole
                        await schema.save()

                        break;
                    case 'warns-channel':
                        const warnsChannel = interaction.options.getChannel('channel')
                        await interaction.reply(`✅ Channel: ${warnsChannel} have been set as the warns channel.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.warnsChannel = warnsChannel
                            await schema.save();
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                warnsChannel: warnsChannel,
                            })
                            await schema.save();
                        }

                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        let newWarnsChannel = schema.warnsChannel;
                        newWarnsChannel = newWarnsChannel.replaceAll('<', '');
                        newWarnsChannel = newWarnsChannel.replaceAll('#', '');
                        newWarnsChannel = newWarnsChannel.replaceAll('>', '');
                        schema.warnsChannel = newWarnsChannel
                        await schema.save()

                        break;
                    case 'notifications-channel':
                        const noticationsChannel = interaction.options.getChannel('channel')
                        await interaction.reply(`✅ Channel: ${noticationsChannel} have been set as the notifications channel.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.notificationsChannel = noticationsChannel
                            await schema.save();
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                notificationsChannel: noticationsChannel,
                            })
                            await schema.save();
                        }

                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        let newNotificationsChannel = schema.notificationsChannel;
                        newNotificationsChannel = newNotificationsChannel.replaceAll('<', '');
                        newNotificationsChannel = newNotificationsChannel.replaceAll('#', '');
                        newNotificationsChannel = newNotificationsChannel.replaceAll('>', '');
                        schema.notificationsChannel = newNotificationsChannel
                        await schema.save()

                        break;
                    case 'staff-role':
                        const staffRole = interaction.options.getRole('role')
                        await interaction.reply(`✅ Role: ${staffRole} have been set as the staff role.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.staffRole = staffRole
                            await schema.save();
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                staffRole: staffRole,
                            })
                            await schema.save();
                        }

                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        let newStaffRole = schema.staffRole;
                        newStaffRole = newStaffRole.replaceAll('<', '');
                        newStaffRole = newStaffRole.replaceAll('@', '');
                        newStaffRole = newStaffRole.replaceAll('&', '');
                        newStaffRole = newStaffRole.replaceAll('>', '');
                        schema.staffRole = newStaffRole
                        await schema.save()

                        //Perms for banned channel
                        const results2 = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        const category = interaction.guild.channels.cache.get(results2.bannedCategory)
                        const staff = results2.staffRole.split(' ')
                        for (const role of staff) {
                            await category.permissionOverwrites.edit(role, {
                                VIEW_CHANNEL: true,
                                SEND_MESSAGES: true,
                                READ_MESSAGE_HISTORY: true,
                                MANAGE_MESSAGES: false,
                            });
                        }

                        const channel = interaction.guild.channels.cache.get(results2.bannedChannel)
                        for (const role of staff) {
                            await channel.permissionOverwrites.edit(role, {
                                VIEW_CHANNEL: true,
                                SEND_MESSAGES: false,
                                READ_MESSAGE_HISTORY: true,
                                MANAGE_MESSAGES: false,
                            });
                        }

                        break;
                }
                return;
            }
            await interaction.reply({ content: '**❌ You are not authorized to use this**' });
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... please contact me: Sergetec#6803 🤔**' })
            console.log(err)
        }
    }
}