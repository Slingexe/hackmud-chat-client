const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Hit a pingpong ball towards the bot'),
    async execute(interaction) {
        await interaction.reply({content: '***pong!***', flags: MessageFlags.Ephemeral})
    }
}