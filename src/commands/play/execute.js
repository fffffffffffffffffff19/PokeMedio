import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { getRandomGameItem } from '../../funcs/getRandom.js';

export default async (interaction) => {
    const item = getRandomGameItem();

    if (!item) {
        return interaction.reply({
            content: '⚠️ O banco de dados ainda não foi populado! Aguarde a sincronização.',
            ephemeral: true
        });
    }

    const pokemonBtn = new ButtonBuilder()
        .setCustomId('btn_pokemon')
        .setLabel('Pokémon')
        .setEmoji('🔴')
        .setStyle(ButtonStyle.Primary);

    const medicineBtn = new ButtonBuilder()
        .setCustomId('btn_medicine')
        .setLabel('Remédio')
        .setEmoji('💊')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(pokemonBtn, medicineBtn);

    const questionEmbed = new EmbedBuilder()
        .setTitle('❓ Pokémon ou Remédio?')
        .setDescription(`O item **\`${item.name}\`** é um Pokémon ou um Remédio?`)
        .setColor('#5865F2')
        .setFooter({ text: 'Você tem 15 segundos para responder!' })
        .setTimestamp();

    const response = await interaction.reply({
        embeds: [questionEmbed],
        components: [row],
        fetchReply: true
    });

    const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 15_000
    });

    collector.on('collect', async (i) => {
        const chosenType = i.customId === 'btn_pokemon' ? 'pokemon' : 'medicine';
        const isCorrect = chosenType === item.type;

        pokemonBtn.setDisabled(true);
        medicineBtn.setDisabled(true);

        const resultEmbed = new EmbedBuilder()
            .setTitle(isCorrect ? '🎉 Acertou!' : '❌ Errou!')
            .setDescription(
                isCorrect
                    ? `Parabéns **${i.user.username}**! **\`${item.name}\`** realmente é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**!`
                    : `Que pena **${i.user.username}**! **\`${item.name}\`** na verdade é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**!`
            )
            .setColor(isCorrect ? '#57F287' : '#ED4245');

        await i.update({
            embeds: [resultEmbed],
            components: [new ActionRowBuilder().addComponents(pokemonBtn, medicineBtn)]
        });

        collector.stop('answered');
    });

    collector.on('end', (collected, reason) => {
        if (reason === 'answered') return;

        pokemonBtn.setDisabled(true);
        medicineBtn.setDisabled(true);

        const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ Tempo Esgotado!')
            .setDescription(`Você demorou muito para responder! **\`${item.name}\`** é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**.`)
            .setColor('#FEE75C');

        interaction.editReply({
            embeds: [timeoutEmbed],
            components: [new ActionRowBuilder().addComponents(pokemonBtn, medicineBtn)]
        }).catch(() => {});
    });
}
