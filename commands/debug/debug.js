const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('node:fs');
const path = require('path');
const { readFile } = require('fs/promises');
const dbgconfigPath = path.resolve(__dirname, '../../dbgconf.json');

async function freply(cmd, val) {
    await interaction.reply({content: `Set ${cmd} **${val ? 'Enabled' : 'Disabled'}**`, flags: MessageFlags.Ephemeral });
}

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

        if (getsubcmd == "logeverything") {
            const val = interaction.options.getBoolean('val');

            try {
                const config = JSON.parse(fs.readFileSync(dbgconfigPath, 'utf-8'));
                
                if (!config) {
                    config = {}
                }

                if (val) {
                    config.dbg = true
                } else {
                    config.dbg = false
                }

                fs.writeFileSync(dbgconfigPath, JSON.stringify(config, null, 4), 'utf-8');

                freply(getsubcmd, val)
            } catch (error) {
                console.error(error);
                await interaction.reply({content: 'An error occurred while managing the user settings. Check console for details.', flags: MessageFlags.Ephemeral });
            }
        }

	},
};