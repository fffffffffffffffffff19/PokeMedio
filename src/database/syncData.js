import db from './db.js';

export async function syncPokemons() {
    console.log('[DB] Iniciando busca de Pokémon na PokéAPI...');
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
        console.log(`[DB] Pokémon sincronizados com sucesso (${uniquePokemons.length} processados).`);
    } catch (error) {
        console.error('[DB] Erro ao sincronizar Pokémon:', error);
    }
}

export async function syncMedicines() {
    console.log('[DB] Iniciando busca de remédios na OpenFDA API...');
    const medicineList = [];

    // Busca os dados nas 7 páginas da OpenFDA API
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
            console.error(`[DB] Erro ao buscar página ${i + 1} da API de remédios:`, error);
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
        console.log(`[DB] Remédios sincronizados com sucesso (${uniqueMedicines.length} processados).`);
    } catch (error) {
        console.error('[DB] Erro ao salvar remédios no banco:', error);
    }
}
