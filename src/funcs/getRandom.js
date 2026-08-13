import db from '../database/db.js';

export function getRandomGameItem() {
    const stmt = db.prepare('SELECT id, name, type FROM game_items ORDER BY RANDOM() LIMIT 1');
    const result = stmt.get();
    
    return result || null;
}
