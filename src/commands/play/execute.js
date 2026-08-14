import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { getRandomGameItem } from '../../funcs/getRandom.js';
import { questionEmbed, resultEmbed, timeoutEmbed } from './embeds.js'

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

    const response = await interaction.reply({
        embeds: [questionEmbed(item)],
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

        await i.update({
            embeds: [resultEmbed(i, item, isCorrect)],
            components: [new ActionRowBuilder().addComponents(pokemonBtn, medicineBtn)]
        });

        collector.stop('answered');
    });

    collector.on('end', (collected, reason) => {
        if (reason === 'answered') return;

        pokemonBtn.setDisabled(true);
        medicineBtn.setDisabled(true);

        interaction.editReply({
            embeds: [timeoutEmbed(item)],
            components: [new ActionRowBuilder().addComponents(pokemonBtn, medicineBtn)]
        }).catch(() => {});
    });
}
