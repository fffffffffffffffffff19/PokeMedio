import { EmbedBuilder } from "discord.js";
import { getRank } from "../../funcs/getRank.js";

export function newPoint(user) {
    const userRank = getRank(user);

    return new EmbedBuilder()
        .setTitle('🏅 +1 Score!')
        .setDescription(`<@${user.id}> esta em Rank: **#${userRank.position}** com **${userRank.score}** pontos!`)
        .setColor("Gold");
};

export function gameStoppedEmbed() {
    return new EmbedBuilder()
        .setTitle('🎮 Jogo Encerrado!')
        .setDescription('O jogo foi encerrado. Tente novamente mais tarde.')
        .setColor('#FF0000');
};

////////////// classic mode embeds
export function questionEmbed(item) {
    return new EmbedBuilder()
        .setTitle('❓ Pokémon ou Remédio?')
        .setDescription(`O item **\`${item.name}\`** é um Pokémon ou um Remédio?`)
        .setColor('#5865F2')
        .setFooter({ text: 'Você tem 15 segundos para responder!' })
        .setTimestamp();
};

export function correctEmbed(i, item) {
    return new EmbedBuilder()
        .setTitle('🎉 Acertou!')
        .setDescription(`Parabéns **${i.user.username}**! **\`${item.name}\`** realmente é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**!`)
        .setColor('#57F287');
};

export function wrongEmbed(i, item) {
    return new EmbedBuilder()
        .setTitle('❌ Errou!')
        .setDescription(`Que pena **${i.user.username}**! **\`${item.name}\`** na verdade é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**!`)
        .setColor('#ED4245');
};

export function timeoutEmbed(item) {
    return new EmbedBuilder()
        .setTitle('⏰ Tempo Esgotado!')
        .setDescription(`Você demorou muito para responder! **\`${item.name}\`** é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**.`)
        .setColor('#FEE75C');
};

////////////// find mode embeds
export function questionEmbed(items) {
    return new EmbedBuilder()
        .setTitle('🔍 Encontre o Pokémon!')
        .setDescription(`Escolha o item que é um Pokémon entre os 4 abaixo:`)
        .addFields(
            { name: '1️⃣', value: `**\`${items[0].name}\`**` },
            { name: '2️⃣', value: `**\`${items[1].name}\`**` },
            { name: '3️⣴', value: `**\`${items[2].name}\`**` },
            { name: '4️⣴', value: `**\`${items[3].name}\`**` }
        )
        .setColor('#5865F2')
        .setFooter({ text: 'Você tem 15 segundos para responder!' })
        .setTimestamp();
};

export function correctFindEmbed(i, item) {
    return new EmbedBuilder()
        .setTitle('🎉 Acertou!')
        .setDescription(`Parabéns **${i.user.username}**! **\`${item.name}\`** realmente é um **Pokémon 🔴**!`)
        .setColor('#57F287');
};

export function wrongFindEmbed(i, item) {
    return new EmbedBuilder()
        .setTitle('❌ Errou!')
        .setDescription(`Que pena **${i.user.username}**! **\`${item.name}\`** na verdade é um **Remédio 💊**!`)
        .setColor('#ED4245');
};
