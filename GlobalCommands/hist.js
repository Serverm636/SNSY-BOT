const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js')
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'hist',
    description: 'Shows the hist of a user',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user to show the hist',
            required: true,
        },
    ],
    async execute (client, interaction) {
        try {
            const guildId = interaction.guild.id;
            let ok = false
            const result = await guildCommandsSchema.findOne({
                guildID: guildId,
            })
            if (!result.rolesHist) {
                return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
            }
            const roles = result.rolesHist.split(" ")

            if (interaction.member.roles.cache.some(r => roles.includes(r.id))) {
                ok = true;
            }
            if (ok === true || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const user = interaction.options.getUser('user') //FOLOSIT DOAR LA MEMBERTARGET
                const targetedMember = interaction.options.getUser('user') //FOLOSIT DOAR LA NICKNAME
                let memberTarget = interaction.options.getUser('user')
                if (user) {
                    const results = await archiveSchema.find({
                        guildID: guildId,
                        userID: user.id,
                    })
                    if (results.length === 0) {
                        let message = new EmbedBuilder()
                            .setColor('Red')
                            .addFields({
                                name: `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                                value: 'clean'
                            })
                            .setFooter({
                                text: `${new Date(interaction.createdTimestamp).toLocaleDateString()}`
                            })
                        return await interaction.reply({ embeds: [message] })
                    }
                    let reply = ''
                    const embeds = []
                    let pages = {}
                    let numberCheck = 0
                    let existsPunishments = false
                    let pagina = 0
                    for (const result of results) {
                        reply += `[${result._id}] **${result.type.toUpperCase()}** at ${new Date(result.createdAt).toLocaleDateString()} by <@${result.staffID}> for \`${result.reason}\`\n\n`
                        numberCheck++
                        if (numberCheck % 5 === 0) {
                            pagina++
                            embeds.push(new EmbedBuilder()
                                .setColor('Red')
                                .setFooter({
                                    text: `Page: ${pagina} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`
                                })
                                .addFields({
                                    name: `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                                    value: `${reply}`
                                })
                            )
                            reply = ''
                            existsPunishments = true
                        }
                    }
                    if (numberCheck < 5) { //doar o pagina
                        existsPunishments = true
                        let message = new EmbedBuilder()
                            .setColor('Red')
                            .addFields({
                                name: `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                                value: `${reply}`
                            })
                            .setFooter({
                                text: `${new Date(interaction.createdTimestamp).toLocaleDateString()}`
                            })
                        return await interaction.reply({ embeds: [message] })
                    }
                    if (numberCheck % 5 !== 0) { //adaugam ultima pagina daca nu avem fix 5 pe ultima pagina
                        existsPunishments = true
                        pagina++
                        embeds.push(new EmbedBuilder()
                            .setColor('Red')
                            .addFields({
                                name: `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                                value: `${reply}`
                            })
                            .setFooter({
                                text: `Page: ${pagina} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`
                            })
                        )
                    }
                    if (reply === '' && !existsPunishments) {
                        let message = new EmbedBuilder()
                            .setColor('Red')
                            .addFields({
                                name: `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                                value: 'clean'
                            })
                            .setTimestamp(Date.now())

                        return await interaction.reply({ embeds: [message] })
                    }
                    const getRow = (id) => {
                        const row = new ActionRowBuilder()

                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev_embed')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('⬅️')
                                .setDisabled(pages[id] === 0)
                        )

                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId('next_embed')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('➡️')
                                .setDisabled(pages[id] === embeds.length - 1)
                        )
                        return row
                    }
                    const deadRow = new ActionRowBuilder()
                    deadRow.addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev_disabled')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('⬅️')
                            .setDisabled(true)
                    )

                    deadRow.addComponents(
                        new ButtonBuilder()
                            .setCustomId('next_disabled')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('➡️')
                            .setDisabled(true)
                    )
                    const id = interaction.user.id
                    pages[id] = pages[id] || 0
                    const embed = embeds[pages[id]]
                    let collector
                    const filter = (interaction) => interaction.user.id === id
                    const time = 1000 * 60 * 5
                    await interaction.reply({ embeds: [embed], components: [getRow(id)] })
                    collector = interaction.channel.createMessageComponentCollector({ filter, time })
                    collector.on('collect', async (btnInt) => {
                        if (!btnInt) {
                            return
                        }
                        // interaction.deferReply()
                        if (btnInt.customId !== 'prev_embed' && btnInt.customId !== 'next_embed') {
                            return
                        }
                        await btnInt.deferUpdate()
                        switch (btnInt.customId) {
                            case 'prev_embed':
                                --pages[id]
                                break;
                            case 'next_embed':
                                ++pages[id]
                                break;
                        }
                        await interaction.editReply({ embeds: [embeds[pages[id]]], components: [getRow(id)] })
                    })
                    collector.on('end', async () => {
                        await interaction.editReply({ embeds: [embeds[pages[id]]], components: [deadRow] })
                    })
                    return;
                }
            }
            return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... check if the user is still in the server 🤔**' })
            console.log(err)
        }
    }
}