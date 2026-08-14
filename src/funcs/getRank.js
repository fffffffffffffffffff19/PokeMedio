import db from '../database/db.js';

export function getRank(user) {
    const stmt = db.prepare(`
        SELECT 
            score,
            (SELECT COUNT(*) + 1 FROM user_ranks WHERE score > u.score) AS position
        FROM user_ranks u
        WHERE user_id = ?`
    );
    const result = stmt.get(user.id);

    return result ? { score: result.score, position: result.position } : null;
}
