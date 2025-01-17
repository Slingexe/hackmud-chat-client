const { SlashCommandBuilder } = require('discord.js');
const { mudtoken } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Starts the bot and pulls chat history, useful when if the bot ever goes offline'),
	async execute(interaction) {
	
			const apiUrl = 'https://www.hackmud.com//mobile/chats.json';
	
			const payload = {
				chat_token: mudtoken,
				
			};
	
			try {
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
	
				const result = await response.json();
	
				if (result.ok == true) {
					const chatToken = result.chat_token;
	
					const configPath = './config.json';
					let config = {};
	
					if (fs.existsSync(configPath)) {
						const fileData = fs.readFileSync(configPath, 'utf-8');
						config = JSON.parse(fileData);
					}
	
					config.mudtoken = chatToken;
	
					fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
	
					await interaction.reply(`Config updated successfully! Token has been set.`);
				} else {
					console.error(result)
					await interaction.reply(`Failed to update config. Server response: ${result.msg || 'Unknown error'}`);
				}
			} catch (error) {
				console.error(error);
				await interaction.reply('An error occurred while updating the config.');
			}
		},
};