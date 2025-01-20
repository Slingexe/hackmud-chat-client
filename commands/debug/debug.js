const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('node:fs');
const path = require('path');
const { readFile } = require('fs/promises');
const dbgconfigPath = path.resolve(__dirname, '../../dbgconf.json');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Debug Options')
        .addSubcommand(subcommand =>
            subcommand
                .setName('logeverything')
                .setDescription('Enabling this will log EVERYTHING, this might flood your log')
                .addBooleanOption((option) =>
                    option
                        .setName('val')
                        .setDescription('A Boolean Value')
                        .setRequired(true)
                )
        ),
	async execute(interaction) {
		const getsubcmd = interaction.options.getSubcommand();

        if (getsubcmd == "Log Everything") {
            const val = interaction.options.getBoolean('val');

            try {
                const config = JSON.parse(fs.readFileSync(dbgconfigPath, 'utf-8'));
                
                if (val) {
                    config.dbg = true
                } else {
                    config.dbg = false
                }

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');

                await interaction.reply({});
            } catch (error) {
                console.error(error);
                await interaction.reply('An error occurred while managing the user settings. Check console for details.');
            }
        }

	},
};