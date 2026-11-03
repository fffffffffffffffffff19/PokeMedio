import { EmbedBuilder } from "discord.js";
import { getRank } from "../../funcs/getRank.js";

export function newPoint(user) {
    const userRank = getRank(user);

    return new EmbedBuilder()
        .setTitle('🏅 +1 Score!')
        .setDescription(`<@${user.id}> esta em Rank: **#${userRank.position}** com **${userRank.score}** pontos!`)
        .setColor("Gold");
};

export function gameStoppedEmbed() {
    return new EmbedBuilder()
        .setTitle('🎮 Jogo Encerrado!')
        .setDescription('O jogo foi encerrado. Tente novamente mais tarde.')
        .setColor('#FF0000');
};

const statLabels = {
    hp: 'HP',
    attack: 'ataque',
    defense: 'defesa',
    'special-attack': 'ataque especial',
    'special-defense': 'defesa especial',
    speed: 'velocidade'
};

function addPokemonDetails(embed, pokemon) {
    if (!pokemon) return embed;

    const artwork = pokemon.sprites?.other?.['official-artwork']?.front_default
        || pokemon.sprites?.front_default;
    const typeNames = pokemon.types?.map(({ type }) => type.name).join(' / ');
    const abilities = pokemon.abilities
        ?.map(({ ability, is_hidden }) => `${ability.name}${is_hidden ? ' (oculta)' : ''}`)
        .join(', ');
    const stats = pokemon.stats
        ?.map(({ base_stat, stat }) => `${statLabels[stat.name] ?? stat.name} ${base_stat}`)
        .join(' · ');

    if (pokemon.id) embed.setAuthor({ name: `Pokédex #${String(pokemon.id).padStart(3, '0')}` });
    if (artwork) embed.setThumbnail(artwork);
    if (pokemon.genus) embed.addFields({ name: 'Categoria', value: pokemon.genus, inline: true });
    if (typeNames) embed.addFields({ name: 'Tipo', value: typeNames, inline: true });
    if (pokemon.height != null && pokemon.weight != null) {
        embed.addFields({ name: 'Altura · Peso', value: `${(pokemon.height / 10).toFixed(1)} m · ${(pokemon.weight / 10).toFixed(1)} kg`, inline: true });
    }
    if (abilities) embed.addFields({ name: 'Habilidades', value: abilities });
    if (pokemon.base_experience != null) {
        embed.addFields({ name: 'Experiência base', value: String(pokemon.base_experience), inline: true });
    }
    if (stats) embed.addFields({ name: 'Status base', value: stats });
    if (pokemon.flavorText) embed.addFields({ name: 'Entrada da Pokédex', value: pokemon.flavorText.slice(0, 1000) });
    embed.setFooter({ text: 'PokéAPI' });

    return embed;
}

////////////// classic mode embeds
export function questionEmbed(item) {
    return new EmbedBuilder()
        .setTitle('❓ Pokémon ou Remédio?')
        .setDescription(`O item **\`${item.name}\`** é um Pokémon ou um Remédio?`)
        .setColor('#5865F2')
        .setFooter({ text: 'Você tem 15 segundos para responder!' })
        .setTimestamp();
};

export function correctEmbed(i, item, pokemon) {
    const embed = new EmbedBuilder()
        .setTitle(item.type === 'pokemon' ? `🎉 ${item.name} descoberto!` : '🎉 Acertou!')
        .setDescription(`Parabéns **${i.user.username}**! **\`${item.name}\`** realmente é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**!`)
        .setColor('#57F287');

    return item.type === 'pokemon' ? addPokemonDetails(embed, pokemon) : embed;
};

export function wrongEmbed(i, item, pokemon) {
    const embed = new EmbedBuilder()
        .setTitle('❌ Errou!')
        .setDescription(`Que pena **${i.user.username}**! **\`${item.name}\`** na verdade é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**!`)
        .setColor('#ED4245');

    return item.type === 'pokemon' ? addPokemonDetails(embed, pokemon) : embed;
};

export function timeoutEmbed(item, pokemon) {
    const embed = new EmbedBuilder()
        .setTitle('⏰ Tempo Esgotado!')
        .setDescription(`Você demorou muito para responder! **\`${item.name}\`** é um **${item.type === 'pokemon' ? 'Pokémon 🔴' : 'Remédio 💊'}**.`)
        .setColor('#FEE75C');

    return item.type === 'pokemon' ? addPokemonDetails(embed, pokemon) : embed;
};

////////////// find mode embeds
export function questionFindEmbed(item) {
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
    const optionsList = item
        .map((el, index) => `${emojis[index]} **\`${el.name}\`**`)
        .join('\n');

    return new EmbedBuilder()
        .setTitle('🔍 Qual destes é um Pokémon?')
        .setDescription(`Qual dos nomes abaixo é o **Pokémon**?\n\n${optionsList}`)
        .setColor('#5865F2')
        .setFooter({ text: 'Você tem 15 segundos para responder!' })
        .setTimestamp();
};

export function wrongFindEmbed(i, selectedItem, correctPokemon, pokemon) {
    const embed = new EmbedBuilder()
        .setTitle('❌ Errou!')
        .setDescription(`Que pena **${i.user.username}**! **\`${selectedItem.name}\`** é um **Remédio 💊**. O Pokémon era **\`${correctPokemon.name}\`**!`)
        .setColor('#ED4245');

    return addPokemonDetails(embed, pokemon);
};
