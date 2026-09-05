import classicMode from './gameMode/classicMode.js';
import findMode from './gameMode/findMode.js';

export const modeHandler = async (interaction) => {
    const mode = interaction.options.getString('mode');

    switch (mode) {
        case 'classic':
            return await classicMode(interaction);
        case 'find_pokemon':
            return await findMode(interaction);
        default:
            return interaction.reply({
                content: '⚠️ Invalid game mode selected.',
                ephemeral: true
            });
    }
}
