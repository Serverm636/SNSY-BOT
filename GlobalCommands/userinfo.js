const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'userinfo',
    description: 'Displays informations about a user',
    async execute(client, interaction) {
        try {
            const {guild} = interaction
            const user = interaction.options.getUser('user') || interaction.user
            const member = guild.members.cache.get(user.id)

            const mesaj = new MessageEmbed()
            .setColor("RED")
            .setAuthor({
                name: user.tag,
                iconURL: user.avatarURL({dynamic: true, size: 512})
            })
            .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
            .addFields({
                name: 'ID',
                value: user.id
            })
            .addFields({
                name: 'Mention',
                value: `<@${user.id}>`
            })
            .addFields({
                name: 'Nickname',
                value: member.nickname || user.tag.substring(0, user.tag.length - 5)
            })
            .addFields({
                name: 'Roles',
                value: `${member.roles.cache.map(r => r).join(' ').replace("@everyone", " ") || "None"}`
            })
            .addFields({
                name: 'Joined',
                value: new Date(member.joinedTimestamp).toLocaleDateString(),
                inline: true
            })
            .addFields({
                name: 'Created',
                value: new Date(user.createdTimestamp).toLocaleDateString(),
                inline: true
            })
            .setTimestamp(Date.now())

            return await interaction.reply({ embeds: [mesaj] })
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... maybe the user is not on the server 🤔**' });
            console.log(err)
        }
    }
}