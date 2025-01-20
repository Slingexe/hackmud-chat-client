const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { setChatPullInterval } = require('./backend/pullInterval');
const { token } = require('./config.json');

const fs = require('node:fs');
const path = require('node:path');
const { readFile } = require('fs/promises');

async function loadChannelMappings() {
	const mapRaw = await readFile(path.resolve(__dirname, 'channelMappings.json'), 'utf8');
	return JSON.parse(mapRaw);
}
async function loadPullUsers() {
	const configRaw = await readFile(path.resolve(__dirname, 'config.json'), 'utf8');
	const config = JSON.parse(configRaw);
	return config.pullusers || [];
}
async function loadMudToken() {
	const configRaw = await readFile(path.resolve(__dirname, 'config.json'), 'utf8');
	const config = JSON.parse(configRaw);
	return config.mudtoken || [];
}
const sCM = loadChannelMappings();
const sPU = loadPullUsers();
const sMT = loadMudToken();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,],});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

if (sMT) {
	if (sCM) {
		
	} else {
		client.user.setStatus('dnd')
		client.user.setActivity(' for new messages...', { type: ActivityType.Custom, name: "custom", state: "Run /setup to setup the bot and server!" });
	}
} else {
	client.user.setStatus('dnd');
	client.user.setActivity(' for new messages...', { type: ActivityType.Custom, name: "custom", state: "No token found, please run /settings auth" });
}