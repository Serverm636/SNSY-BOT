const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'displays help about the commands of the bot',
    async execute(client, interaction) {
        let mesaj = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle('ℹ️ HELP')
            .addField(
                'HELP',
                'Displays this message'
            )
            .addField(
                'STATUS',
                'Displays bot statistics'
            )
            .addField(
                'PERMS',
                'Set the role perms'
            )
            .addField(
                'SET',
                'Set some channels/roles'
            )
            .addField(
                'PURGE',
                `Purge messages (optional: from a user)\nUsage:\n\`purge 10\` deletes the last 10 messages\n\`purge 10 @Lancer\` deletes the last 10 messages sent by Lancer`
            )
            .addField(
                'KICK',
                `Example: \`kick @Lancer noob\``
            )
            .addField(
                'MUTE | SOFT BAN',
                `Temporarily mutes a member\nUsage: \`mute @Lancer 10m reason\`\n\nTemporarily bans a member\nUsage: \`soft ban @Lancer reason\``
            )
            .addField(
                'UNMUTE | SOFT UNBAN',
                `Unmutes a member\nUsage: \`unmute @Lancer reason\`\n\nUnbans a member\nUsage: \`soft- nban @Lancer reason\``
            )
            .addField(
                'HIST',
                'Shows the user history of a user'
            )
            .addField(
                'USER-INFO',
                `Displays information about a specific user\nUsage:\`user info @Lancer\` OR \`user info\` (for your own info)`
            )
            .addField(
                'SERVER-INFO',
                `Displays information about the server`
            )
            .addField(
                'TICKET-UNBAN',
                `Generates new unban ticket`
            )
            .setFooter(`${new Date(interaction.createdTimestamp).toLocaleDateString()}`);
        await interaction.reply({ embeds: [mesaj] });
    }
};