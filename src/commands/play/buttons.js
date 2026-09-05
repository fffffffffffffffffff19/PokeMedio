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
export function btn_opt_1() {
    return new ButtonBuilder()
        .setCustomId('btn_opt_1')
        .setLabel('1️⃣')
        .setEmoji('1️⃣')
        .setStyle(ButtonStyle.Secondary);
};

export function btn_opt_2() {
    return new ButtonBuilder()
        .setCustomId('btn_opt_2')
        .setLabel('2️⃣')
        .setEmoji('2️⃣')
        .setStyle(ButtonStyle.Secondary);
};

export function btn_opt_3() {
    return new ButtonBuilder()
        .setCustomId('btn_opt_3')
        .setLabel('3️⃣')
        .setEmoji('3️⃣')
        .setStyle(ButtonStyle.Secondary);
};

export function btn_opt_4() {
    return new ButtonBuilder()
        .setCustomId('btn_opt_4')
        .setLabel('4️⃣')
        .setEmoji('4️⃣')
        .setStyle(ButtonStyle.Secondary);
};
