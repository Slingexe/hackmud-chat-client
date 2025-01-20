const { Events } = require('discord.js');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const fs = require('node:fs');

// Load channel mappings from the JSON file
async function loadChannelMappings() {
    const mapRaw = await readFile(path.resolve(__dirname, '../channelMappings.json'), 'utf8');
    return JSON.parse(mapRaw);
}

async function loadMudToken() {
    const configRaw = await readFile(path.resolve(__dirname, '../config.json'), 'utf8');
    const config = JSON.parse(configRaw);
    return config.mudtoken || [];
}

async function loadSetChannel() {
    const configRaw = await readFile(path.resolve(__dirname, '../config.json'), 'utf8');
    const config = JSON.parse(configRaw);
    
    if (!config.setchannel) {
        return "0000";
    }
    return config.setchannel || [];
}

async function loadChatColor() {
    const configRaw = await readFile(path.resolve(__dirname, '../config.json'), 'utf8');
    const config = JSON.parse(configRaw);
    return config.setcolor || null;
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot == true || message.system == true) return;

        const channelMappings = await loadChannelMappings();
        
        const channelName = Object.keys(channelMappings).find(
            key => channelMappings[key] === message.channel.id
        );

        if (channelName) {
            if (message.content.startsWith('%')) {
                const remainingText = message.content.slice(1).trim();
                
                if (remainingText) {
                    const channel = remainingText;
    
                    const configPath = './config.json';
                    let config = {};
    
                    if (fs.existsSync(configPath)) {
                        const fileData = fs.readFileSync(configPath, 'utf-8');
                        config = JSON.parse(fileData);
                    }

                    config.setchannel = channel;
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                    console.log(`Updated config channel: ${remainingText}`);
                    message.react('✅');
                }
            } else {
                const mudToken = await loadMudToken();
                const setChannel = await loadSetChannel();
                const setColor = await loadChatColor();
                const apiUrl = 'https://www.hackmud.com/mobile/create_chat.json';
                let finalMessage = message.content;
                if (setColor) {
                    finalMessage = "`" + setColor + message.content + "`";
                }
                const payload = {
                    chat_token: mudToken,
                    username: channelName,
                    channel: setChannel,
                    msg: finalMessage,
                };

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
        
                    const result = await response.json();
                    
                    if (result.ok === true) {
                        message.react('✅');
                        console.log(`Message sent to ${setChannel} successfully. Message: ${finalMessage}`);
                    } else {
                        message.react('❌');
                        console.log(`Failed tp send message. Server response: ${result.msg || 'Unknown error'}`);
                    }
                } catch (error) {
                    message.react('❌');
                    console.error(error);
                }
            }
            setTimeout(function(){ 
                message.delete();
            }, 3000);
        }
    },
};
