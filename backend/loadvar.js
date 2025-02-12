const fs = require('fs');
const { readFile } = require('fs/promises');
const path = require('path');
const { log } = require('./debug/log.js');
const isDocker = require('is-docker')

let configPath
let channelMappingsPath

if (isDocker() && !process.env.OVERRIDE) {
    try{
        configPath = '/config/config.json';
        channelMappingsPath = '/config/channelMappings.json';
    } catch (error) {
        console.log("Error loading config files in Docker");
        console.log(error)
    }
} else {
    configPath = path.resolve(__dirname, './../config.json');
    channelMappingsPath = path.resolve(__dirname, './../channelMappings.json');
}
log("---- LoadVar.js Config Paths ----", configPath, channelMappingsPath);

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
        log(`LoadConfigVar was called, Input: ${key}, Output: ${config[key]}`);
        return config[key] ?? null; // Return null if key doesn't exist
    } catch (error) {
        console.error(`Error loading config variable "${key}":`, error.message);
        return null;
    }
}

async function loadChnlMap() {
    try {
        const mapRaw = await readFile(channelMappingsPath, 'utf8');
        log(`LoadChnlMap was called, Output: ${mapRaw}`);
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
