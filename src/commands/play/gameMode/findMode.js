import { ActionRowBuilder, ComponentType } from 'discord.js';
import { questionEmbed, correctEmbed, wrongEmbed, timeoutEmbed, newPoint, gameStoppedEmbed } from '../embeds.js';
import { medicineBtn, stopBtn } from '../buttons.js';
import { insertScore } from '../../../funcs/insertScore.js';
import GameLoop from '../../../class/gameLoop.js';

export default async (interaction) => {
    try {
        let isFirstRound = true;

        const gameLoop = new GameLoop(interaction, {
            delayBetweenRounds: 4000,

            onRoundStart: async (item) => {
                const pokemon = item;
                const medicines = Array.from({ length: 3 }, () => getRandomMedicine()).map((medicine) => ({ name: medicine, type: 'medicine' }));

                const items = [pokemon, ...medicines].sort(() => Math.random() - 0.5);

                const row = new ActionRowBuilder().addComponents(
                    pokemonBtn().setDisabled(false),
                    medicineBtn().setDisabled(false),
                    medicineBtn().setDisabled(false),
                    medicineBtn().setDisabled(false),
                    stopBtn().setDisabled(false)
                );

                const payload = {
                    embeds: [questionEmbed(items)],
                    components: [row],
                    fetchReply: true
                };

                const response = isFirstRound
                    ? await interaction.reply(payload)
                    : await interaction.followUp(payload);

                isFirstRound = false;

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

                const chosenType = i.customId === 'btn_opt_1' ? 'pokemon' : 'medicine';
                const isCorrect = chosenType === item.type;

                const disabledRow = new ActionRowBuilder().addComponents(
                    pokemonBtn().setDisabled(true),
                    medicineBtn().setDisabled(true),
                    medicineBtn().setDisabled(true),
                    medicineBtn().setDisabled(true),
                    stopBtn().setDisabled(true)
                );

                if (isCorrect) {
                    insertScore(i.user);
                    await i.update({
                        embeds: [correctEmbed(i, item), newPoint(i.user)],
                        components: [disabledRow]
                    });
                    return 'answered';
                } else {
                    await i.update({
                        embeds: [wrongEmbed(i, item)],
                        components: [disabledRow]
                    });
                    return 'wrong';
                }
            },

            onRoundEnd: async (reason, item) => {
                if (reason === 'time') {
                    await interaction.followUp({
                        embeds: [timeoutEmbed(item)]
                    });
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
