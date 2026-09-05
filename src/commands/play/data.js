import { SlashCommandBuilder } from 'discord.js';

export default new SlashCommandBuilder()
    .setName('play')
    .setDescription('Start game.')
    .addStringOption(option =>
        option.setName('mode')
            .setDescription('Choose the game mode')
            .setRequired(true)
            .addChoices(
                { name: 'Classic', value: 'classic' },
                { name: 'Find the Pokémon', value: 'find_pokemon' }
            ));
