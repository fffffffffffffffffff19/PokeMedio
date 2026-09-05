import { ButtonBuilder, ButtonStyle } from "discord.js";
/////////// classic mode btns
export function pokemonBtn() {
    return new ButtonBuilder()
        .setCustomId('btn_pokemon')
        .setLabel('Pokémon')
        .setEmoji('🔴')
        .setStyle(ButtonStyle.Primary);
};

export function medicineBtn() {
    return new ButtonBuilder()
        .setCustomId('btn_medicine')
        .setLabel('Remédio')
        .setEmoji('💊')
        .setStyle(ButtonStyle.Success);
};

export function stopBtn() {
    return new ButtonBuilder()
        .setCustomId('btn_stop')
        .setLabel('Stop')
        .setEmoji('⛔')
        .setStyle(ButtonStyle.Danger);
};
/////////// find mode btns

//////////////////////////
