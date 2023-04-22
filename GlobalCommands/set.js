const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'set',
    description: 'Setup channel/roles',
    options: [
        {
            name: 'member-roles',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'The member roles',
            options: [
                {
                    name: 'roles',
                    description: 'The member role or roles if there are more default roles. (like separator roles)',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'warns-channel',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'The warns channel to display warns',
            options: [
                {
                    name: 'channel',
                    description: 'The warns channel',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
            ],
        },
        {
            name: 'notifications-channel',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'The banned-notifications channel only for staff members',
            options: [
                {
                    name: 'channel',
                    description: 'The banned-notification channel only for staff members',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
            ],
        },
        {
            name: 'staff-role',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'The staff-role to be tagged',
            options: [
                {
                    name: 'role',
                    description: 'The staff-role to be tagged',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction) {
        try {
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const guildID = interaction.guild.id;
                let schema
                const subCommand = interaction.options.getSubcommand()
                switch (subCommand) {
                    case 'member-roles':
                        let roles = interaction.options.getString('roles')
                        roles = roles.replace(/\s\s+/g, ' ') //delete every duplicate white space
                        const rolesName = roles
                        roles = roles.replaceAll('<', '')
                        roles = roles.replaceAll('@', '')
                        roles = roles.replaceAll('&', '')
                        roles = roles.replaceAll('>', '')
                        await interaction.reply({ content: `✅ Role: ${rolesName} have been set as the member role(s).` })

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.mainRole = roles
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                mainRole: roles,
                            })
                            await schema.save()
                        }

                        break;
                    case 'warns-channel':
                        const warnsChannel = interaction.options.getChannel('channel')
                        let newWarnsChannel = warnsChannel.id
                        await interaction.reply({ content: `✅ Channel: ${warnsChannel} have been set as the warns channel.` })

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.warnsChannel = newWarnsChannel
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                warnsChannel: newWarnsChannel,
                            })
                            await schema.save()
                        }

                        break;
                    case 'notifications-channel':
                        const noticationsChannel = interaction.options.getChannel('channel')
                        let newNotificationsChannel = noticationsChannel.id
                        await interaction.reply({ content: `✅ Channel: ${noticationsChannel} have been set as the notifications channel.` })

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.notificationsChannel = newNotificationsChannel
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                notificationsChannel: newNotificationsChannel,
                            })
                            await schema.save()
                        }

                        break;
                    case 'staff-role':
                        const staffRole = interaction.options.getRole('role')
                        let newStaffRole = staffRole.id
                        await interaction.reply({ content: `✅ Role: ${staffRole} have been set as the staff role.` })

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.staffRole = newStaffRole
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                staffRole: newStaffRole,
                            })
                            await schema.save()
                        }

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
                                ViewChannel: true,
                                SendMessages: false,
                                ReadMessageHistory: true,
                                ManagerMessages: false,
                            })
                        }

                        break
                }
                return
            }
            return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... please contact me: Sergetec#6803 🤔**' })
            console.log(err)
        }
    }
}