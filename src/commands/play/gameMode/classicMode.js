import { ActionRowBuilder, ComponentType } from 'discord.js';
import { questionEmbed, correctEmbed, wrongEmbed, timeoutEmbed, newPoint, gameStoppedEmbed } from '../embeds.js';
import { medicineBtn, pokemonBtn, stopBtn } from '../buttons.js';
import { insertScore } from '../../../funcs/insertScore.js';
import GameLoop from '../../../class/gameLoop.js';

export default async (interaction) => {
    try {
        const pokeButton = pokemonBtn();
        const medicineButton = medicineBtn();
        const stopButton = stopBtn();

        const row = new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton);

        let initialMessageId = null;

        const gameLoop = new GameLoop(interaction, {
            onStart: async (item) => {
                const response = await interaction.reply({
                    embeds: [questionEmbed(item)],
                    components: [row],
                    fetchReply: true
                });

                initialMessageId = response.id;

                return response.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 15_000
                });
            },

            onCollect: async (collector, i, item) => {
                if (i.customId === 'btn_stop') {
                    collector.stop('stopped');

                    await i.reply({
                        embeds: [gameStoppedEmbed()],
                        ephemeral: true
                    });

                    // Delete the initial interaction reply
                    if (initialMessageId) {
                        await interaction.channel.messages.delete(initialMessageId);
                    }

                    return;
                }

                const chosenType = i.customId === 'btn_pokemon' ? 'pokemon' : 'medicine';
                const isCorrect = chosenType === item.type;

                pokeButton.setDisabled(true);
                medicineButton.setDisabled(true);
                stopButton.setDisabled(true);

                if (isCorrect) {
                    insertScore(i.user);

                    await i.reply({
                        embeds: [correctEmbed(i, item), newPoint(i.user)],
                        components: [row]
                    });

                    collector.stop('answered');
                } else {
                    await i.reply({
                        embeds: [wrongEmbed(i, item)],
                        components: [row]
                    });

                    collector.stop('wrong');
                }

                setTimeout(async () => {
                    pokeButton.setDisabled(false);
                    medicineButton.setDisabled(false);
                    stopButton.setDisabled(false);

                    const newGame = await interaction.followUp({
                        embeds: [questionEmbed(item)],
                        components: [row],
                        fetchReply: true
                    });

                    collector = newGame.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: 15_000
                    });

                    gameLoop.collector = collector;

                    collector.on('collect', async (i) => {
                        const result = await gameLoop.options.onCollect(gameLoop.collector, i, item);

                        if (result === 'answered') {
                            collector.stop('answered');
                        } else if (result === 'wrong') {
                            collector.stop('wrong');
                        }
                    });

                    collector.on('end', async (collected, reason) => {
                        await gameLoop.options.onEnd(gameLoop.collector, reason, item);
                    });
                }, 4000);
            },

            onEnd: async (collector, reason, item) => {
                if (reason === 'answered' || reason === 'wrong') {
                    const newGame = await interaction.followUp({
                        embeds: [questionEmbed(item)],
                        components: [row],
                        fetchReply: true
                    });

                    collector = newGame.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: 15_000
                    });

                    gameLoop.collector = collector;

                    collector.on('collect', async (i) => {
                        const result = await gameLoop.options.onCollect(gameLoop.collector, i, item);

                        if (result === 'answered') {
                            collector.stop('answered');
                        } else if (result === 'wrong') {
                            collector.stop('wrong');
                        }
                    });

                    collector.on('end', async (collected, reason) => {
                        await gameLoop.options.onEnd(gameLoop.collector, reason, item);
                    });
                } else if (reason === 'no_response') {
                    if (!interaction.replied) {
                        await interaction.followUp({
                            embeds: [timeoutEmbed(item)]
                        }).catch(() => { });
                    }
                } else {
                    if (!interaction.replied) {
                        await interaction.followUp({
                            embeds: [timeoutEmbed(item)]
                        }).catch(() => { });
                    }
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
