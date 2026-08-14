import db from './db.js';

export async function syncPokemons() {
    console.log('[DB] Fetching Pokémon from PokéAPI...');
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const data = await res.json();

        const pokemons = data.results
            .map((r) => r.name)
            .filter(Boolean)
            .filter((name) => /^[A-Za-z]+$/.test(name))
            .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());

        const uniquePokemons = [...new Set(pokemons)];

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO game_items (name, type) VALUES (?, 'pokemon')
        `);

        const insertMany = db.transaction((items) => {
            for (const name of items) insertStmt.run(name);
        });

        insertMany(uniquePokemons);
        console.log(`[DB] Pokémon successfully synchronized (${uniquePokemons.length} processed).`);
    } catch (error) {
        console.error('[DB] Error synchronizing Pokémon:', error);
    }
}

export async function syncMedicines() {
    console.log('[DB] Fetching medicines from OpenFDA API...');
    const medicineList = [];

    for (let i = 0; i < 7; i++) {
        const skip = i * 1000;
        const url = `https://api.fda.gov/drug/label.json?limit=1000&skip=${skip}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.results) {
                const medicines = data.results
                    .map((r) => r.openfda?.brand_name?.[0] || r.openfda?.generic_name?.[0])
                    .filter(Boolean)
                    .filter((name) => /^[A-Za-z]+$/.test(name))
                    .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());

                medicineList.push(...medicines);
            }
        } catch (error) {
            console.error(`[DB] Error fetching page ${i + 1} from medicines API:`, error);
        }
    }

    const uniqueMedicines = [...new Set(medicineList)];

    try {
        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO game_items (name, type) VALUES (?, 'medicine')
        `);

        const insertMany = db.transaction((items) => {
            for (const name of items) insertStmt.run(name);
        });

        insertMany(uniqueMedicines);
        console.log(`[DB] Medicines successfully synchronized (${uniqueMedicines.length} processed).`);
    } catch (error) {
        console.error('[DB] Error saving medicines to database:', error);
    }
}
