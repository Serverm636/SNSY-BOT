const { MessageEmbed } = require('discord.js');
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'guildCreate',
    description: 'when bot joins a new guild',
    on: true,
    async execute(guild) {
        try {
            let channelToSend = ""
            guild.channels.cache.forEach((channel) => {
                if (channel.type === 'GUILD_TEXT' && channelToSend === "") {
                    if (channel.permissionsFor(guild.me).has('SEND_MESSAGES') && channel.permissionsFor(guild.me).has('VIEW_CHANNEL')) {
                        channelToSend = channel
                    }
                }
            })
            // channelToSend = guild.channels.cache.find(channel =>  channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES') && channel.permissionsFor(guild.me).has('VIEW_CHANNEL'))
            if (!channelToSend) {
                return;
            }
            const message1 = new MessageEmbed()
                .setTitle('SNSY Bot')
                .setDescription(
                    `👋 **Hi, my name is SNSY and I will help you moderate this community as smoothly as possible.**
            
            __Here's a quick tutorial on how to use the bot at full capability:__

            👉 To start off, please use the \`/perms\` and \`/set\` commands, if you need any additional help with the commands please refer to \`/help\`
            👉 I have created some new channels and some new roles, those being: \`BANNED category\` and \`#banned channel\`, as well as a \`Muted\` role and a \`Banned\` role
            
            ❗ The banned category, channel and role will be used for the soft-ban technique that I have implemented
            ❗ **Please leave all the permissions as they are right now. Changing them means that you know what you are doing**
            ❗ **If you do plan to move the Muted/Banned roles higher, consider putting my roles above those so that I will be able to manage them**
            
            👍 You can always change the color/aesthetics of the roles

            ❓ The warning *id* of a user can be found using \`/hist\` -> that long string of characters between these []
            ❗ By deleting someone's warning *id* you are deleting that warning from your guild database and this can't be undone


            ❓ Here\'s the creator\'s discord, if you encounter any problems or you wish to make a suggestion you can always contact him: **\`Sergetec#6803\`**`
                )
                .setColor('#5100FF')

            await channelToSend.send({ embeds: [message1] })

            const message2 = new MessageEmbed()
                .setTitle('SNSY Bot')
                .setDescription(
                    `❗ **You will have to either push my role the highest or make the role for bots the highest, so that I will have permission to manage all roles**`
                )
                .setColor('RED')
                .setTimestamp(Date.now())

            await channelToSend.send({ embeds: [message2] })
            let schema
            await guild.roles.create({
                name: 'Muted',
                color: 'DARK_RED',
            }).then(async (role) => {
                await role.setPermissions(['READ_MESSAGE_HISTORY', 'CONNECT'])

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guild.id,
                })
                if (schema) {
                    schema.mutedRole = role
                    await schema.save();
                } else {
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guild.id,
                        mutedRole: role,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guild.id,
                })
                let newMutedRole = schema.mutedRole;
                newMutedRole = newMutedRole.replaceAll('<', '');
                newMutedRole = newMutedRole.replaceAll('@', '');
                newMutedRole = newMutedRole.replaceAll('&', '');
                newMutedRole = newMutedRole.replaceAll('>', '');
                schema.mutedRole = newMutedRole
                await schema.save()

                guild.channels.cache.forEach(channel => {
                    if (channel.type === 'GUILD_TEXT') {
                        channel.permissionOverwrites.create(role, {
                            SEND_MESSAGES: false,
                        })
                    }
                    else {
                        channel.permissionOverwrites.create(role, {
                            SPEAK: false,
                        })
                    }
                })
            })

            await guild.roles.create({
                name: 'Banned',
                color: 'GREY',
            }).then(async (role) => {
                await role.setPermissions(['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'])

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guild.id,
                })
                if (schema) {
                    schema.bannedRole = role
                    await schema.save();
                } else {
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guild.id,
                        bannedRole: role,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guild.id,
                })
                let newBannedRole = schema.bannedRole;
                newBannedRole = newBannedRole.replaceAll('<', '');
                newBannedRole = newBannedRole.replaceAll('@', '');
                newBannedRole = newBannedRole.replaceAll('&', '');
                newBannedRole = newBannedRole.replaceAll('>', '');
                schema.bannedRole = newBannedRole
                await schema.save()

            })

            let bannedRole = guild.roles.cache.find(role => role.name === 'Banned')
            const category = await guild.channels.create('BANNED', {
                type: 'GUILD_CATEGORY',
                permissionOverwrites: [
                    {
                        id: bannedRole,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: guild.id,
                        deny: ['VIEW_CHANNEL']
                    }
                ]
            })
            //Check for the same guild -> update
            schema = await guildCommandsSchema.findOne({
                guildID: guild.id,
            })
            if (schema) {
                schema.bannedCategory = category
                await schema.save();
            } else {
                //DATABASE
                schema = await guildCommandsSchema.create({
                    guildID: guild.id,
                    bannedCategory: category,
                })
                await schema.save();
            }

            schema = await guildCommandsSchema.findOne({
                guildID: guild.id,
            })
            let newBannedCategory = schema.bannedCategory;
            newBannedCategory = newBannedCategory.replaceAll('<', '');
            newBannedCategory = newBannedCategory.replaceAll('#', '');
            newBannedCategory = newBannedCategory.replaceAll('>', '');
            schema.bannedCategory = newBannedCategory
            await schema.save()

            const channel = await guild.channels.create('banned', {
                parent: category,
                permissionOverwrites: [
                    {
                        id: bannedRole,
                        deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                    },
                    {
                        id: guild.id,
                        deny: ['VIEW_CHANNEL']
                    }
                ]
            })
            //Check for the same guild -> update
            schema = await guildCommandsSchema.findOne({
                guildID: guild.id,
            })
            if (schema) {
                schema.bannedChannel = channel
                await schema.save();
            } else {
                //DATABASE
                schema = await guildCommandsSchema.create({
                    guildID: guild.id,
                    bannedChannel: channel,
                })
                await schema.save();
            }

            schema = await guildCommandsSchema.findOne({
                guildID: guild.id,
            })
            let newBannedChannel = schema.bannedChannel;
            newBannedChannel = newBannedChannel.replaceAll('<', '');
            newBannedChannel = newBannedChannel.replaceAll('#', '');
            newBannedChannel = newBannedChannel.replaceAll('>', '');
            schema.bannedChannel = newBannedChannel
            await schema.save()
        } catch (err) {
            console.log(err)
            console.log("Probably user has unchecked the Administrator perm")
        }
    }
}