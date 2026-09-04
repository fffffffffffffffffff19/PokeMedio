import { getRank } from '../../funcs/getRank.js';
import { insertUser } from '../../funcs/insertUser.js';
import { rankUpdateEmbed, rankEmbed } from './embeds.js';
import { MessageFlags } from 'discord.js';

export default (interaction) => {
    const user = getRank(interaction.user);

    if (user == null) {
        insertUser(interaction.user);

        const newUser = getRank(interaction.user);

        const embed = rankUpdateEmbed(newUser);

        return interaction.reply({ embeds: [embed], withResponse: true }).then(() => {
            interaction.editReply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        });
    }

    const embed = rankEmbed(user);

    return interaction.reply({ embeds: [embed], withResponse: true }).then(() => {
        interaction.editReply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    });
};
