import { getRank } from '../../funcs/getRank.js';
import { insertUser } from '../../funcs/insertUser.js';
import { rankUpdateEmbed, rankEmbed } from './embeds.js';

export default (interaction) => {
    const user = getRank(interaction.user);

    if (user == null) {
        insertUser(interaction.user);

        const newUser = getRank(interaction.user);

        const embed = rankUpdateEmbed(newUser);

        return interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
            interaction.editReply({ embeds: [embed], flags: ['EPHEMERAL'] });
        });
    }

    const embed = rankEmbed(user);

    return interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
        interaction.editReply({ embeds: [embed], flags: ['EPHEMERAL'] });
    });
};
