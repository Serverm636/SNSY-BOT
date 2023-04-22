const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')
const ms = require('ms')
const { EmbedBuilder } = require('discord.js')
const punishmentSchema = require('../Models/punishment-schema')
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'mute',
    description: 'Mutes a member',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user to be muted',
            required: true,
        },
        {
            name: 'duration',
            type: ApplicationCommandOptionType.String,
            description: 'The duration of the mute',
            required: true,
        },
        {
            name: 'reason',
            type: ApplicationCommandOptionType.String,
            description: 'The reason for the mute',
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {
            const guildId = interaction.guild.id;
            let ok = false
            const result = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result.rolesMute) {
                return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
            }
            const roles = result.rolesMute.split(' ')

            if (interaction.member.roles.cache.some(r => roles.includes(r.id))) {
                ok = true
            }

            if (ok === true || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const user = interaction.options.getUser('user') //FOLOSIT DOAR LA MEMBERTARGET
                const mutedMember = interaction.options.getUser('user') //FOLOSIT DOAR LA NICKNAME
                if (user) {
                    const result2 = await guildCommandsSchema.findOne({
                        guildID: guildId
                    })
                    if (!result2.mutedRole) {
                        return await interaction.reply({ content: '**❌ The muted role have not been set up. Please use `/set muted-role`**' })
                    }
                    const muteRole = result2.mutedRole

                    const result3 = await guildCommandsSchema.findOne({
                        guildID: guildId
                    })
                    if (!result3.warnsChannel) {
                        return await interaction.reply({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' })
                    }
                    const channel = result3.warnsChannel

                    //Test for existance

                    //Muted role
                    let ok = interaction.guild.roles.cache.find(r => r.id === muteRole)
                    if (typeof ok === undefined) {
                        let schema = await guildCommandsSchema.findOne({
                            guildID: guildId
                        })
                        schema.mutedRole = ''
                        await schema.save()
                        return await interaction.reply({ content: '**❌ The muted role have not been set up. Please use `/set muted-role`**' })
                    }

                    //Warns channel
                    ok = interaction.guild.channels.cache.find(c => c.id === channel)
                    if (typeof ok === undefined) {
                        let schema = await guildCommandsSchema.findOne({
                            guildID: guildId
                        })
                        schema.warnsChannel = ''
                        await schema.save()
                        return await interaction.reply({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' })
                    }


                    let memberTarget = interaction.guild.members.cache.get(user.id);
                    if (memberTarget.roles.cache.some(r => roles.includes(r.id))){
                        return await interaction.reply('**CAN\'T MUTE THAT MEMBER**')
                    }
                    const result = await punishmentSchema.findOne({
                        guilID: guildId,
                        userID: user.id,
                        type: 'mute',
                    })
                    if (result) {
                        return await interaction.reply(`<@${user.id}> is already muted.`)
                    }
                    let time = interaction.options.getString('duration')
                    let muteReason = interaction.options.getString('reason')
                    if (!containsNumber(time)) {
                        return await interaction.reply('Invalid format')
                    }
                    if (containsWhitespace(time)) {
                        return await interaction.reply('Invalid format')
                    }
                    let split = time.match(/\d+|\D+/g)
                    let time2 = parseInt(split[0])
                    //TODO: daca e nr nu merge toLowerCase()
                    // let type = split[1].toLowerCase();
                    let type = split[1]
                    if (type === 'h' && type === 'H' && type === 'hour' && type === 'HOUR') {
                        time2 *= 60
                    }
                    else if (type === 'd' && type === 'D' && type === 'days' && type === 'DAYS') {
                        time2 *= 60 * 24
                    }
                    else if (type !== 'm' && type !== 'M' && type !== 'minutes' && type !== 'MINUTES') {
                        return await interaction.reply('Invalid format.')
                    }

                    await memberTarget.roles.add(muteRole)

                    if (!muteReason) {
                        muteReason = 'No reason provided'
                        await interaction.reply(`<@${memberTarget.user.id}> has been muted for ${ms(ms(time))}`)
                    }
                    else {
                        await interaction.reply(`<@${memberTarget.user.id}> has been muted for ${muteReason}, ${ms(ms(time))}`)
                    }

                    //SANCTIUNI
                    const expires1 = new Date()
                    expires1.setMinutes(expires1.getMinutes() + time2)
                    let schema = await punishmentSchema.create({
                        guildID: guildId,
                        userID: user.id,
                        staffID: interaction.user.id,
                        reason: muteReason,
                        expires: expires1,
                        type: 'mute',
                    })
                    await schema.save();

                    //ARHIVA
                    let arhiva = await archiveSchema.create({
                        guildID: guildId,
                        userID: user.id,
                        staffID: interaction.user.id,
                        reason: muteReason,
                        type: 'mute',
                    })
                    await arhiva.save()

                    //#SANCTIUNI
                    const message = new EmbedBuilder()
                        .setTitle('MUTE')
                        .setColor('Red')
                        .addFields({
                            name: 'ID',
                            value: `${memberTarget.id}`,
                            inline: true
                        })
                        .addFields({
                            name: 'Nickname',
                            value: memberTarget.nickname || mutedMember.tag.substring(0, mutedMember.tag.length - 5),
                            inline: true
                        })
                        .addFields({
                            name: 'Mention',
                            value: `<@${memberTarget.id}>`,
                            inline: true
                        })
                        .addFields({
                            name: 'Muted by',
                            value: `<@${interaction.user.id}>`,
                            inline: true
                        })
                        .addFields({
                            name: 'Nickname',
                            value: interaction.user.nickname || interaction.user.tag.substring(0, interaction.user.tag.length - 5),
                            inline: true
                        })
                        .addFields({
                            name: 'Reason',
                            value: `${muteReason}`,
                            inline: true
                        })
                        .addFields({
                            name: 'Duration',
                            value: `${time}`,
                            inline: true
                        })
                        .setTimestamp(Date.now())
                    return client.channels.cache.get(channel).send({ embeds: [message] })
                }
            }
            await interaction.reply({ content: '**❌ You are not authorized to use this**' });
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... check if my role is above all the other roles 🤔**' })
            console.log(err)
        }
    }
}

function containsNumber(str){
    return /\d/.test(str)
}

function containsWhitespace(str) {
    return /\s/.test(str)
}