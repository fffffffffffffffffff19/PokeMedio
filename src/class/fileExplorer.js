import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

class FileExplorer {
    constructor() {
        this.__dirname = path.dirname(fileURLToPath(import.meta.url));
    }

    foldersPath = (folderPath) => path.join(this.__dirname, folderPath);
    itemsFolders = (folderPath) => fs.readdirSync(this.foldersPath(folderPath));

    importFile = async (filePath) => {
            const fileUrl = pathToFileURL(filePath).href;
        try {
            const module = await import(fileUrl);

            return module.default ?? module;
        } catch (error) {
        console.error(`❌ Erro de sintaxe ao carregar o arquivo: ${filePath}`);
        throw error;
        }

    }

    findButtons = async () => {
        const location = path.resolve('src', 'buttons', 'scripts');
        const items = [];

        if (!fs.existsSync(location)) return items;

        const buttons = fs.readdirSync(location).filter((i) => i.endsWith('.js'));

        for (const button of buttons) {
            const files = path.join(location, button);
            const allButtons = await this.importFile(files);

            items.push(allButtons);
        }

        return items;
    }

    findCommands = async () => {
        const location = '../commands';
        const items = [];

        for (const folder of this.itemsFolders(location)) {
            const folderPath = path.join(this.foldersPath(location), folder);
            const dataPath = path.join(folderPath, 'data.js');
            const executePath = path.join(folderPath, 'execute.js');

            if (fs.existsSync(dataPath) && fs.existsSync(executePath)) {
                items.push({
                    name: folder,
                    data: await this.importFile(dataPath),
                    execute: await this.importFile(executePath),
                });
            } else {
                console.warn(`Folder "${folder}" is missing "data.js" or "execute.js".`);
            }
        }
        return items;
    }

    findEvents = async () => {
        const location = '../events';
        const items = [];

        for (const folder of this.itemsFolders(location)) {
            const itemsPath = path.join(this.foldersPath(location), folder);
            const itemsFile = fs.readdirSync(itemsPath).filter((item) => item.endsWith('.js'));

            for (const item of itemsFile) {
                const itemPath = path.join(itemsPath, item);
                const importedItems = await this.importFile(itemPath);

                items.push(importedItems);
            }
        }
        return items;
    }

    findHandlers() {
        const location = '../handlers';
        const items = [];

        for (const handler of this.itemsFolders(location)) {
            const handlerPath = path.join(this.foldersPath(location), handler);
            items.push(handlerPath);
        }

        return items;
    }
}

export default new FileExplorer();
