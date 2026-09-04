import { getRank } from '../../funcs/getRank.js';
import { insertUser } from '../../funcs/insertUser.js';
import { EmbedBuilder } from 'discord.js';

export default (interaction) => {
    const user = getRank(interaction.user);

    if (user == null) {
        insertUser(interaction.user);

        const newUser = getRank(interaction.user);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Rank Update')
            .setDescription(`You have been added to the rank list. Your new position is: ${newUser.position} with a score of ${newUser.score}.`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
            interaction.editReply({ embeds: [embed], flags: ['EPHEMERAL'] });
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Your Rank')
        .setDescription(`Your current position is: ${user.position} with a score of ${user.score}.`)
        .setTimestamp();

    return interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
        interaction.editReply({ embeds: [embed], flags: ['EPHEMERAL'] });
    });
};
