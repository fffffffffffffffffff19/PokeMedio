import { ActionRowBuilder, ComponentType } from 'discord.js';
import { questionEmbed, correctEmbed, wrongEmbed, timeoutEmbed, newPoint } from '../embeds.js';
import { medicineBtn, pokemonBtn, stopBtn } from '../buttons.js';
import { insertScore } from '../../../funcs/insertScore.js';
import { getRandomGameItem } from '../../../funcs/getRandom.js';
import GameLoop from '../../../class/GameLoop.js';

export default async (interaction) => {
    try {
        const gameLoop = new GameLoop(interaction, {
            onStart: async (item) => {
                const pokeButton = pokemonBtn();
                const medicineButton = medicineBtn();
                const stopButton = stopBtn();

                const row = new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton);

                const response = await interaction.reply({
                    embeds: [questionEmbed(item)],
                    components: [row],
                    fetchReply: true
                });

                return response.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 15_000
                });
            },

            onCollect: async (collector, i, item) => {
                const chosenType = i.customId === 'btn_pokemon' ? 'pokemon' : 'medicine';
                const isCorrect = chosenType === item.type;

                pokeButton.setDisabled(true);
                medicineButton.setDisabled(true);
                stopButton.setDisabled(true);

                if (isCorrect) {
                    await insertScore(i.user);

                    await i.update({
                        embeds: [correctEmbed(i, item), newPoint(i.user)],
                        components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton)]
                    });

                    return 'answered';
                } else {
                    await i.update({
                        embeds: [wrongEmbed(i, item)],
                        components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton)]
                    });

                    return 'wrong';
                }
            },

            onEnd: async (collector, reason, item) => {
                if (reason === 'answered') return;

                if (reason === 'no_response') {
                    await interaction.editReply({
                        embeds: [timeoutEmbed(item)],
                        components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton)]
                    }).catch(() => { });
                } else {
                    pokeButton.setDisabled(true);
                    medicineButton.setDisabled(true);
                    stopButton.setDisabled(true);

                    await interaction.editReply({
                        embeds: [timeoutEmbed(item)],
                        components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton)]
                    }).catch(() => { });
                }
            }
        });

        await gameLoop.start();
    } catch (error) {
        console.error('Error in play command:', error);
        await interaction.reply({
            content: '⚠️ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
            ephemeral: true
        });
    }
}
