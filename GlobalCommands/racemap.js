const { Client, CommandInteraction } = require('discord.js')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'racemap',
    description: 'random race map',
    async execute (client, interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR') || !interaction.member.roles.cache.has(999749692361552005)) {
            return await interaction.reply({ content: 'Not allowed!' })
        }
        let nr = getRndInteger(1, 10);
        let map = ''
        switch (nr) {
            case 1:
                map = 'Jungle Roll'
                break
            case 2:
                map = 'Over and Under'
                break
            case 3:
                map = 'Icy Heights'
                break;
            case 4:
                map = 'Space Race'
                break;
            case 5:
                map = 'Cannon Climb'
                break;
            case 6:
                map = 'Pivot Rush'
                break;
            case 7:
                map = 'Lava Rush'
                break;
            case 8:
                map = 'Paint Splash'
                break;
            case 9:
                map = 'Lost Temple'
                break;
            case 10:
                map = 'Super Slide'
                break;
        }
        await interaction.reply({ content: '5' })
        await sleep(1000)
        for (let i = 4; i >= 1; --i) {
            await interaction.editReply({ content: `${i}` })
            await sleep(1000)
        }
        return await interaction.editReply({ content: `Race map is: **${map}**` })
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}