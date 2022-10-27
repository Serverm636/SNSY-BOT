const mongoose = require("mongoose");
const { Schema } = mongoose;

const reqString = {
    type: String,
    required: true,
}

const schema = new Schema(
    {
        guildID: reqString,
        rolesBan: String,
        rolesUnban: String,
        rolesMute: String,
        rolesUnmute: String,
        rolesKick: String,
        rolesHist: String,
        rolesPurge: String,
        mainRole: String,
        bannedRole: String,
        mutedRole: String,
        warnsChannel: String,
        bannedChannel: String,
        bannedCategory: String,
        notificationsChannel: String,
        staffRole: String,
    },
)

const name = 'guilds'

module.exports = mongoose.models[name] || mongoose.model(name, schema, name)