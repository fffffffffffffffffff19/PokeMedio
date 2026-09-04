import { ActionRowBuilder, ComponentType } from 'discord.js';
import { questionEmbed, correctEmbed, wrongEmbed, timeoutEmbed, newPoint } from '../embeds.js';
import { medicineBtn, pokemonBtn, stopBtn } from '../buttons.js';
import { insertScore } from '../../../funcs/insertScore.js';
import { getRandomGameItem } from '../../../funcs/getRandom.js';

let currentGame = null;
let consecutiveNoResponses = 0;

export default async (interaction) => {
    try {
        if (currentGame) {
            currentGame.stop();
        }

        currentGame = new Game(interaction);
        await currentGame.start();
    } catch (error) {
        console.error('Error in play command:', error);
        await interaction.reply({
            content: '⚠️ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
            ephemeral: true
        });
    }
}

class Game {
    constructor(interaction) {
        this.interaction = interaction;
        this.collector = null;
    }

    async start() {
        const item = await getRandomGameItem();

        if (!item) {
            return this.interaction.reply({
                content: '⚠️ O banco de dados ainda não foi populado! Aguarde a sincronização.',
                ephemeral: true
            });
        }

        const pokeButton = pokemonBtn();
        const medicineButton = medicineBtn();
        const stopButton = stopBtn();

        const row = new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton);

        const response = await this.interaction.reply({
            embeds: [questionEmbed(item)],
            components: [row],
            withResponse: true
        });

        this.collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 15_000
        });

        this.collector.on('collect', async (i) => {
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

                consecutiveNoResponses = 0; // Reset consecutive no responses counter
                await this.start();
            } else {
                await i.update({
                    embeds: [wrongEmbed(i, item)],
                    components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton)]
                });

                consecutiveNoResponses++;
                if (consecutiveNoResponses >= 2) {
                    this.collector.stop('no_response');
                }
            }
        });

        this.collector.on('end', (collected, reason) => {
            if (reason === 'answered') return;

            if (reason === 'no_response') {
                this.interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setTitle('⏰ Tempo Esgotado!')
                        .setDescription('Você não respondeu em duas rodadas consecutivas. O jogo foi encerrado.')
                        .setColor('#FEE75C')],
                    components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton)]
                }).catch(() => { });
            } else {
                pokeButton.setDisabled(true);
                medicineButton.setDisabled(true);
                stopButton.setDisabled(true);

                this.interaction.editReply({
                    embeds: [timeoutEmbed(item)],
                    components: [new ActionRowBuilder().addComponents(pokeButton, medicineButton, stopButton)]
                }).catch(() => { });
            }
        });
    }

    stop() {
        if (this.collector) {
            this.collector.stop('stopped');
        }
    }
}
