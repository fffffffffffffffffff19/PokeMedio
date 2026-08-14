import { Events } from 'discord.js';
import { clientUsername, clientAvatar } from '../../../config.js';
import { syncPokemons, syncMedicines } from '../../database/syncData.js';
import db from '../../database/db.js';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await client.user.setUsername(clientUsername);
        // await client.user.setAvatar(clientAvatar);
        console.log(`Logged on ${client.user.tag}`);

        const totalItems = db.prepare('SELECT COUNT(*) AS total FROM game_items').get().total;

        if (totalItems === 0) {
            console.log('[DB] Database is empty. Starting initial synchronization...');
            await syncPokemons();
            await syncMedicines();
            console.log('[DB] Initial synchronization completed successfully!');
        } else {
            console.log(`[DB] SQLite database ready with ${totalItems} registered items.`);
        }
    },
};
