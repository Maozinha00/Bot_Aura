// SCRIPT OFICIAL DO AURA BOT v2 - DESENVOLVIDO POR HENRIQUE
// Versão livre de IA - 100% focado em performance, comandos e utilitários

const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
require('dotenv').config();

const DEV_ID = "1174745079630549014"; // Seu ID oficial
const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX || '!';

if (!TOKEN) {
  console.error("❌ Erro crítico: O DISCORD_TOKEN não está configurado no arquivo .env!");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`========================================`);
  console.log(`🤖 Bot online com sucesso como: ${client.user.tag}`);
  console.log(`👑 Henrique (ID: ${DEV_ID}) configurado como Dono Oficial.`);
  console.log(`⚡ Servidores conectados: ${client.guilds.cache.size}`);
  console.log(`========================================`);

  // Status de presença dinâmico
  client.user.setPresence({
    activities: [{ name: 'Aura Bots Studio • Henrique Dev', type: ActivityType.Watching }],
    status: 'online',
  });
});

// Evento de boas-vindas para novos membros
client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.channels.cache.find(ch => ch.name.includes('boas-vindas') || ch.name.includes('welcome'));
  if (!channel) return;

  const welcomeEmbed = new EmbedBuilder()
    .setTitle(`👋 Bem-vindo(a) à nossa comunidade!`)
    .setDescription(`Olá ${member}, seja muito bem-vindo(a) ao **${member.guild.name}**! Aproveite os canais e interaja conosco.`)
    .setColor('#00ffcc')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage('https://i.imgur.com/3D1QETs.png') // Banner Oficial
    .setFooter({ text: `Membro nº ${member.guild.memberCount} • Aura Bots` })
    .setTimestamp();

  channel.send({ content: `👋 Bem-vindo ${member}!`, embeds: [welcomeEmbed] }).catch(console.error);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  // Responder se for mencionado diretamente
  if (message.mentions.has(client.user) && !message.reference) {
    return message.reply(`⚡ Olá! Meu prefixo padrão é \`${PREFIX}\`. Digite \`${PREFIX}ajuda\` para ver meus comandos disponíveis!`);
  }

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // === COMANDO: !dev ===
  if (command === 'dev') {
    if (message.author.id === DEV_ID) {
      const embed = new EmbedBuilder()
        .setTitle("👑 CONTROLE DO DESENVOLVEDOR ATIVO")
        .setDescription(`Olá **Henrique**! O sistema reconheceu com sucesso seu ID (\`${DEV_ID}\`). O Aura Bot está operando sob seu comando exclusivo e livre de bugs. 🚀`)
        .addFields(
          { name: '💻 Sistema Operacional', value: 'Debian GNU/Linux', inline: true },
          { name: '🟢 Latência da API', value: `\`${client.ws.ping}ms\``, inline: true }
        )
        .setColor("#3498db")
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    } else {
      return message.reply(`❌ Acesso negado. Apenas o desenvolvedor oficial Henrique pode usar este comando.`);
    }
  }

  // === COMANDO: !ajuda ===
  if (command === 'ajuda') {
    const helpEmbed = new EmbedBuilder()
      .setTitle("⚙️ CENTRAL DE AJUDA - AURA BOT v2")
      .setDescription("Confira a lista de todos os comandos do servidor disponíveis abaixo:")
      .addFields(
        { name: `📌 \`${PREFIX}ping\``, value: "Mede a latência atual do bot.", inline: true },
        { name: `🧹 \`${PREFIX}limpar <quantidade>\``, value: "Apaga mensagens do canal rápido.", inline: true },
        { name: `👑 \`${PREFIX}dev\``, value: "Comando especial do programador Henrique.", inline: true },
        { name: `ℹ️ \`${PREFIX}botinfo\``, value: "Mostra estatísticas técnicas do bot.", inline: true }
      )
      .setColor("#00ffcc")
      .setFooter({ text: "Aura Bots Studio • Desenvolvido por Henrique" })
      .setTimestamp();
    return message.reply({ embeds: [helpEmbed] });
  }

  // === COMANDO: !ping ===
  if (command === 'ping') {
    const sent = await message.reply('🏓 Calculando latência...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    return sent.edit(`🏓 **Pong!**\n• Latência do Bot: \`${latency}ms\`\n• Latência da API: \`${client.ws.ping}ms\``);
  }

  // === COMANDO: !limpar ===
  if (command === 'limpar' || command === 'clear') {
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply('❌ Você não tem permissão de `Gerenciar Mensagens`.');
    }
    
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('❌ Insira um número entre 1 e 100.');
    }

    await message.channel.bulkDelete(amount, true)
      .then(messages => {
        message.channel.send(`🧹 Sucesso! Apagadas **${messages.size}** mensagens.`).then(msg => {
          setTimeout(() => msg.delete(), 4000);
        });
      })
      .catch(err => {
        console.error(err);
        message.reply('❌ Erro ao limpar mensagens.');
      });
  }

  // === COMANDO: !botinfo ===
  if (command === 'botinfo') {
    const infoEmbed = new EmbedBuilder()
      .setTitle('ℹ️ Informações Técnicas do Bot')
      .setColor('#9b59b6')
      .addFields(
        { name: '👑 Criador', value: 'Henrique (ID: 1174745079630549014)', inline: true },
        { name: '📚 Biblioteca', value: 'Discord.js v14', inline: true },
        { name: '⚡ Servidores', value: `${client.guilds.cache.size}`, inline: true },
        { name: '🟢 Status', value: '100% Operacional', inline: true }
      )
      .setFooter({ text: 'Aura Bots Studio' })
      .setTimestamp();
    return message.reply({ embeds: [infoEmbed] });
  }
});

client.login(TOKEN);
