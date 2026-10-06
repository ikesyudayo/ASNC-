const { PermissionFlagsBits } = require('discord.js');

exports.handle = async (interaction) => {
  const [action, userId] = interaction.customId.split(':');
  if (!['approve', 'reject'].includes(action)) return;

  // 承認・却下できるのは「ロール管理」権限を持つ人だけ
  if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageRoles)) {
    return interaction.reply({ content: '権限がないよ', flags: 64 });
  }

  const member = await interaction.guild.members.fetch(userId).catch(() => null);
  if (!member) {
    return interaction.reply({ content: 'その人はもうサーバーにいないみたい', flags: 64 });
  }

  if (action === 'approve') {
    await member.roles.add(process.env.ROLE_ID);
    await member.send('クラン参加が承認されたよ！').catch(() => {});
  } else {
    await member.send('今回は見送りになったよ。').catch(() => {});
  }

  await interaction.update({
    content: `${action === 'approve' ? '✅ 承認' : '❌ 却下'} (担当: ${interaction.user})`,
    components: [],
  });
};
