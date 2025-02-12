const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { loadConfigVar, loadChnlMap } = require('./../../backend/loadvar.js');
const { log } = require('./../../backend/debug/log.js');
const fetch = require('node-fetch');
const fs = require('node:fs');
const path = require('path');

const isDocker = require('is-docker');
let configPath
let mappingsPath
if (isDocker() && !process.env.OVERRIDE) {
    try{
        configPath = '/config/config.json';
        mappingsPath = '/config/channelMappings.json';
    } catch (error) {
        console.log("Error loading config files in Docker");
        console.log(error)
    }
} else {
    configPath = path.resolve(__dirname, './../config.json');
    mappingsPath = path.resolve(__dirname, '../../channelMappings.json');
}

log("---- Settings.js Config Paths ----", configPath, mappingsPath);

async function createChannel(guild, name, categoryid) {
    const discordChannelName = name;
    
    let discordChannel = guild.channels.cache.find(
        (channel) => channel.type === 0 && channel.name === discordChannelName
    );

    if (!discordChannel) {
        discordChannel = await guild.channels.create({
            name: discordChannelName,
            type: 0,
            parent: categoryid,
        });
        console.log(`Channel created: ${discordChannelName}, ID: ${discordChannel.id}`);
    }
    return discordChannel.id
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
    /* Not Fully Implemented Yet
    .addSubcommand(subcommand =>
        subcommand
        .setName('ping-detection')
        .setDescription(`Will ping @everone when one of your ingame users get @'ed inside a message`)
        .addBooleanOption((option) =>
            option
                .setname('value')
                .setDescription('value')
                .setRequired(true)
        )
    )*/
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
    
                    let config = {};
    
                    if (fs.existsSync(configPath)) {
                        const fileData = fs.readFileSync(configPath, 'utf-8');
                        config = JSON.parse(fileData);
                    }
    
                    config.mudtoken = chatToken;
                    // config.mudtokendate = 
    
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                    console.log('New mudtoken has been set');
                    log("---- Settings.js - Auth ----", `New mudtoken has been set: ${env.LOG_SENSITIVE_INFO === 'true' ? chatToken : "HIDDEN"}`, payload, `${env.LOG_SENSITIVE_INFO === true ? result : "HIDDEN"}`, config, configPath);
                    await interaction.reply({content: `Config updated successfully! Token has been set.`, flags: MessageFlags.Ephemeral });
                } else {
                    log("---- Settings.js - Auth ----", 'Failed to update mudtoken', payload, result);
                    console.error(result)
                    await interaction.reply({content: `Failed to update config. Server response: ${result.msg || 'Unknown error'}`, flags: MessageFlags.Ephemeral });
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({content: 'An error occurred while updating the config.', flags: MessageFlags.Ephemeral });
            }
        }
        if (option === 'setup') {
            const mudtoken = await loadConfigVar("mudtoken");
            if (!mudtoken || mudtoken === '') {
                await interaction.reply({content: 'No chat token for the mud has been found. Please run /settings auth.', flags: MessageFlags.Ephemeral });
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
                        await interaction.reply({content: 'This command must be run in a guild.', flags: MessageFlags.Ephemeral });
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
                    channelMapping['.sanitize'] = await createChannel(guild, 'hmcc-search', chatCategory.id)
                    for (const user of Object.keys(users)) {
                        
                        let chnlid = await createChannel(guild, user, chatCategory.id)
                        channelMapping[user] = chnlid;
                    }
    
                    if (!fs.existsSync(mappingsPath)) {
                        fs.writeFileSync(mappingsPath, JSON.stringify({}, null, 4)); // Create an empty JSON file
                    }
    
                    fs.writeFileSync(mappingsPath, JSON.stringify(channelMapping, null, 4));
                    
                    log("---- Settings.js - Setup ----", 'Sucessfully ran setup', `${env.LOG_SENSITIVE_INFO === true ? payload : "HIDDEN"}`, result, channelMapping, mappingsPath);
                    await interaction.reply({content: 'Server has been set up successfully, and user channels have been created or reused under the "chat" category.', flags: MessageFlags.Ephemeral });
                } else {
                    log("---- Settings.js - Setup ----", 'Failed to run setup', `${env.LOG_SENSITIVE_INFO === true ? payload : "HIDDEN"}`, result);
                    console.error(result);
                    await interaction.reply({content: `Failed to run setup. Server response: ${result.msg || 'Unknown error'}`, flags: MessageFlags.Ephemeral });
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({content: 'An error occurred in the setup process. Check console for details.', flags: MessageFlags.Ephemeral });
            }
        }
        if (option === 'manage-users') {
            const username = interaction.options.getString('user');
            const pullHistory = interaction.options.getBoolean('pull');
    
            try {
                let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                
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
                
                log("---- Settings.js - Manage Users ----", 'Successfully updated settings', username, pullHistory, config, configPath);
                await interaction.reply({content: `Successfully updated settings for user **${username}**. Pull history: **${pullHistory ? 'Enabled' : 'Disabled'}**`, flags: MessageFlags.Ephemeral });
            } catch (error) {
                console.error(error);
                await interaction.reply({content: 'An error occurred while managing the user settings. Check console for details.', flags: MessageFlags.Ephemeral });
            }
        }
        if (option === 'color') {
            const cmdcolorval = interaction.options.getString('value');
            if (cmdcolorval.match(/^[a-zA-Z0-9]$/) || cmdcolorval == "reset") {
                let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                
                if (cmdcolorval == "reset") {
                    config.setcolor = null;
                    await interaction.reply({content: 'Color has been set to nothing', flags: MessageFlags.Ephemeral });
                } else {
                    config.setcolor = cmdcolorval;
                    await interaction.reply({content: `Color has been set to ${cmdcolorval}`, flags: MessageFlags.Ephemeral });
                }

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');
                log("---- Settings.js - Color ----", 'Successfully updated setting', cmdcolorval, config, configPath);
            } else {
                log("---- Settings.js - Color ----", 'Invalid color value', cmdcolorval);
                await interaction.reply({content: 'Invalid color value. Please use a single alphanumeric character or "reset"', flags: MessageFlags.Ephemeral });
            }
        }
        if (option === 'ping-detection') {
            const value = interaction.options.getBoolean('value');
            try {
                let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                config.pd = value
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');

                await interaction.reply({content: `Successfully updated setting. Ping Detection: **${value ? 'Enabled' : 'Disabled'}**`, flags: MessageFlags.Ephemeral });
                log("---- Settings.js - Ping Detection ----", 'Successfully updated setting', value, config, configPath);
            } catch(error) {
                console.error(error);
                await interaction.reply({content: 'An error occurred while setting this option. Check console for details.', flags: MessageFlags.Ephemeral });
            }
        }
    }
};