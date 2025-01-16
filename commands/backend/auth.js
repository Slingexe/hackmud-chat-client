const { SlashCommandBuilder } = require('discord.js');
const fetch = require('axios');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('auth')
        .setDescription('Required every 45 days for authentication')
        .addStringOption(option =>
            option
                .setName('password')
                .setDescription('The password from chat_pass')
                .setRequired(true)
        ),
	async execute(interaction) {
        const chatpass = interaction.options.getString('password');

        const apiUrl = 'https://www.hackmud.com/mobile/get_token.json';

        const payload = {
            pass: chatpass,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                const chatToken = result.chat_token;

                const configPath = './config.json';
                let config = {};

                if (fs.existsSync(configPath)) {
                    const fileData = fs.readFileSync(configPath, 'utf-8');
                    config = JSON.parse(fileData);
                }

                config.chat_token = chatToken;

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

                await interaction.reply(`Config updated successfully! Token has been set.`);
            } else {
                await interaction.reply(`Failed to update config. Server response: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while updating the config.');
        }
    },
};