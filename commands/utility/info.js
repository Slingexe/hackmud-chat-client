const prettyms = require('pretty-ms')
const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const fetch = require('node-fetch');
const fs = require('node:fs');
const path = require('path');
const { json } = require('node:stream/consumers');

const isDocker = require('is-docker')
let configPath
let chnlMapPath
if (isDocker() && !process.env.OVERRIDE) {
    try{
        configPath = '/config/config.json';
        chnlMapPath = '/config/channelMappings.json';
    } catch (error) {
        console.log("Error loading config files in Docker");
        console.log(error)
    }
} else {
    configPath = path.resolve(__dirname, '../../config.json');
    chnlMapPath = path.resolve(__dirname, '../../channelMappings.json')
}


module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Gets some info from the bot'),
    async execute(interaction, client) {
        const config = json.parse(fs.readFileSync(configPath, 'utf-8'));
        const chnmap = json.parse(fs.readFileSync(chnlMapPath, 'utf-8'));
        let info = {}

        // Displays some required config options
        if (config.clientId && config.clientId !== "") {info.cid = true} else {info.cid = false}
        if (config.guildId && config.guildId !== "") {info.gid = true} else {info.gid = false}
        if (config.mudtoken) {info.mtoken = true} else {info.mtoken = false}
        if (config.pullusers) {info.pu = config.pullusers} else {info.pu = false}

        // Displays some other config variables
        if (config.setcolor) {info.scc = config.setcolor}
        if (config.setchannel) {info.sccnl = config.setchannel}

    }
}