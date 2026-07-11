// ==============================================================================
// 👑 SCRIPT OFICIAL DO AURA BOT v2
// 🛠️ DESENVOLVIDO POR HENRIQUE (ID: 1174745079630549014)
// ⚡ 100% Livre de IA / Focado em Performance, Comandos e Utilitários Estáveis
// ==============================================================================

const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
require('dotenv').config();

const DEV_ID = "1174745079630549014"; // Seu ID do Discord (Henrique - Dono & Programador Oficial)
const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX || '!';

// Impede que o bot caia se houver algum erro inesperado na API
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [Erro Rejeitado] Erro não tratado:', promise, 'motivo:', reason);
});
process.on('uncaughtException', (err, origin) => {
  console.error(`⚠️ [Exceção Capturada] Erro: ${err}\nOrigem: ${origin}`);
});

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

// Evento quando o bot liga com sucesso
client.once('ready', () => {
  console.log(`===================================================`);
  console.log(`🤖 Aura Bot conectado com sucesso como: ${client.user.tag}`);
  console.log(`👑 Programador Oficial: Henrique (ID: ${DEV_ID})`);
  console.log(`⚡ Atendendo em: ${client.guilds.cache.size} servidores.`);
  console.log(`===================================================`);

  // Define um status de presença profissional na barra de status do bot
  client.user.setPresence({
    activities: [{ name: 'Aura Bots Studio • Henrique Dev', type: ActivityType.Watching }],
    status: 'online',
  });
});

// Evento de boas-vindas automatizado com o Banner Oficial
client.on('guildMemberAdd', async (member) => {
  // Procura por canais que contenham "boas-vindas", "welcome" ou "boas"
  const channel = member.guild.channels.cache.find(ch => 
    ch.name.includes('boas-vindas') || 
    ch.name.includes('welcome') || 
    ch.name.includes('boas')
  );
  if (!channel) return;

  const welcomeEmbed = new EmbedBuilder()
    .setTitle(`👋 Bem-vindo(a) à nossa comunidade!`)
    .setDescription(`Olá ${member}, seja muito bem-vindo(a) ao **${member.guild.name}**! Aproveite a nossa comunidade e divirta-se nos canais.`)
    .setColor('#00ffcc')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage('https://i.imgur.com/3D1QETs.png') // Seu Banner de Boas-Vindas Oficial
    .setFooter({ text: `Membro nº ${member.guild.memberCount} • Aura Bots` })
    .setTimestamp();

  channel.send({ content: `👋 Bem-vindo(a) ${member}!`, embeds: [welcomeEmbed] }).catch(console.error);
});

// Handler central de comandos por chat
client.on('messageCreate', async (message) => {
  // Desconsidera mensagens de bots e mensagens fora de servidores
  if (message.author.bot || !message.guild) return;

  // Responde amigavelmente se alguém mencionar o bot diretamente
  if (message.mentions.has(client.user) && !message.reference) {
    return message.reply(`⚡ Olá! Meu prefixo padrão é \`${PREFIX}\`. Digite \`${PREFIX}ajuda\` para ver a lista de comandos!`);
  }

  // Verifica se a mensagem começa com o prefixo configurado
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // ==========================================
  // 👑 COMANDO EXCLUSIVO: !dev
  // ==========================================
  if (command === 'dev') {
    if (message.author.id === DEV_ID) {
      const devEmbed = new EmbedBuilder()
        .setTitle("👑 CONTROLE DO DESENVOLVEDOR ATIVO")
        .setDescription(`Olá **Henrique**! O sistema reconheceu com sucesso seu ID (\`${DEV_ID}\`). O Aura Bot está operando sob seu controle total de programador. 🚀`)
        .addFields(
          { name: '💻 Sistema Operacional', value: 'Debian/Linux Container', inline: true },
          { name: '🟢 Ping de Comunicação', value: `\`${client.ws.ping}ms\``, inline: true }
        )
        .setColor("#3498db")
        .setTimestamp();
      return message.reply({ embeds: [devEmbed] });
    } else {
      return message.reply(`❌ Acesso negado. Apenas meu desenvolvedor oficial Henrique (ID: \`${DEV_ID}\`) pode usar este comando.`);
    }
  }

  // ==========================================
  // ℹ️ COMANDO: !ajuda
  // ==========================================
  if (command === 'ajuda' || command === 'help') {
    const helpEmbed = new EmbedBuilder()
      .setTitle("⚙️ CENTRAL DE AJUDA - AURA BOT v2")
      .setDescription("Confira abaixo a lista de comandos disponíveis instalados no bot:")
      .addFields(
        { name: `📌 \`${PREFIX}ping\``, value: "Mapeia a latência de rede atual do bot.", inline: true },
        { name: `🧹 \`${PREFIX}limpar <1-100>\``, value: "Apaga mensagens do chat atual instantaneamente.", inline: true },
        { name: `👑 \`${PREFIX}dev\``, value: "Painel de controle exclusivo para o programador Henrique.", inline: true },
        { name: `ℹ️ \`${PREFIX}botinfo\``, value: "Exibe estatísticas técnicas de performance do bot.", inline: true }
      )
      .setColor("#00ffcc")
      .setFooter({ text: "Aura Bots Studio • Desenvolvido por Henrique" })
      .setTimestamp();
    return message.reply({ embeds: [helpEmbed] });
  }

  // ==========================================
  // 🏓 COMANDO: !ping
  // ==========================================
  if (command === 'ping') {
    const sent = await message.reply('🏓 Calculando latência atual...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    return sent.edit(`🏓 **Pong!**\n• Latência do Bot: \`${latency}ms\`\n• Latência do Gateway: \`${client.ws.ping}ms\``);
  }

  // ==========================================
  // 🧹 COMANDO: !limpar
  // ==========================================
  if (command === 'limpar' || command === 'clear') {
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply('❌ Você precisa ter a permissão de `Gerenciar Mensagens` para usar este comando.');
    }
    
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('❌ Forneça um valor válido entre 1 e 100 para limpar o chat.');
    }

    await message.channel.bulkDelete(amount, true)
      .then(messages => {
        message.channel.send(`🧹 Sucesso! Foram limpas **${messages.size}** mensagens do canal.`).then(msg => {
          setTimeout(() => msg.delete().catch(() => {}), 4000); // Apaga o aviso após 4 segundos
        });
      })
      .catch(err => {
        console.error(err);
        message.reply('❌ Ocorreu um erro técnico ao tentar limpar (mensagem com mais de 14 dias não podem ser apagadas em massa).');
      });
  }

  // ==========================================
  // ℹ️ COMANDO: !botinfo
  // ==========================================
  if (command === 'botinfo') {
    const infoEmbed = new EmbedBuilder()
      .setTitle('ℹ️ Estatísticas Técnicas do Bot')
      .setColor('#9b59b6')
      .addFields(
        { name: '👑 Programador', value: 'Henrique (ID: 1174745079630549014)', inline: true },
        { name: '📚 Biblioteca', value: 'Discord.js v14', inline: true },
        { name: '⚡ Servidores Ativos', value: `${client.guilds.cache.size}`, inline: true },
        { name: '🟢 Status de Rede', value: '100% Online & Estável', inline: true }
      )
      .setFooter({ text: 'Aura Bots Studio' })
      .setTimestamp();
    return message.reply({ embeds: [infoEmbed] });
  }
});

client.login(TOKEN);
