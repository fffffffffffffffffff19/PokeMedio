import { ActionRowBuilder, ComponentType } from 'discord.js';
import { questionFindEmbed, correctEmbed, wrongFindEmbed, timeoutEmbed, newPoint, gameStoppedEmbed } from '../embeds.js';
import { numberBtn, stopBtn } from '../buttons.js';
import { insertScore } from '../../../funcs/insertScore.js';
import { getRandomMedicine } from '../../../funcs/getMedicine.js';
import { getPokemonDetails, getRandomPokemon } from '../../../funcs/getPokemon.js';
import GameLoop from '../../../class/gameLoop.js';

export default async (interaction) => {
    try {
        let isFirstRound = true;
        let currentItems = [];
        let correctPokemon = null;
        let lastMessage = null;

        const gameLoop = new GameLoop(interaction, {
            delayBetweenRounds: 4000,
            maxConsecutiveTimeouts: 3,

            onMaxConsecutiveTimeouts: async () => {
                await interaction.followUp({ embeds: [gameStoppedEmbed()] });
            },

            onRoundStart: async () => {
                const pokemonName = getRandomPokemon();
                const pokemon = { name: pokemonName, type: 'pokemon' };
                correctPokemon = pokemon;

                const medicines = [];
                const usedNames = new Set([pokemonName]);

                while (medicines.length < 3) {
                    const medName = getRandomMedicine();
                    if (medName && !usedNames.has(medName)) {
                        usedNames.add(medName);
                        medicines.push({ name: medName, type: 'medicine' });
                    }
                }

                currentItems = [pokemon, ...medicines].sort(() => Math.random() - 0.5);

                const row = new ActionRowBuilder().addComponents(
                    numberBtn(1).setDisabled(false),
                    numberBtn(2).setDisabled(false),
                    numberBtn(3).setDisabled(false),
                    numberBtn(4).setDisabled(false),
                    stopBtn().setDisabled(false)
                );

                const payload = {
                    embeds: [questionFindEmbed(currentItems)],
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

            onCollect: async (collector, i) => {
                if (i.customId === 'btn_stop') {
                    gameLoop.stop();
                    await i.reply({ embeds: [gameStoppedEmbed()] });
                    await i.channel.messages.delete(i.message.id);
                    return 'stopped';
                }

                const selectedIndex = parseInt(i.customId.replace('btn_opt_', '')) - 1;
                const selectedItem = currentItems[selectedIndex];

                const isCorrect = selectedItem && selectedItem.type === 'pokemon';

                if (isCorrect) {
                    insertScore(i.user);
                    await i.deferUpdate();
                    const pokemon = await getPokemonDetails(correctPokemon.name);
                    await i.followUp({ embeds: [correctEmbed(i, correctPokemon, pokemon), newPoint(i.user)] });
                    await i.message.delete().catch(() => { });
                    return 'answered';
                } else {
                    await i.deferUpdate();
                    const pokemon = await getPokemonDetails(correctPokemon.name);
                    await i.followUp({ embeds: [wrongFindEmbed(i, selectedItem, correctPokemon, pokemon)] });
                    await i.message.delete().catch(() => { });
                    return 'wrong';
                }
            },

            onRoundEnd: async (reason) => {
                // Trata o Timeout (15 segundos sem resposta)
                if (reason === 'time') {
                    const pokemon = await getPokemonDetails(correctPokemon.name);
                    await interaction.followUp({
                        embeds: [timeoutEmbed(correctPokemon, pokemon)]
                    });

                    // Apaga a mensagem anterior da pergunta que expirou
                    if (lastMessage) {
                        await lastMessage.delete().catch(() => { });
                    }
                }
            }
        });

        await gameLoop.start();
    } catch (error) {
        console.error('Error in find mode command:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '⚠️ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
                ephemeral: true
            });
        }
    }
};