const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { loadConfigVar, loadChnlMap } = require('./../../backend/loadvar.js');
const fetch = require('node-fetch');

module.exports = { 
    category: 'mud',
    data: new SlashCommandBuilder()
	.setName('tell')
	.setDescription('tell a message to a user')
    .addStringOption(option =>
        option
            .setName('user')
            .setDescription('Their username')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('msg')
            .setDescription('The message to send')
            .setRequired(true)
    ),
    async execute(interaction) {
        const tellusr = interaction.options.getString('user').toLowerCase();
        const tellmsg = interaction.options.getString('msg');
        
        const channelMappings = await loadChnlMap();
        const channelName = Object.keys(channelMappings).find(
            key => channelMappings[key] === interaction.channelId
        );

        const mudToken = await loadConfigVar("mudtoken");
        const setColor = await loadConfigVar("setcolor");
        const apiUrl = 'https://www.hackmud.com/mobile/create_chat.json';
        let finalMessage = tellmsg;
        if (setColor) {
            finalMessage = "`" + setColor + tellmsg + "`";
        }
        const payload = {
            chat_token: mudToken,
            username: channelName,
            tell: tellusr,
            msg: finalMessage,
        }
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.ok === true) {
                console.log(`Message sent to ${tellusr} successfully. Message: ${tellmsg}`);
                interaction.reply({content: `Message sent to ${tellusr} successfully. Message: ${tellmsg}`, flags: MessageFlags.Ephemeral });
            } else {
                console.log(`Failed tp send message. Server response: ${result.msg || 'Unknown error'}`);
                interaction.reply({content: `Failed to send message to ${tellusr}, Server Error: ${result.msg}`, flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            console.error(error);
        }
    }
};