import db from '../database/db.js';

export function getRandomPokemon() {
    const stmt = db.prepare("SELECT name FROM game_items WHERE type = 'pokemon' ORDER BY RANDOM() LIMIT 1");
    const result = stmt.get();

    return result ? result.name : null;
}