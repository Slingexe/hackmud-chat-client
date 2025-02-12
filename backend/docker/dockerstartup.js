const fs = require('fs')
const { readFile } = require('fs/promises');
const path = require('path');
const { log } = require('../debug/log.js');
const isDocker = require('is-docker')

const env = process.env

let configPath
if (isDocker() && !process.env.OVERRIDE) {
    try{
        configPath = '/config/config.json';
    } catch (error) {
        console.log("Error loading config files in Docker");
        console.log(error)
    }
} else {
    configPath = path.resolve(__dirname, '../../config.json');
}

// Ensure config.json exists
if (!fs.existsSync(configPath)) {
    const defaultConfig = { "token": "", "clientId": "", "guildId": "" };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));
    console.log("Could not find config.json, created file with defaults");
}

async function dockerstartup() {
    if (isDocker() && !env.OVERRIDE) {
        console.log('Running inside a Docker container');
        const configRaw = await readFile(configPath, 'utf8');
        let config
        if (configRaw) {
            config = JSON.parse(configRaw);
        } else {
            config = {}
        }

        if (env.TOKEN) {
            config.token = env.TOKEN
            console.log(`Found TOKEN`)
        } else {console.log("env.TOKEN not found")}
        if (env.CLIENTID) {
            config.clientId = env.CLIENTID
            console.log(`Found CLIENTID`)
        } else {console.log("env.CLIENTID not found")}
        if (env.GUILDID) {
            config.guildId = env.GUILDID
            console.log(`Found GUILDID`)
        } else {console.log("env.GUILDID not found")}
        if (env.MUDTOKEN) {
            config.mudtoken = env.MUDTOKEN
            console.log(`Found MUDTOKEN`)
        } else {console.log("env.MUDTOKEN not found")}
        

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        const { execSync } = require('child_process');
        execSync('node -e "require(\'./deploy-commands.js\')"', { stdio: 'inherit' });
    } else {
        console.log("Not running inside a dockers")
    }
    log("---- Docker Startup ----", "-- ENV --", `TOKEN: ${env.LOG_SENSITIVE_INFO === true ? env.TOKEN : "HIDDEN"}`, `CID: ${env.CLIENTID}`, `GID: ${env.GUILDID}`, `MUDTOKEN: ${env.LOG_SENSITIVE_INFO === true ? env.MUDTOKEN : "HIDDEN"}`, `OVERRIDE: ${env.OVERRIDE === true ? "True" : "False"}`, "-- PATHS --", configPath);
}

module.exports.dockerstartup = dockerstartup;