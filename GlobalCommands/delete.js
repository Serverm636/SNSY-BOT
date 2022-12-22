const { Client, CommandInteraction } = require('discord.js')
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')

module.exports = {
    name: 'delete',
    description: 'deletes an id from the database',
    options: [
        {
            name: 'id',
            type: 'STRING',
            description: 'The ID to be deleted',
            required: true,
        },
    ],
    async execute (client, interaction) {
        const guildId = interaction.guild.id
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            const id = interaction.options.getString('id');
            //ARCHIVE SCHEMA
            const query = {
                guildID: guildId,
                _id: id,
            }
            await archiveSchema.deleteMany(query)

            //PUNISHMENT SCHEMA
            await punishmentSchema.deleteMany(query)

            return await interaction.reply({ content: `✅ ${interaction.options.getString('id')} ID removed` });
        }
        await interaction.reply({ content: '**❌ You are not authorized to use this**' });
    }
}
