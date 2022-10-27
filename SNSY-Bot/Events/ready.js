const mongoose = require("mongoose");
const mongoPath = process.env.MONGO_URI;
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ready',
    description: 'on startup | expired punishments',
    on: true,
    async execute (client, interaction) {
        console.log('SNSY Bot online!');

        await mongoose.connect(mongoPath, {
            keepAlive: true
        }).then(() => {
            console.log('Connected to the database!')
        }).catch((err) => {
            console.log(err);
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
                            return;
                        }
                        const muteRole = results.mutedRole
                        if (!results.warnsChannel) {
                            return;
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
                                return;
                            }
                            memberTarget.roles.remove(muteRole)

                            const mesaj = new MessageEmbed()
                                .setTitle('UNMUTE')
                                .setColor('GREEN')
                                .addField(
                                    'ID',
                                    `${memberTarget.id}`,
                                    true
                                )
                                .addField(
                                    'Mention',
                                    `<@${memberTarget.id}>`,
                                    true
                                )
                                .addField(
                                    'Unmuted by',
                                    'SNSY Bot',
                                    true
                                )
                                .addField(
                                    'Reason',
                                    'Mute expired',
                                    true
                                )
                            await client.channels.cache.get(channel).send({embeds: [mesaj]})
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
                                continue;
                            }
                            const muteRole = result2.mutedRole
                            if (!result2.warnsChannel) {
                                continue;
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
                                console.log(memberTarget.id)
                                if (!memberTarget) {
                                    continue;
                                }
                                memberTarget.roles.remove(muteRole)

                                const mesaj = new MessageEmbed()
                                    .setTitle('UNMUTE')
                                    .setColor('GREEN')
                                    .addField(
                                        'ID',
                                        `${memberTarget.id}`,
                                        true
                                    )
                                    .addField(
                                        'Mention',
                                        `<@${memberTarget.id}>`,
                                        true
                                    )
                                    .addField(
                                        'Unmuted by',
                                        'SNSY Bot',
                                        true
                                    )
                                    .addField(
                                        'Reason',
                                        'Mute expired',
                                        true
                                    )
                                await client.channels.cache.get(channel).send({ embeds: [mesaj] })
                            } catch (err) {
                                console.log(err)
                            }
                        }
                    }



                setTimeout(check, 1000 * 60)
            }
            await check()
        }
        client.user.setActivity({
            name: `${number} users`,
            type: "WATCHING"
        })
        client.user.setStatus('online');
    }
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }