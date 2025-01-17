const { SlashCommandBuilder } = require('discord.js');
const { mudtoken } = require('./../../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Run this command if it is your first time using the bot'),
    async execute(interaction) {
        if (!mudtoken || mudtoken === '') {
            await interaction.reply('No chat token for the mud has been found. Please run /auth.');
            return;
        }

        const apiUrl = 'https://www.hackmud.com/mobile/account_data.json';

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

            if (result.ok === true) {
                const users = result.users;
                const guild = interaction.guild;

                if (!guild) {
                    await interaction.reply('This command must be run in a guild.');
                    return;
                }

                let chatCategory = guild.channels.cache.find(
                    (channel) => channel.type === 4 && channel.name.toLowerCase() === 'chat'
                );

                if (!chatCategory) {
                    chatCategory = await guild.channels.create({
                        name: 'chat',
                        type: 4,
                    });
                }

                const channelMapping = {};

                for (const [user, channels] of Object.entries(users)) {
                    for (const channelName of Object.keys(channels)) {
                        const discordChannelName = `${user}-${channelName}`;

                        let discordChannel = guild.channels.cache.find(
                            (channel) => channel.type === 0 && channel.name === discordChannelName
                        );

                        if (!discordChannel) {
                            discordChannel = await guild.channels.create({
                                name: discordChannelName,
                                type: 0,
                                parent: chatCategory.id,
                            });
                        }

                        if (!channelMapping[user]) {
                            channelMapping[user] = {};
                        }
                        channelMapping[user][channelName] = discordChannel.id;
                    }
                }

                const mappingsPath = path.resolve(__dirname, '../../channelMappings.json');

                if (!fs.existsSync(mappingsPath)) {
                    fs.writeFileSync(mappingsPath, JSON.stringify({}, null, 4)); // Create an empty JSON file
                }

                fs.writeFileSync(mappingsPath, JSON.stringify(channelMapping, null, 4));

                await interaction.reply('Server has been set up successfully, and channels have been created or reused under the "chat" category.');
            } else {
                console.error(result);
                await interaction.reply(`Failed to run setup. Server response: ${result.msg || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred in the setup process. Check console for details.');
        }
    },
};
