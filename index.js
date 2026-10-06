const fs = require('fs');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// commands/ フォルダのコマンドを全部読み込む
for (const file of fs.readdirSync('./commands')) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  // サーバー限定でコマンドを登録（すぐ反映される）
  const rest = new REST().setToken(process.env.TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
    { body: [...client.commands.values()].map((c) => c.data.toJSON()) }
  );
  console.log(`起動したよ: ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      return await client.commands.get(interaction.commandName)?.execute(interaction);
    }
    if (interaction.isButton()) {
      return await require('./system/review').handle(interaction);
    }
  } catch (err) {
    console.error(err);
    const msg = { content: 'エラーが起きたよ', flags: 64 };
    if (interaction.replied || interaction.deferred) interaction.followUp(msg).catch(() => {});
    else interaction.reply(msg).catch(() => {});
  }
});

client.login(process.env.TOKEN);
