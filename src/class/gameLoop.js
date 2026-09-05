import { getRandomGameItem } from '../funcs/getRandom.js';

class GameLoop {
    constructor(interaction, options) {
        this.interaction = interaction;
        this.options = options;
        this.collector = null;
        this.isRunning = false;
    }

    async start() {
        this.isRunning = true;
        await this.runRound();
    }

    async runRound() {
        if (!this.isRunning) return;

        const item = getRandomGameItem();

        if (!item) {
            return this.interaction.reply({
                content: '⚠️ O banco de dados ainda não foi populado! Aguarde a sincronização.',
                ephemeral: true
            });
        }

        const collector = await this.options.onRoundStart(item);
        this.collector = collector;

        this.collector.on('collect', async (i) => {
            const result = await this.options.onCollect(this.collector, i, item);

            if (result === 'answered' || result === 'wrong' || result === 'stopped') {
                this.collector.stop(result);
            }
        });

        this.collector.on('end', async (collected, reason) => {
            if (reason === 'stopped') {
                this.isRunning = false;
                return;
            }

            if (this.options.onRoundEnd) {
                await this.options.onRoundEnd(reason, item);
            }

            // Aguarda o intervalo definido e avança para a próxima rodada se o jogo continuar ativo
            if (this.isRunning) {
                setTimeout(() => {
                    this.runRound();
                }, this.options.delayBetweenRounds || 3000);
            }
        });
    }

    stop() {
        this.isRunning = false;
        if (this.collector) {
            this.collector.stop('stopped');
        }
    }
}

export default GameLoop;