import db from '../database/db.js';

const pokemonDetailsCache = new Map();

export function getRandomPokemon() {
    const stmt = db.prepare("SELECT name FROM game_items WHERE type = 'pokemon' ORDER BY RANDOM() LIMIT 1");
    const result = stmt.get();
    return result ? result.name : null;
}

export async function getPokemonDetails(name) {
    const pokemonKey = String(name).trim().toLowerCase();

    if (pokemonDetailsCache.has(pokemonKey)) {
        return pokemonDetailsCache.get(pokemonKey);
    }

    const detailsRequest = (async () => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonKey)}`, {
            signal: AbortSignal.timeout(5000)
        });
        if (!response.ok) throw new Error(`PokéAPI returned ${response.status}`);

        const pokemon = await response.json();
        let flavorText = null;
        let genus = null;

        if (pokemon.species?.url) {
            try {
                const speciesResponse = await fetch(pokemon.species.url, {
                    signal: AbortSignal.timeout(5000)
                });
                if (speciesResponse.ok) {
                    const species = await speciesResponse.json();
                    genus = species.genera?.find((entry) => entry.language.name === 'en')?.genus ?? null;
                    flavorText = species.flavor_text_entries
                        ?.find((entry) => entry.language.name === 'en')
                        ?.flavor_text.replace(/[\f\n\r]/g, ' ') ?? null;
                }
            } catch {
                // Species text is optional; the core Pokémon details are still useful.
            }
        }

        return { ...pokemon, flavorText, genus };
    })();

    pokemonDetailsCache.set(pokemonKey, detailsRequest);

    try {
        const details = await detailsRequest;
        pokemonDetailsCache.set(pokemonKey, details);
        return details;
    } catch (error) {
        pokemonDetailsCache.delete(pokemonKey);
        console.warn(`Could not load PokéAPI details for ${name}:`, error.message);
        return null;
    }
}