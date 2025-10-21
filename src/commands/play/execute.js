const drugName = require('../../funcs/getDrugs');
const pokemonName = require('../../funcs/getPokemon');

module.exports = async (interaction) => {
    await interaction.deferReply();

    const pokemon = await pokemonName();
    const drug = await drugName();
    const isPokemon = Math.random() < 0.5;
    const inteReply = isPokemon ? { pokemon, type: 'Pokemon' } : { drug, type: 'Drug' };
    const pokeOrDrug = inteReply?.drug || inteReply?.pokemon;

    await interaction.editReply(`O nome **${pokeOrDrug}** é um **Pokémon** ou um **Remédio**?`)
        .then((m) => setTimeout(() => {
            m.delete();
        }, 18000)
        );

    setTimeout(() => {
        interaction.followUp(`É um fodento ${inteReply.type === 'Drug' ? 'Remédio' : 'Pokémon'}`)
            .then((m) => {
                setTimeout(() => {
                    m.delete();
                }, 8000)
            });
    }, 10000);
}
