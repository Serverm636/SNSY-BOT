const { Client, CommandInteraction } = require('discord.js')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'purge',
    description: 'deletes messages',
    options: [
        {
            name: 'amount',
            type: 'STRING',
            description: 'The amount of messages to be deleted',
            required: true,
        },
        {
            name: 'user',
            type: 'USER',
            description: 'The user of which messages to be deleted',
            required: false,
        },
    ],
    async execute(client, interaction) {
        try {
            const guildId = interaction.guild.id
            let ok = false
            const result = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result.rolesPurge) {
                return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
            }
            const roles = result.rolesPurge.split(" ")

            if (interaction.member.roles.cache.some(r => roles.includes(r.id))) {
                ok = true
            }    
            if (ok === true || interaction.member.permissions.has('ADMINISTRATOR')) {
                let amount = parseInt(interaction.options.getString('amount'))
                if (amount >= 100) {
                    amount = 99
                }
                if (isNaN(amount)) {
                    return await interaction.reply({ content: 'Not a valid number' })
                }
                const Messages = await interaction.channel.messages.fetch();
                const target = interaction.options.getUser('user');
                if (target) {
                    let i = 0
                    const filtered = [];
                    (await Messages).filter((m) => {
                        if (m.author.id === target.id && amount > i) {
                            filtered.push(m);
                            i++
                        }
                    })
                    await interaction.channel.bulkDelete(filtered, true)
                    await interaction.reply('✅')
                }
                else {
                    await interaction.channel.bulkDelete(amount+1)
                    await interaction.reply('✅')
                }
                return
            }
            return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... check if I have the \`Manage Messages\` permission 🤔**' })
            console.log(err)
        }
    }
}