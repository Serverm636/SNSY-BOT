const mongoose = require("mongoose");
const { Schema } = mongoose;

const reqString = {
    type: String,
    required: true,
}

const schema = new Schema(
    {
        guildID: reqString,
        userID: reqString,
        staffID: reqString,
        reason: reqString,
        expires: Date,
        type: {
            type: String,
            required: true,
            enum: ['ban', 'mute', 'kick', 'unmute', 'unban'],
        },
    },
    {
        timestamps: true,
    }
)

const name = 'arhiva'

module.exports = mongoose.models[name] || mongoose.model(name, schema, name)