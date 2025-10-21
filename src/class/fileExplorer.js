const fs = require('node:fs');
const path = require('node:path');

class FileExplorer {
    constructor() {
        this.foldersPath = (folderPath) => path.join(__dirname, folderPath);
        this.itemsFolders = (folderPath) => fs.readdirSync(this.foldersPath(folderPath));

        this.findButtons = () => {
            const location = path.resolve('src', 'buttons', 'scripts');
            const items = [];

            const itemsPath = path.join(location);
            const buttons = fs.readdirSync(itemsPath).filter((i) => i.endsWith('.js'));

            for (const button of buttons) {
                const files = path.join(itemsPath, button);
                const allButtons = require(files);

                items.push(allButtons);
            }

            return items;
        };

        this.findCommands = () => {
            const location = '../commands';
            const items = [];

            for (const folder of this.itemsFolders(location)) {
                const folderPath = path.join(this.foldersPath(location), folder);
                const dataPath = path.join(folderPath, 'data.js');
                const executePath = path.join(folderPath, 'execute.js');

                if (fs.existsSync(dataPath) && fs.existsSync(executePath)) {
                    items.push({
                        name: folder,
                        data: require(dataPath),
                        execute: require(executePath),
                    });
                } else {
                    console.warn(`Folder "${folder}" is missing "data.js" or "execute.js".`);
                }
            }
            return items;
        };

        this.findEvents = () => {
            const location = '../events';
            const items = [];

            for (const folder of this.itemsFolders(location)) {
                const itemsPath = path.join(this.foldersPath(location), folder);
                const itemsFile = fs.readdirSync(itemsPath).filter((item) => item.endsWith('.js'));

                for (const item of itemsFile) {
                    const itemPath = path.join(itemsPath, item);
                    const importedItems = require(itemPath);

                    items.push(importedItems);
                }
            }
            return items;
        };

        this.findHandlers = () => {
            const location = '../handlers';
            const items = [];

            for (const handler of this.itemsFolders(location)) {
                const handlerPath = path.join(this.foldersPath(location), handler);

                items.push(handlerPath);
            }

            return items;
        };
    }
}

module.exports = new FileExplorer();