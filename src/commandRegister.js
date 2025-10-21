const { REST, Routes } = require('discord.js');
const { findCommands } = require('./class/fileExplorer');
const { createLogger, fileName } = require('./class/logger');

require('dotenv').config();

const { TOKEN, CLIENTID } = process.env;

const commands = [];

for (const command of findCommands()) {
    if (Object.keys(command.data).length === 0) {
        console.warn(`File data.js from ${command.name} is empty or wrong`);
        continue;
    }
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log();
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(Routes.applicationCommands(CLIENTID), {
            body: commands,
        });

        return console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        createLogger.error(fileName, error);
    }
})();