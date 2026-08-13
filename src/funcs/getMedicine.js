import db from '../database/db.js';

export function getRandomMedicine() {
    const stmt = db.prepare("SELECT name FROM game_items WHERE type = 'medicine' ORDER BY RANDOM() LIMIT 1");
    const result = stmt.get();

    return result ? result.name : null;
}
