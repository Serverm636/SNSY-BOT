const { Client, CommandInteraction } = require('discord.js')

module.exports = {
    name: 'eliminationmap',
    description: 'random elimination map',
    async execute (client, interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR') || !interaction.member.roles.cache.has(999749692361552005)) {
            return await interaction.reply({ content: 'Not allowed!' })
        }
        let nr = getRndInteger(1, 6);
        let map = ''
        switch (nr) {
            case 1:
                map = 'Laser Tracer'
                break
            case 2:
                map = 'Honey Drop'
                break
            case 3:
                map = 'Bombardment'
                break;
            case 4:
                map = 'Block Dash'
                break;
            case 5:
                map = 'Lava Land'
                break;
            case 6:
                map = 'Bot Bash'
                break;
        }
        await interaction.reply({ content: '5' })
        await sleep(1000)
        for (let i = 4; i >= 1; --i) {
            await interaction.editReply({ content: `${i}` })
            await sleep(1000)
        }
        return await interaction.editReply({ content: `Elimination map is: **${map}**` })
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}