import { ActionRowBuilder, ComponentType } from 'discord.js';
import { getRandomGameItem } from '../../funcs/getRandom.js';
import { questionEmbed, resultEmbed, timeoutEmbed } from './embeds.js'
import { medicineBtn, pokemonBtn } from './buttons.js'

export default async (interaction) => {
    const item = getRandomGameItem();

    if (!item) {
        return interaction.reply({
            content: '⚠️ O banco de dados ainda não foi populado! Aguarde a sincronização.',
            ephemeral: true
        });
    }

    const pokeButton = pokemonBtn();
    const medicineButton = medicineBtn();

    const row = new ActionRowBuilder().addComponents(pokeButton, medicineButton);

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

        pokeButton.setDisabled(true);
        medicineButton.setDisabled(true);

        await i.update({
            embeds: [resultEmbed(i, item, isCorrect)],
            components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton)]
        });

        collector.stop('answered');
    });

    collector.on('end', (collected, reason) => {
        if (reason === 'answered') return;

        pokeButton.setDisabled(true);
        medicineButton.setDisabled(true);

        interaction.editReply({
            embeds: [timeoutEmbed(item)],
            components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton)]
        }).catch(() => {});
    });
}
