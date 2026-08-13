import { Collection, Events, MessageFlags } from 'discord.js';
import logger from '../class/logger.js';
import fileExplorer from '../class/fileExplorer.js';

const { createLogger, fileName } = logger;

export default async (client) => {
    client.commands = new Collection();

    const rawCommands = await fileExplorer.findCommands();

    for (const rawCommand of rawCommands) {
        const command = rawCommand.default ?? rawCommand;

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            createLogger.warn('One or more commands do not contain "data" or "execute".');
        }
    }

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.client.commands.get(interaction.commandName)) {
            return createLogger.error(`Error for run "${interaction.commandName}"`);
        }

        try {
            await interaction.client.commands.get(interaction.commandName).execute(interaction);
        } catch (error) {
            createLogger.error(fileName, error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    });
};