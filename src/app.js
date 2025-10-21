const { client } = require('./main');
const { Collection } = require('discord.js');
const { findHandlers } = require('./class/fileExplorer');

require('dotenv').config({ quiet: true });

client.login(process.env.TOKEN);
client.drugsCache = new Collection();

findHandlers().forEach((handle) => require(handle)(client));

let drugCache = [];

(async () => {
    for (let i = 0; i < 7; i++) {
        const skip = i * 1000;
        const url = `https://api.fda.gov/drug/label.json?limit=1000&skip=${skip}`

        try {
            const api = await fetch(url);
            const data = await api.json();
            const drug = data.results
                .map((r) => r.openfda?.brand_name?.[0] || r.openfda?.generic_name?.[0])
                .filter(Boolean)
                .filter(name => /^[A-Za-z]+$/.test(name))
                .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());

            drugCache.push(...drug);
        } catch (e) {
            console.log('Error on searching drug api names');
            console.log(e);
        }
    }
    client.drugsCache.set('cache', drugCache);

    console.log(`Drugs on cache ${drugCache.length}`);
})()
