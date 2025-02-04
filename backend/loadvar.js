const fs = require('fs');
const { readFile } = require('fs/promises');
const path = require('path');

const configPath = path.resolve(__dirname, './../config.json');
const channelMappingsPath = path.resolve(__dirname, './../channelMappings.json');

// Ensure config.json exists
if (!fs.existsSync(configPath)) {
    const defaultConfig = { "token": "", "clientId": "", "guildId": "" };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));
    console.log("Could not find config.json, created file with defaults");
}

// Ensure channelMappings.json exists
if (!fs.existsSync(channelMappingsPath)) {
    fs.writeFileSync(channelMappingsPath, JSON.stringify({}, null, 4));
    console.log("Could not find channelMappings.json, created file with defaults");
}

async function loadConfigVar(key) {
    try {
        const configRaw = await readFile(configPath, 'utf8');
        const config = JSON.parse(configRaw);
        return config[key] ?? null; // Return null if key doesn't exist
    } catch (error) {
        console.error(`Error loading config variable "${key}":`, error.message);
        return null;
    }
}

async function loadChnlMap() {
    try {
        const mapRaw = await readFile(channelMappingsPath, 'utf8');
        return JSON.parse(mapRaw);
    } catch (error) {
        console.error("Error loading channel mappings:", error.message);
        return false;
    }
}

module.exports = {
    loadConfigVar,
    loadChnlMap
};
