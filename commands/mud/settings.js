const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('node:fs');
const path = require('path');
const { readFile } = require('fs/promises');
const configPath = path.resolve(__dirname, '../../config.json');

async function loadMudToken() {
    const configRaw = await readFile(path.resolve(__dirname, '../../config.json'), 'utf8');
    const config = JSON.parse(configRaw);
    return config.mudtoken || [];
}


module.exports = {
    category: 'mud',
    data: new SlashCommandBuilder()
	.setName('settings')
	.setDescription('The settings for the bot')
    .addSubcommand(subcommand =>
		subcommand
        .setName('auth')
        .setDescription('Required every 45 days for authentication')
        .addStringOption(option =>
            option
                .setName('password')
                .setDescription('The password from chat_pass')
                .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('setup')
        .setDescription('Run this command if it is your first time using the bot')
    )
    .addSubcommand(subcommand =>
		subcommand
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
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('color')
        .setDescription('The hackmud color you want to use when sending a message from discord, use reset to remove the color')
        .addStringOption(option =>
            option 
                .setName('value')
                .setDescription('value')
                .setRequired(true)
        )
    ),
    async execute(interaction) {
        const option = interaction.options.getSubcommand();

        if (option === 'auth') {
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
                    console.log('New mudtoken has been set:', chatToken)
                    await interaction.reply(`Config updated successfully! Token has been set.`);
                } else {
                    console.error(result)
                    await interaction.reply(`Failed to update config. Server response: ${result.msg || 'Unknown error'}`);
                }
            } catch (error) {
                console.error(error);
                await interaction.reply('An error occurred while updating the config.');
            }
        }
        if (option === 'setup') {
            const mudtoken = await loadMudToken();
            if (!mudtoken || mudtoken === '') {
                await interaction.reply('No chat token for the mud has been found. Please run /settings auth.');
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
                        console.log('Chat category created');
                    }
    
                    const channelMapping = {};
    
                    for (const user of Object.keys(users)) {
                        const discordChannelName = user;
    
                        let discordChannel = guild.channels.cache.find(
                            (channel) => channel.type === 0 && channel.name === discordChannelName
                        );
    
                        if (!discordChannel) {
                            discordChannel = await guild.channels.create({
                                name: discordChannelName,
                                type: 0,
                                parent: chatCategory.id,
                            });
                            console.log(`Channel created: ${discordChannelName}, ID: ${discordChannel.id}`);
                        }
    
                        channelMapping[user] = discordChannel.id;
                    }
    
                    const mappingsPath = path.resolve(__dirname, '../../channelMappings.json');
    
                    if (!fs.existsSync(mappingsPath)) {
                        fs.writeFileSync(mappingsPath, JSON.stringify({}, null, 4)); // Create an empty JSON file
                    }
    
                    fs.writeFileSync(mappingsPath, JSON.stringify(channelMapping, null, 4));
    
                    await interaction.reply('Server has been set up successfully, and user channels have been created or reused under the "chat" category.');
                } else {
                    console.error(result);
                    await interaction.reply(`Failed to run setup. Server response: ${result.msg || 'Unknown error'}`);
                }
            } catch (error) {
                console.error(error);
                await interaction.reply('An error occurred in the setup process. Check console for details.');
            }
        }
        if (option === 'manage-users') {
            const username = interaction.options.getString('user');
            const pullHistory = interaction.options.getBoolean('pull');
    
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                
                if (!Array.isArray(config.pullusers)) {
                    config.pullusers = [];
                    console.log('Added pullusers array to config');
                }
                
                if (pullHistory) {
                    if (!config.pullusers.includes(username)) {
                        config.pullusers.push(username);
                        console.log(`Added user ${username} to pullusers`);
                    }
                } else {
                    config.pullusers = config.pullusers.filter((user) => user !== username);
                    console.log(`Removed user ${username} from pullusers`);
                }
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');
    
                await interaction.reply(
                    `Successfully updated settings for user **${username}**. Pull history: **${pullHistory ? 'Enabled' : 'Disabled'}**`
                );
            } catch (error) {
                console.error(error);
                await interaction.reply('An error occurred while managing the user settings. Check console for details.');
            }
        }
        if (option === 'color') {
            const cmdcolorval = interaction.options.getString('value');
            if (cmdcolorval.match(/^[a-zA-Z0-9]$/) || cmdcolorval == "reset") {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                
                if (cmdcolorval == "reset") {
                    config.setcolor = null;
                    await interaction.reply('Color has been set to nothing');
                } else {
                    config.setcolor = cmdcolorval;
                    await interaction.reply(`Color has been set to ${cmdcolorval}`);
                }

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');
            } else {
                await interaction.reply('Invalid color value. Please use a single alphanumeric character or "reset"');
            }
        }
    }
};