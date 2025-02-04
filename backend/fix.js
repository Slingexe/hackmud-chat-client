const fs = require('fs')
const { readFile } = require('fs/promises');
const path = require('path');

const configPath = path.resolve(__dirname, '../../config.json')
const cmPath = path.resolve(__dirname, '../../channelmappings.json')

async function fix() {
    try {
        await readFile(configPath, 'utf8');
    } catch(error) {
        let config = { "token":"", "clientId":"", "guildId":"" }
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        console.log("Could not find config.json, created file with defaults")
    }
    
    try {
        await readFile(cmPath, 'utf8');
    } catch(error) {
        let cm = {}
        fs.writeFileSync(cmPath, JSON.stringify(cm, null, 4));
        console.log("Could not find channelmappings.json, created file with defaults")
    }
}

module.exports.fix = fix;