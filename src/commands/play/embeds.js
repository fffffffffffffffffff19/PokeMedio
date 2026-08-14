import { EmbedBuilder } from "discord.js";

export function questionEmbed(item) {
	return new EmbedBuilder()
		.setTitle('❓ Pokémon ou Remédio?')
		.setDescription(`O item **\`${item.name}\`** é um Pokémon ou um Remédio?`)
		.setColor('#5865F2')
		.setFooter({ text: 'Você tem 15 segundos para responder!' })
		.setTimestamp();
};

export function resultEmbed(i, item, isCorrect) {
	return new EmbedBuilder()
		.setTitle(isCorrect ? '🎉 Acertou!' : '❌ Errou!')
		.setDescription(
			isCorrect
				? `Parabéns **${i.user.username}**! **\`${item.name}\`** realmente é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**!`
				: `Que pena **${i.user.username}**! **\`${item.name}\`** na verdade é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**!`
		)
		.setColor(isCorrect ? '#57F287' : '#ED4245');
};

export function timeoutEmbed(item) {
	return new EmbedBuilder()
            .setTitle('⏰ Tempo Esgotado!')
            .setDescription(`Você demorou muito para responder! **\`${item.name}\`** é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**.`)
            .setColor('#FEE75C');
};
