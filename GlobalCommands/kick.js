const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'kick',
    description: 'kicks someone off the server',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be kicked',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the kick',
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
            if (!result.rolesKick) {
                return await interaction.reply({ content: '**❌ You are not authorized to use this**' });
            }
            const roles = result.rolesKick.split(" ")

            const result2 = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result2.warnsChannel) {
                return await interaction.reply({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' });
            }
            const channel = result2.warnsChannel

            if (interaction.member.roles.cache.some(r => roles.includes(r.id))) {
                ok = true;
            }
            if (ok === true || interaction.member.permissions.has('ADMINISTRATOR')) {
                const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
                const kickedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
                if (!user) {
                    return await interaction.reply('Can\'t find that member')
                }
                let memberTarget = interaction.guild.members.cache.get(user.id);
                if (memberTarget.roles.cache.some(r => roles.includes(r.id))) {
                    return await interaction.reply('**CAN\'T KICK THAT MEMBER**');
                }
                const result3 = await archiveSchema.findOne({
                    userID: user.id,
                    type: 'kick',
                })
                if (result3) {
                    return await interaction.reply(`<@${user.id}> is already kicked out.`)
                }
                let kickReason = interaction.options.getString('reason');
                if (!kickReason) {
                    kickReason = 'No reason provided'
                }
                await interaction.reply(`<@${user.id}> was kicked by <@${interaction.user.id}>`)
                await memberTarget.kick({ reason: kickReason });
                
                /*
                    Fara sanctiuni-scheme, pt ca nu are rost daca deja e stocat in arhiva
                */

                //ARHIVA
                let arhiva = await archiveSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: kickReason,
                    type: 'kick',
                })
                arhiva.save();

                //#SANCTIUNI
                let date = new Date()
                const mesaj = new MessageEmbed()
                    .setTitle('KICK')
                    .setColor('RED')
                    .setFooter({
                        text: `${date.toLocaleDateString()}`
                    })
                    .addFields({
                        name: 'ID',
                        value: `${memberTarget.id}`,
                        inline: true
                    })
                    .addFields({
                        name: 'Nickname',
                        value: memberTarget.nickname || kickedMember.tag.substring(0, kickedMember.tag.length - 5),
                        inline: true
                    })
                    .addFields({
                        name: 'Mention',
                        value: `<@${memberTarget.id}>`,
                        inline: true
                    })
                    .addFields({
                        name: 'Kicked by',
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
                        value: `${kickReason}`,
                        inline: true
                    })
                    return client.channels.cache.get(channel).send({ embeds: [mesaj] });
            }
            return await interaction.reply({ content: '**❌ You are not authorized to use this**' });
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... check if my role is above all the other roles 🤔**' })
            console.log(err)
        }
    }
}