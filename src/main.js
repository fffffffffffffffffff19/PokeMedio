import { Client, GatewayIntentBits } from 'discord.js';

class PokeMedio {
    constructor () {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildWebhooks,
            ]
        })
    }
}

export default new PokeMedio();