import { ActionRowBuilder, ComponentType } from 'discord.js';
import { getRandomGameItem } from '../../funcs/getRandom.js';
import { questionEmbed, correctEmbed, wrongEmbed,timeoutEmbed, newPoint } from './embeds.js'
import { medicineBtn, pokemonBtn } from './buttons.js'
import { insertScore } from '../../funcs/insertScore.js'

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

        if (isCorrect == true) {
            insertScore(i.user);

            await i.update({
                embeds: [correctEmbed(i, item), newPoint(i.user)],
                components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton)]
            });

            return collector.stop('answered');
        }

        await i.update({
            embeds: [wrongEmbed(i, item)],
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
