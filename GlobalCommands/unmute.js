const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'unmute',
    description: 'unmutes a member',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be unmute',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the unmute',
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
            if (!result.rolesUnmute) {
                return await interaction.reply({ content: '**❌ You are not authorized to use this**' });
            }
            const roles = result.rolesUnmute.split(" ")

            if (interaction.member.roles.cache.some(r => roles.includes(r.id))) {
                ok = true;
            }
            if (ok === true || interaction.member.permissions.has('ADMINISTRATOR')){
                const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
                const mutedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
                if (user) {
                    const result2 = await guildCommandsSchema.findOne({
                        guildID: guildId
                    })
                    if (!result2.warnsChannel) {
                        return await interaction.reply({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' });
                    }
                    const channel = result2.warnsChannel

                    const result3 = await guildCommandsSchema.findOne({
                        guildID: guildId
                    })
                    if (!result3.mutedRole) {
                        return await interaction.reply({ content: '**❌ The muted role have not been set up. Please use `/set muted-role`**' });
                    }
                    const muteRole = result3.mutedRole

                    let memberTarget = interaction.guild.members.cache.get(user.id);
                    let unmuteReason = interaction.options.getString('reason');

                    await memberTarget.roles.remove(muteRole);

                    await interaction.reply({ content: `✅ <@${memberTarget.user.id}> has been unmuted` });
                    if (!unmuteReason) {
                        unmuteReason = 'No reason provided'
                    }
                    
                    //DELETING FROM DATABASE
                    const query = {
                        guildID: guildId,
                        userID: memberTarget.user.id,
                        type: 'mute',
                    }
                    const results = await punishmentSchema.findOne(query)
                    await punishmentSchema.deleteMany(query)

                    //ARHIVA
                    let arhiva = await archiveSchema.create({
                        guildID: guildId,
                        userID: user.id,
                        staffID: interaction.user.id,
                        reason: unmuteReason,
                        type: 'unmute',
                    })
                    arhiva.save();

                    //#SANCTIUNI
                    const mesaj = new MessageEmbed()
                        .setTitle('UNMUTE')
                        .setColor('GREEN')
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
                            name: 'Unmuted by',
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
                            value: `${unmuteReason}`,
                            inline: true
                        })
                        .setTimestamp(Date.now())

                        return await client.channels.cache.get(channel).send({ embeds: [mesaj] })
                }
            }
            return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... check if my role is above all the other roles 🤔**' })
            console.log(err)
        }
    }
}