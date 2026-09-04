import { ButtonBuilder, ButtonStyle } from "discord.js";
/////////// main chose Btn
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
///////////////////////////
