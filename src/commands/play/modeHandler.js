import classicMode from './gameMode/classicMode.js';

export const modeHandler = async (interaction) => {
    const mode = interaction.options.getString('mode');

    switch (mode) {
        case 'classic':
            return await classicMode(interaction);
        case 'other_mode':
            // Handle other mode logic here
            return await otherMode(interaction);
        default:
            return interaction.reply({
                content: '⚠️ Invalid game mode selected.',
                ephemeral: true
            });
    }
}
