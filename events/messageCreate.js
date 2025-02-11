const { Events } = require('discord.js');
const { loadConfigVar, loadChnlMap } = require('./../backend/loadvar.js');
const { readFile } = require('fs/promises');
const fs = require('node:fs');
const path = require('path');
const isDocker = require('is-docker')
let configPath
if (isDocker() && !process.env.OVERRIDE) {
    try{
        configPath = '/config/config.json';
    } catch (error) {
        console.log("Error loading config files in Docker");
        console.log(error)
    }
} else {
    configPath = path.resolve(__dirname, './../config.json');
}


module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot == true || message.system == true) return;

        const channelMappings = await loadChnlMap();
        
        const channelName = Object.keys(channelMappings).find(
            key => channelMappings[key] === message.channel.id
        );
        if (channelName == ".sanitize") {return}
        if (channelName) {
            if (message.content.startsWith('%')) {
                const remainingText = message.content.slice(1).trim();
                
                if (remainingText) {
                    try {
                        const channel = remainingText;
                        
                        let config = {};
        
                        if (fs.existsSync(configPath)) {
                            const fileData = fs.readFileSync(configPath, 'utf-8');
                            config = JSON.parse(fileData);
                        }
    
                        config.setchannel = channel;
                        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                        message.react('✅');
                    } catch (error) { 
                        console.log(error);
                        message.react('❌');
                    }
                }
            } else {
                const mudToken = await loadConfigVar("mudtoken");
                const setChannel = await loadConfigVar("setchannel");
                const setColor = await loadConfigVar("setcolor");
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
                        //console.log(`Message sent to ${setChannel} successfully. Message: ${finalMessage}`);
                    } else {
                        message.react('❌');
                        console.log(`Failed to send message. Server response: ${result.msg || 'Unknown error'}`);
                    }
                } catch (error) {
                    message.react('❌');
                    console.log(error);
                }
            }
            setTimeout(function(){ 
                message.delete();
            }, 3000);
        }
    },
};
