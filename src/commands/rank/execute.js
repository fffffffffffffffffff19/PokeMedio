import { getRank } from '../../funcs/getRank.js'
import { insertUser } from '../../funcs/insertUser.js'

export default (interaction) => {
	const user = getRank(interaction.user);

	if (user == null) {
		insertUser(interaction.user);

		const newUser = getRank(interaction.user);

		return interaction.reply({
			content: `posicao: ${newUser.position} score: ${newUser.score}`, ephemeral: true
		});
	}

	interaction.reply({
		content: `posicao: ${user.position} score: ${user.score}`, ephemeral: true
	});
}
