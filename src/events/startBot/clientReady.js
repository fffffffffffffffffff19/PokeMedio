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
            console.log('[DB] Banco de dados vazio. Iniciando primeira sincronização...');
            await syncPokemons();
            await syncMedicines();
            console.log('[DB] Sincronização inicial concluída com sucesso!');
        } else {
            console.log(`[DB] Banco SQLite pronto com ${totalItems} itens cadastrados.`);
        }
    },
};
