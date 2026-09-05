import { EmbedBuilder } from "discord.js";
import { getRank } from "../../funcs/getRank.js";

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
}

export function timeoutEmbed(item) {
	return new EmbedBuilder()
		.setTitle('⏰ Tempo Esgotado!')
		.setDescription(`Você demorou muito para responder! **\`${item.name}\`** é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**.`)
		.setColor('#FEE75C');
};

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
