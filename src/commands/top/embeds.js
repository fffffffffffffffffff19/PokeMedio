import { EmbedBuilder } from 'discord.js';

export function top10Embed(array) {
  if (!array || array.length === 0) {
    return new EmbedBuilder()
      .setTitle('🏆 Ranking Top 10')
      .setDescription('Nenhum jogador registrado no ranking ainda.')
      .setColor('#FFD700');
  }
  const medals = ['🥇', '🥈', '🥉'];
  const leaderboardText = array
    .slice(0, 10)
    .map((user, index) => {
      const position = medals[index] ?? `**${index + 1}º**`;
      
      return `${position} <@${user.user_id}> — Score: **${user.score}**`;
    })
    .join('\n');

  return new EmbedBuilder()
    .setTitle('🏆 Ranking Top 10')
    .setDescription(leaderboardText)
    .setColor('#FFD700');
}