const { SlashCommandBuilder, MessageFlags, ActivityType } = require('discord.js');
const { fetchNewMessages } = require('./../../backend/fetchNewMessages.js')
const { setChatPullInterval, clearChatPullInterval, getChatPullInterval } = require('./../../backend/pullInterval');
const { log } = require('./../../backend/debug/log.js');

module.exports = {
    category: 'mud',
    data: new SlashCommandBuilder()
	.setName('client')
	.setDescription('Commands to manage the client')
    .addSubcommand(subcommand =>
		subcommand
        .setName('start')
        .setDescription('Starts the bot')
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('stop')
        .setDescription('Stops the bot')
    ),
    async execute(interaction) {
        const option = interaction.options.getSubcommand();
        if (option === 'start') {
            if (getChatPullInterval()) {
                log("Someone tried to start the chat pull loop, but it's already running.");
                await interaction.reply({content: 'Chat pull loop is already running.', flags: MessageFlags.Ephemeral });
                return;
            }
            
            log("Chat pull loop started.");
            await interaction.client.user.setStatus('online');
            await interaction.client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: "Listening for new messages..." });
    
            await interaction.reply({content: 'Bot initialized. Listening for new messages...', flags: MessageFlags.Ephemeral });
    
            const interval = setInterval(() => fetchNewMessages(interaction.client), 5000);
            setChatPullInterval(interval);
        }
        if (option === 'stop') {
            if (getChatPullInterval()) {
                log("Chat pull loop stopped.");
                clearChatPullInterval();

                await interaction.client.user.setStatus('idle');
                await interaction.client.user.setActivity(' for new messages...', { type: ActivityType.Custom, name: "custom", state: "Bot Idle..." });

                await interaction.reply({content: 'Chat pull loop has been stopped.', flags: MessageFlags.Ephemeral });
            } else {
                log("Someone tried to stop the chat pull loop, but it's not running.");
                await interaction.reply({content: 'The chat pull loop is not running.', flags: MessageFlags.Ephemeral });
            }
        }
    }
}