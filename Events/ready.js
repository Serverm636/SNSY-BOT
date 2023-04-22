const mongoose = require("mongoose");
const mongoPath = process.env.MONGO_URI;
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')
const { EmbedBuilder, ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    description: 'on startup | expired punishments',
    on: true,
    async execute (client) {
        console.log('SNSY Bot online!')

        await mongoose.connect(mongoPath, {
            keepAlive: true
        }).then(() => {
            console.log('Connected to the database!')
        }).catch((err) => {
            console.log(err)
        });
        let Guilds = client.guilds.cache.map(guild => guild.id)
        let number = 0
        for (let guild of Guilds) {
            guild = client.guilds.cache.get(guild)
            number += guild.memberCount
            let clientID = client.user.id
            const check = async () => {
                const query = {
                    guildID: guild.id,
                    expires: { $lt: new Date() },
                }
                const results = await punishmentSchema.find(query)
                if (!isIterable(results)) {
                    if (!results.mutedRole) {
                        return
                    }
                    const muteRole = results.mutedRole
                    if (!results.warnsChannel) {
                        return
                    }
                    const channel = results.warnsChannel

                    //ARHIVA
                    let arhiva = await archiveSchema.create({
                        guildID: guild,
                        userID: results.userID,
                        staffID: clientID,
                        reason: 'Mute expired',
                        type: 'unmute',
                    })
                    await arhiva.save();

                    await punishmentSchema.deleteMany(query)

                    try {
                        const memberTarget = await guild.members.fetch(userID)
                        if (!memberTarget) {
                            return
                        }
                        memberTarget.roles.remove(muteRole)

                        const message = new EmbedBuilder()
                            .setTitle('UNMUTE')
                            .setColor('GREEN')
                            .addFields({
                                name: 'ID',
                                value: `${memberTarget.id}`,
                                inline: true,
                            })
                            .addFields({
                                name: 'Mention',
                                value: `<@${memberTarget.id}>`,
                                inline: true,
                            })
                            .addFields({
                                name: 'Unmuted by',
                                value: 'SNSY Bot',
                                inline: true,
                            })
                            .addFields({
                                name: 'Reason',
                                value: 'Mute expired',
                                inline: true,
                            })
                            .setTimestamp(Date.now())

                        await client.channels.cache.get(channel).send({ embeds: [message] })
                    } catch (err) {
                        console.log(err)
                    }
                }
                else {
                    for (const result of results) {
                        const query2 = {
                            guildID: guild.id,
                        }
                        const result2 = await guildCommandsSchema.findOne(query2)
                        if (!result2.mutedRole) {
                            continue
                        }
                        const muteRole = result2.mutedRole
                        if (!result2.warnsChannel) {
                            continue
                        }
                        const channel = result2.warnsChannel

                        //ARHIVA
                        let arhiva = await archiveSchema.create({
                            guildID: guild,
                            userID: result.userID,
                            staffID: clientID,
                            reason: 'Mute expired',
                            type: 'unmute',
                        })
                        await arhiva.save();

                        await punishmentSchema.deleteMany(query)

                        try {
                            const memberTarget = await guild.members.fetch(result.userID)
                            if (!memberTarget) {
                                continue
                            }
                            memberTarget.roles.remove(muteRole)

                            const message = new EmbedBuilder()
                                .setTitle('UNMUTE')
                                .setColor('GREEN')
                                .addFields({
                                    name: 'ID',
                                    value: `${memberTarget.id}`,
                                    inline: true,
                                })
                                .addFields({
                                    name: 'Mention',
                                    value: `<@${memberTarget.id}>`,
                                    inline: true,
                                })
                                .addFields({
                                    name: 'Unmuted by',
                                    value: 'SNSY Bot',
                                    inline: true,
                                })
                                .addFields({
                                    name: 'Reason',
                                    value: 'Mute expired',
                                    inline: true,
                                })
                                .setTimestamp(Date.now())

                            await client.channels.cache.get(channel).send({ embeds: [message] })
                        } catch (err) {
                            console.log(err)
                        }
                    }
                }
                setTimeout(check, 1000 * 30)
            }
            await check()
        }
        client.user.setActivity({
            name: `${number} users`,
            type: ActivityType.Watching,
        })
        client.user.setStatus('online')
    }
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false
    }
    return typeof obj[Symbol.iterator] === 'function'
}