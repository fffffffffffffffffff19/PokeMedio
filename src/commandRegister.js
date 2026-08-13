import { REST, Routes } from 'discord.js';
import fileExplorer from './class/fileExplorer.js';
import logger from './class/logger.js';
import { token, clientId } from "../config.js";

const commands = [];

for (const command of await fileExplorer.findCommands()) {
    if (Object.keys(command.data).length === 0) {
        console.warn(`File data.js from ${command.name} is empty or wrong`);
        continue;
    }
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(token);


try {
    console.log();
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
    });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    await logger.createLogger.error(logger.fileName, error);
}
