import db from "../database/db.js"

export function insertUser(user) {
	const stmt = db.prepare(`
		INSERT INTO user_ranks (user_id, score, updated_at)
		VALUES (?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT(user_id) DO UPDATE SET
			score = score + excluded.score,
			updated_at = CURRENT_TIMESTAMP
	`);

	stmt.run(user.id, 0);
}
