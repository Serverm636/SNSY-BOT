const { ApplicationCommandOptionType, PermissionsBitField} = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: "edit",
    description: "Edits the reason of anything",
    options: [
        {
            name: 'id',
            type: ApplicationCommandOptionType.String,
            description: 'the ID of the action to edit the reason',
            required: true,
        },
        {
            name: 'reason',
            type: ApplicationCommandOptionType.String,
            description: 'the new reason of the action',
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {
            const guildId = await interaction.guild.id
            const result = await guildCommandsSchema.findOne({
                guildID: guildId,
            })
            let ok = false
            if (!result.staffRole) {
                return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
            }
            const staffRole = result.staffRole
            if (interaction.member.roles.cache.some(r => r.id === staffRole) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                ok = true
            }
            if (!ok) {
                return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
            }
            let actionID = interaction.options.getString('id')
            const query = {
                guildID: guildId,
                _id: actionID
            }
            let schema
            let found = false
            let newReason = interaction.options.getString('reason')
            schema = await punishmentSchema.findOne(query)
            if (schema) {
                schema.reason = newReason
                await schema.save()
                found = true
            }
            schema = await archiveSchema.findOne(query)
            if (schema) {
                schema.reason = newReason
                await schema.save()
                found = true
            }
            if (found) {
                return await interaction.reply({ content: `✅ Reason edited. New reason \`${newReason}\`` })
            }
            return await interaction.reply({ content: `❌ ID not found.` })
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... please contact me: Sergetec#6803 🤔**' })
            console.log(err)
        }
    }
}