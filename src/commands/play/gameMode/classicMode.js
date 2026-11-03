import { ActionRowBuilder, ComponentType } from 'discord.js';
import { questionEmbed, correctEmbed, wrongEmbed, timeoutEmbed, newPoint, gameStoppedEmbed } from '../embeds.js';
import { medicineBtn, pokemonBtn, stopBtn } from '../buttons.js';
import { insertScore } from '../../../funcs/insertScore.js';
import { getPokemonDetails } from '../../../funcs/getPokemon.js';
import GameLoop from '../../../class/gameLoop.js';

export default async (interaction) => {
    try {
        let isFirstRound = true;
        let lastMessage = null;

        const gameLoop = new GameLoop(interaction, {
            delayBetweenRounds: 4000,

            onRoundStart: async (item) => {
                const row = new ActionRowBuilder().addComponents(
                    pokemonBtn().setDisabled(false),
                    medicineBtn().setDisabled(false),
                    stopBtn().setDisabled(false)
                );

                const payload = {
                    embeds: [questionEmbed(item)],
                    components: [row],
                    fetchReply: true
                };

                let response;
                if (isFirstRound) {
                    await interaction.reply(payload);
                    response = await interaction.fetchReply();
                } else {
                    response = await interaction.followUp(payload);
                }

                isFirstRound = false;
                lastMessage = response;

                return response.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 15_000
                });
            },

            onCollect: async (collector, i, item) => {
                if (i.customId === 'btn_stop') {
                    gameLoop.stop();
                    await i.reply({ embeds: [gameStoppedEmbed()] });
                    await i.channel.messages.delete(i.message.id);
                    return 'stopped';
                }

                const chosenType = i.customId === 'btn_pokemon' ? 'pokemon' : 'medicine';
                const isCorrect = chosenType === item.type;

                if (isCorrect) {
                    insertScore(i.user);
                    await i.deferUpdate();
                    const pokemon = item.type === 'pokemon'
                        ? await getPokemonDetails(item.name)
                        : null;
                    await i.followUp({ embeds: [correctEmbed(i, item, pokemon), newPoint(i.user)] });
                    await i.message.delete().catch(() => { });
                    return 'answered';
                } else {
                    await i.deferUpdate();
                    const pokemon = item.type === 'pokemon'
                        ? await getPokemonDetails(item.name)
                        : null;
                    await i.followUp({ embeds: [wrongEmbed(i, item, pokemon)] });
                    await i.message.delete().catch(() => { });
                    return 'wrong';
                }
            },

            onRoundEnd: async (reason, item) => {
                if (reason === 'time') {
                    const pokemon = item.type === 'pokemon'
                        ? await getPokemonDetails(item.name)
                        : null;
                    await interaction.followUp({
                        embeds: [timeoutEmbed(item, pokemon)]
                    });
                    if (lastMessage) await lastMessage.delete().catch(() => { });
                }
            }
        });

        await gameLoop.start();
    } catch (error) {
        console.error('Error in play command:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '⚠️ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
                ephemeral: true
            });
        }
    }
};
