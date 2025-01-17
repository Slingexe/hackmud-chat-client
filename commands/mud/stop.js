const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Run this when you want to stop the bot from pulling the chat history, /init to start again'),
	async execute(interaction) {
		await interaction.reply('Stopping bot...');
	},
};