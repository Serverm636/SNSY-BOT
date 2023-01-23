const { MessageEmbed } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'guildMemberAdd',
    description: 'when someone joins the server',
    on: true,
    async execute(member, client) {
        let Guilds = client.guilds.cache.map(guild => guild.id)
        let number = 0
        for (let guild of Guilds) {
            guild = client.guilds.cache.get(guild)
            number += guild.memberCount
        }
        client.user.setActivity({
            name: `${number} users`,
            type: "WATCHING"
        })

        const guildId = member.guild.id;
        const results = await punishmentSchema.find({
            userID: member.id,
            guildID: guildId,
        })
        if (results.length === 0) {
            return;
        }
        for (const result of results) {
            if (result.type === 'ban') {
    
                const result2 = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                if (!result2.bannedRole) {
                    return
                }
                const banRole = result2.bannedRole
    
                member.roles.add(banRole)
            }
            if (result.type === 'mute') {
                const result3 = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                if (!result3.mutedRole) {
                    return
                }
                const muteRole = result3.mutedRole
    
                member.roles.add(muteRole)
            }
        }
    }
}