import fileExplorer from '../class/fileExplorer.js';
import logger from '../class/logger.js';

const { createLogger, fileName } = logger;

export default async (client) => {
    try {
        // Chamando direto de 'fileExplorer' para preservar o contexto do 'this'
        const events = await fileExplorer.findEvents();

        for (const event of events) {
            if (!event.name) continue; // Usando 'continue' para pular itens sem nome sem parar o loop
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    } catch (error) {
        createLogger.error(fileName, error);
    }
};