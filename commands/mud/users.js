const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manage-users')
        .setDescription('Manage whether or not to pull the chat history of specific users')
        .addStringOption((option) =>
            option
                .setName('user')
                .setDescription('The username to manage')
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName('pull')
                .setDescription('Whether or not to pull the chat history of the user')
                .setRequired(true)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('user');
        const pullHistory = interaction.options.getBoolean('pull');

        // Path to config.json
        const configPath = path.resolve(__dirname, '../../config.json');

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

            if (!Array.isArray(config.pullusers)) {
                config.pullusers = [];
            }

            if (pullHistory) {
                if (!config.pullusers.includes(username)) {
                    config.pullusers.push(username);
                }
            } else {
                config.pullusers = config.pullusers.filter((user) => user !== username);
            }

            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');

            await interaction.reply(
                `Successfully updated settings for user **${username}**. Pull history: **${pullHistory ? 'Enabled' : 'Disabled'}**`
            );
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while managing the user settings. Check console for details.');
        }
    },
};
