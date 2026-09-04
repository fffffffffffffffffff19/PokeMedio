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
///////////////////////////
