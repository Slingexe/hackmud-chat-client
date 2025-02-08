const fs = require('fs')
const { readFile } = require('fs/promises');
const path = require('path');
const isDocker = require('is-docker')

const env = process.env

const configPath = path.resolve(__dirname, '../../config.json')

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
            console.log(`Found TOKEN: ${env.TOKEN}`)
        } else {console.log("env.TOKEN not found")}
        if (env.CLIENTID) {
            config.clientId = env.CLIENTID
            console.log(`Found CLIENTID: ${env.CLIENTID}`)
        } else {console.log("env.CLIENTID not found")}
        if (env.GUILDID) {
            config.guildId = env.GUILDID
            console.log(`Found GUILDID: ${env.GUILDID}`)
        } else {console.log("env.GUILDID not found")}

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        const { execSync } = require('child_process');
        execSync('node -e "require(\'./deploy-commands.js\')"', { stdio: 'inherit' });
    } else {
        console.log("Not running inside a dockers")
    }
}

module.exports.dockerstartup = dockerstartup;