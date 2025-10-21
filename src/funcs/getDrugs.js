const { client } = require('../main');

module.exports = async () => {
    const cache = client.drugsCache.get('cache');
    const name = cache[Math.floor(Math.random() * cache.length)];

    return name;
}
