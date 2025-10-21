module.exports = async () => {
    const api = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`)
    const data = await api.json();
    const pokemon = data.results
        .map((r) => r.name)
        .filter(Boolean)
        .filter(name => /^[A-Za-z]+$/.test(name));

    if (pokemon.length === 0) return 'Unknown';

    let name = pokemon[Math.floor(Math.random() * pokemon.length)];

    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    return name;
}
