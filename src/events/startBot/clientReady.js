const { Events } = require('discord.js');
const { clientUsername, clientAvatar } = require('../../../config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await client.user.setUsername(clientUsername);
        // await client.user.setAvatar(clientAvatar);
        console.log(`Logged on ${client.user.tag}`);
    },
};