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

            //Test for existance

            //Muted role
            let ok = interaction.guild.roles.cache.find(r => r.id === muted)
            if (typeof ok === undefined) {
                let schema = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                schema.mutedRole = ''
                await schema.save()
                return
            }

            if (channel.type === 'GUILD_TEXT') {
                await channel.permissionOverwrites.create(muted, {
                    SEND_MESSAGES: false,
                })
            }
            else {
                await channel.permissionOverwrites.create(muted, {
                    SPEAK: false,
                })
            }
        } catch (err) {
            console.log(err)
            console.log(`Probably owner has unchecked the administrator perm`)
        }
    }
}