import { modeHandler } from './modeHandler.js';

export default async (interaction) => {
    try {
        await modeHandler(interaction);
    } catch (error) {
        console.error('Error in play command:', error);
        await interaction.reply({
            content: '⚠️ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
            ephemeral: true
        });
    }
}
