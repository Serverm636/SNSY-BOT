const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'user',
    description: 'displays informations about a user',
    options: [
        {
            name: 'info',
            type: 'SUB_COMMAND',
            description: 'displays informations about a user',
            options: [
                {
                    name: 'user',
                    type: 'USER',
                    description: 'The user to be banned',
                    required: false,
                },
            ],
        },
    ],
    async execute(client, interaction) {
        try {
            const {guild} = interaction
            const user = interaction.options.getUser('user') || interaction.user
            const member = guild.members.cache.get(user.id)

            const mesaj = new MessageEmbed()
            .setColor("RED")
            .setAuthor(user.tag, user.avatarURL({dynamic: true, size: 512}))
            .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
            .addField('ID', user.id)
            .addField('Mention', `<@${user.id}>`)
            .addField('Nickname', member.nickname || user.tag.substring(0, user.tag.length - 5))
            .addField('Roles', `${member.roles.cache.map(r => r).join(' ').replace("@everyone", " ") || "None"}`)
            .addField('Joined', new Date(member.joinedTimestamp).toLocaleDateString(), true)
            .addField('Created', new Date(user.createdTimestamp).toLocaleDateString(), true)
            .setFooter(`${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
            await interaction.reply({ embeds: [mesaj] });
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... maybe the user is not on the server 🤔**' });
            console.log(err)
        }
    }
}