import { EmbedBuilder } from 'discord.js';

export const rankUpdateEmbed = (newUser) => {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Rank Update')
        .setDescription(`You have been added to the rank list. Your new position is: ${newUser.position} with a score of ${newUser.score}.`)
        .setTimestamp();
};

export const rankEmbed = (user) => {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Your Rank')
        .setDescription(`Your current position is: ${user.position} with a score of ${user.score}.`)
        .setTimestamp();
};
