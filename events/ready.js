const { Events, ActivityType } = require('discord.js');
const { setChatPullInterval } = require('./../backend/pullInterval');
const { fetchNewMessages } = require('./../backend/fetchNewMessages.js');
const { loadConfigVar, loadChnlMap } = require('./../backend/loadvar.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		client.user.setActivity('offline');
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const sMT = await loadConfigVar("mudtoken");
		const sCM = await loadChnlMap();
		const sPU = await loadConfigVar("pullusers");

		if (sMT && sMT !== null) {
			if (sCM && sCM !== {}) {
				if (sPU && (sPU !== null || sPU !== [])) {
					let interval = setInterval(() => fetchNewMessages(client), 5000);
					setChatPullInterval(interval);
		
					client.user.setStatus('online');
					client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: "Listening for new messages..." });
				} else {
					client.user.setStatus('dnd')
					client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: `Run /settings manage-users user:"user" pull:True`});
				}
			} else {
				client.user.setStatus('dnd');
				client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: "The Setup hasn't been ran yet, run /settings setup" });
			}
		} else {
			client.user.setStatus('dnd');
			client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: "No mudtoken found, please run /settings auth" });
		}
	},
};