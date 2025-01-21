const { Events, ActivityType } = require('discord.js');
const { setChatPullInterval } = require('./../backend/pullInterval');
const { fetchNewMessages } = require('./../backend/fetchNewMessages.js');
const { readFile } = require('fs/promises');
const path = require('node:path');

async function loadChannelMappings() {
	const mapRaw = await readFile(path.resolve(__dirname, './../channelMappings.json'), 'utf8');
	return JSON.parse(mapRaw);
}
async function loadPullUsers() {
	const configRaw = await readFile(path.resolve(__dirname, './../config.json'), 'utf8');
	const config = JSON.parse(configRaw);
	return config.pullusers || [];
}
async function loadMudToken() {
	const configRaw = await readFile(path.resolve(__dirname, './../config.json'), 'utf8');
	const config = JSON.parse(configRaw);
	return config.mudtoken || [];
}


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setActivity('offline');
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const sMT = loadMudToken();
		const sCM = loadChannelMappings();
		const sPU = loadPullUsers();
		if (sMT) {
			if (sCM) {
				if (sPU) {
					let interval = setInterval(() => fetchNewMessages(client), 5000);
					setChatPullInterval(interval);
		
					client.user.setStatus('online');
					client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: "Listening for new messages..." });
				} else {
					client.user.setStatus('dnd')
					client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: `Run /settings manage-users user:"user" pull:True`});
				}
			} else {
				client.user.setStatus('dnd')
				client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: "Run /setup to setup the bot and server!" });
			}
		} else {
			client.user.setStatus('dnd');
			client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: "No token found, please run /settings auth" });
		}
	},
};