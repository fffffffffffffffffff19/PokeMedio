import { getTop } from '../../funcs/getTop.js';
import { top10Embed } from './embeds.js';

export default (interaction) => interaction.reply({ embeds: [top10Embed(getTop())] });
