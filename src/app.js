import bot from './main.js';
import fileExplorer from './class/fileExplorer.js';
import { token } from '../config.js';
import { pathToFileURL } from 'node:url';

const { client } = bot;

await client.login(token);

const handlers = fileExplorer.findHandlers();

for (const handlePath of handlers) {
    const fileUrl = pathToFileURL(handlePath).href;
    const handlerModule = await import(fileUrl);
    const handler = handlerModule.default ?? handlerModule;

    handler(client);
}
