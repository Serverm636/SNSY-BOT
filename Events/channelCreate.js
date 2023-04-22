const guildCommandsSchema = require('../Models/guildCommands-schema')
const { ChannelType } = require('discord.js')

module.exports = {
    name: 'channelCreate',
    description: 'When a channel is created',
    on: true,
    async execute(channel) {
        try {
            let guildId = channel.guild.id
            const result = await guildCommandsSchema.findOne({
                guildID: guildId,
            })
            if (!result.mutedRole) {
                return
            }
            let muted = result.mutedRole

            //Test for existance

            //Muted role
            let ok = channel.guild.roles.cache.find(r => r.id === muted)
            if (typeof ok === undefined) {
                let schema = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                schema.mutedRole = ''
                await schema.save()
                return
            }

            if (channel.type === ChannelType.GuildText) {
                await channel.permissionOverwrites.create(muted, {
                    SendMessages: false,
                })
            }
            else {
                await channel.permissionOverwrites.create(muted, {
                    Speak: false,
                })
            }
        } catch (err) {
            console.log(err)
            console.log(`Probably owner has unchecked the administrator perm`)
        }
    }
}