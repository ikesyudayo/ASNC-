const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apply')
    .setNameLocalizations({ ja: '申請' })
    .setDescription('クラン参加を申請する')
    .addStringOption((o) =>
      o.setName('roblox_name').setDescription('Robloxのユーザー名').setRequired(true)
    )
    .addAttachmentOption((o) =>
      o.setName('screenshot').setDescription('ランクや勝率が分かるスクショ').setRequired(true)
    ),

  async execute(interaction) {
    const robloxName = interaction.options.getString('roblox_name');
    const shot = interaction.options.getAttachment('screenshot');

    if (!shot.contentType?.startsWith('image/')) {
      return interaction.reply({ content: '画像を添付してね', flags: 64 });
    }

    const embed = new EmbedBuilder()
      .setTitle('参加申請')
      .setDescription(`申請者: ${interaction.user}\nRoblox名: ${robloxName}`)
      .setImage(shot.url);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`approve:${interaction.user.id}`)
        .setLabel('承認')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`reject:${interaction.user.id}`)
        .setLabel('却下')
        .setStyle(ButtonStyle.Danger)
    );

    const channel = await interaction.client.channels.fetch(process.env.REVIEW_CHANNEL_ID);
    await channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: '申請したよ！結果を待っててね', flags: 64 });
  },
};
