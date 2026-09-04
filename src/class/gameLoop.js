import { getRandomGameItem } from '../funcs/getRandom.js';

class GameLoop {
    constructor(interaction, options) {
        this.interaction = interaction;
        this.options = options;
        this.collector = null;
        this.consecutiveNoResponses = 0;
    }

    async start() {
        const item = getRandomGameItem();

        if (!item) {
            return this.interaction.reply({
                content: '⚠️ O banco de dados ainda não foi populado! Aguarde a sincronização.',
                ephemeral: true
            });
        }

        const collector = await this.options.onStart(item);

        this.collector = collector;

        this.collector.on('collect', async (i) => {
            const result = await this.options.onCollect(this.collector, i, item);

            if (result === 'answered' || result === 'wrong') {
                this.collector.stop(result);
            }
        });

        this.collector.on('end', async (collected, reason) => {
            await this.options.onEnd(this.collector, reason, item);
        });
    }

    stop() {
        if (this.collector) {
            this.collector.stop('stopped');
        }
    }
}

export default GameLoop;
