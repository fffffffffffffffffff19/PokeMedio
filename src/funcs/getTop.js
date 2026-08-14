import db from '../database/db.js';

export function getTop() {
    const stmt = db.prepare(`
        SELECT user_id, score
        FROM user_ranks
        ORDER BY score DESC 
        LIMIT ?`);
    const result = stmt.all(10);

    return result || null;
}
