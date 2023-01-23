const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'displays help about the commands of the bot',
    async execute(client, interaction) {
        const message = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle('ℹ️ HELP')
            .addFields({
                name: 'HELP',
                value: 'Displays this message'
            })
            .addFields({
                name: 'STATUS',
                value: 'Displays bot statistics'
            })
            .addFields({
                name: 'PERMS',
                value: 'Set the role perms'
            })
            .addFields({
                name: 'SET',
                value: 'Set some channels/roles'
            })
            .addFields({
                name: 'PURGE',
                value: `Purge messages (optional: from a user)\nUsage: \n\`purge 10\` deletes the last 10 messages\n\`purge 10 @Lancer\` deletes the last 10 messages sent by Lancer`
            })
            .addFields({
                name: 'KICK',
                value: `Example: \`kick @Lancer noob\``
            })
            .addFields({
                name: 'MUTE | SOFT BAN',
                value: `Temporarily mutes a member\nUsage: \`mute @Lancer 10m reason\`\n\nTemporarily bans a member\nUsage: \`soft ban @Lancer reason\``
            })
            .addFields({
                name: 'UNMUTE | SOFT UNBAN',
                value: `Unmutes a member\nUsage: \`unmute @Lancer reason\`\n\nUnbans a member\nUsage: \`soft unban @Lancer reason\``
            })
            .addFields({
                name: 'HIST',
                value: 'Shows the user history of a user'
            })
            .addFields({
                name: 'USER INFO',
                value: `Displays information about a specific user\nUsage: \`user info @Lancer\` OR \`user info\` (for your own info)`
            })
            .addFields({
                name: 'SERVER-INFO',
                value: `Displays information about the server`
            })
            .addFields({
                name: 'TICKET UNBAN',
                value: `Generates a new unban ticket`
            })
            .addFields({
                name: 'DELETE',
                value: `Delete the id of an action from the database`
            })
            .addFields({
                name: 'EDIT',
                value: `Edit the reason of an action`
            })
            .setTimestamp(Date.now())
        return await interaction.reply({ embeds: [message] });
    }
}