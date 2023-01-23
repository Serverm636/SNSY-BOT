const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'channelCreate',
    description: 'when a channel is created',
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
            if (channel.type === 'GUILD_TEXT') {
                await channel.permissionOverwrites.create(muted, {
                    SEND_MESSAGES: false,
                })
            } else {
                await channel.permissionOverwrites.create(muted, {
                    SPEAK: false,
                })
            }
        } catch (err) {
            console.log(err)
            console.log(`Probably owner has unchecked the administrator perm or role doesn\'t exist`)
        }
    }
}