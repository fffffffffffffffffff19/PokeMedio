const { Client, GatewayIntentBits } = require('discord.js');

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

module.exports = new PokeMedio();