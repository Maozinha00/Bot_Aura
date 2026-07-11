// ======================================================================
// 🤖 SCRIPT OFICIAL DO AURA BOT v2 - DESENVOLVEDOR POR HENRIQUE
// Versão livre de IA - 100% focado em performance, comandos e utilitários
// Com mapeamento automático de IDs e envio inteligente de mensagens
// ======================================================================

const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const DEV_ID = "1174745079630549014"; // ID oficial do Henrique
const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX || '!';

if (!TOKEN) {
  console.error("❌ Erro crítico: O TOKEN do bot não está configurado no arquivo .env!");
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

// Banco de dados em memória para salvar as configurações de canais detectados
let configuredChannels = {};

// Conteúdo oficial das mensagens / embeds por canal
const OFFICIAL_MESSAGES = {
  "👋・boas-vindas": {
    title: "👋 BEM-VINDO AO AURA BOTS STUDIO 👋",
    description: "🌟 **Olá! Seja muito bem-vindo à nossa comunidade oficial!**\nAqui você encontrará as melhores soluções de automação e inteligência artificial para o seu servidor Discord.\n\n🔹 **Comece por aqui:**\n• Leia nossas diretrizes em: <#regras>\n• Acesse nosso catálogo oficial em: <#catálogo>\n• Peça ajuda ou faça orçamentos em: <#abrir-ticket>\n\n🚀 **Nosso Objetivo:** Unir tecnologia de ponta, estabilidade 24/7 e suporte VIP de alta qualidade.",
    color: "#00ffcc",
    image: "https://i.imgur.com/3D1QETs.png",
    footer: "Aura Bots Studio • Tecnologia Virtual de Ponta"
  },
  "📚・regras": {
    title: "👑 DIRETRIZES DA COMUNIDADE - AURA BOTS STUDIO 👑",
    description: "🌟 **Seja muito bem-vindo!** Leia atentamente as nossas regras oficiais para manter a ordem e garantir um suporte de altíssima qualidade.\n\n1️⃣・**RESPEITO EM PRIMEIRO LUGAR**\n• É obrigatório tratar todos com o máximo de cordialidade.\n• **Proibido** insultos, discursos de ódio ou comportamentos tóxicos.\n\n2️⃣・**SEM SPAM OU DIVULGAÇÃO (DM/CHAT)**\n• **Proibido** enviar convites de servidores ou links externos sem autorização.\n• **Punição imediata** para quem fizer flood ou importunar membros no privado.\n\n3️⃣・**ATENDIMENTO EXCLUSIVO VIA TICKET**\n• Para suporte técnico ou compras, use sempre o canal de ticket.\n• **Não marque** a diretoria ou desenvolvedores no privado.\n\n4️⃣・**USO ADEQUADO DOS CANAIS**\n• Cada canal tem um propósito único. Use os chats adequados para conversas e comandos.\n\n5️⃣・**PROTEÇÃO & SEGURANÇA GERAL**\n• Qualquer abuso de bugs ou de comandos de nossos bots resultará em **banimento permanente**.",
    color: "#00ffcc",
    footer: "🔒 Aura Bots Studio • Segurança & Tecnologia Garantida"
  },
  "📢・anúncios": {
    title: "📢 ANÚNCIO OFICIAL - INTEGRAÇÃO GEMINI AI 🧠",
    description: "Fala rapaziada! Estamos lançando oficialmente nosso novo bot integrado ao **Gemini AI**! Agora você pode ter uma inteligência artificial completa que conversa, resume discussões, cria eventos e tira dúvidas de código em tempo real no Discord.\n\n✨ **PLANO DISPONÍVEL:** Já configurado no canal <#catálogo>.\n🎁 **Sandbox Ativa:** Clientes Premium têm acesso exclusivo em <#sandbox> para testar os prompts.",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Inteligência Artificial Integrada"
  },
  "✨・novidades": {
    title: "🚀 NOVIDADES INCRÍVEIS - CLOUD UPGRADE ⚡",
    description: "Fechamos uma nova parceria estratégica de infraestrutura em nuvem de altíssima performance!\n\n• **Estabilidade Absoluta:** Nossos bots agora rodam com 99.9% de uptime.\n• **Ping Reduzido:** Latência média inferior a **15ms** em servidores sul-americanos.\n• **Mais Velocidade:** Respostas instantâneas para comandos complexos!",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Tecnologia e Infraestrutura"
  },
  "⚙️・changelog": {
    title: "⚙️ CHANGELOG - Aura Ticket Bot v2.4.1 ⚙️",
    description: "🛠️ **MELHORIAS E ATUALIZAÇÕES DA SEMANA:**\n\n• **Correção de Bugs:** Resolvido o erro onde o arquivo de transcrição em HTML ficava vazio.\n• **Multi-Painéis:** Agora com suporte para múltiplos painéis de atendimento em canais separados.\n• **Segurança:** Implementamos limite de tickets ativos por usuário para evitar spam.\n• **Performance:** Otimização geral no tempo de carregamento do bot em **40%**.",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Desenvolvimento e Updates"
  },
  "🎉・sorteios": {
    title: "🎉 RESULTADO DO SORTEIO ESPECIAL 🎉",
    description: "Parabéns aos grandes vencedores do nosso sorteio mensal de aniversário!\n\n👑 **Ganhadores (1 Mês de Combo Premium 💎 Grátis):**\n• @LucasGamer#9901\n• @JuliaDev#4421\n\n🔔 **Instruções:** Abram um ticket privado em <#abrir-ticket> para resgatar sua assinatura dentro do prazo de **48 horas**!",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Eventos & Sorteios"
  },
  "❓・faq": {
    title: "❓ CENTRAL DE DÚVIDAS FREQUENTES (FAQ) ❓",
    description: "📌 **Como funcionam os bots?**\n• *Nossos bots operam 24/7 de forma 100% autônoma. A configuração é feita de forma simples e intuitiva via painel.*\n\n📌 **Consigo alterar o nome e foto do bot?**\n• *Sim! No plano personalizado ou no Combo Premium, o bot é totalmente moldado com a sua própria marca e identidade visual.*\n\n📌 **Quais as formas de pagamento aceitas?**\n• *Aceitamos PIX, Cartão de Crédito e Boleto. Para conferir os detalhes de taxas e descontos, leia <#formas-de-pagamento>.*",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Central de Ajuda"
  },
  "🛍️・catálogo": {
    title: "💎 CATÁLOGO OFICIAL - AURA BOTS STUDIO 💎",
    description: "🚀 **Adquira os melhores bots para a sua comunidade!** Nossos sistemas funcionam **24/7 hospedados em servidores de ponta**, garantindo 100% de estabilidade!\n\n🎫・**AURA TICKET BOT**\n• Atendimento dinâmico com **botões integrados**\n• Transcrições de conversas salvas em **HTML**\n• Painel de controle completo\n• 📦 **Valor: R$ 19,00/mês**\n\n🛡️・**AURA MODERADOR PRO**\n• Sistema robusto de **antiraid & anti-link**\n• Logs detalhados de todas as ações de membros\n• Verificação para evitar contas falsas\n• 📦 **Valor: R$ 25,00/mês**\n\n🎰・**AURA ECONOMIA & CASSINO**\n• Moeda própria com mini-jogos exclusivos\n• Rankings globais e sistema de níveis (XP)\n• Loja para resgatar cargos no servidor\n• 📦 **Valor: R$ 29,00/mês**\n\n🧠・**AURA GEMINI AI**\n• Inteligência Artificial integrada ao chat\n• Responde dúvidas e ajuda na programação\n• 📦 **Valor: R$ 39,00/mês**\n\n🌟・**COMBO SUPREMO PREMIUM (💎)**\n• 🔥 **Leve todos os nossos bots integrados em um único pacote!**\n• Suporte prioritário 24 horas + Hospedagem Premium inclusa de graça\n• 💰 **De R$ 112,00 por APENAS R$ 59,00/mês!**",
    color: "#00ffcc",
    footer: "Para adquirir, abra um ticket em #abrir-ticket!"
  },
  "📦・preços": {
    title: "💎 AURA BOTS STUDIO - TABELA DE PREÇOS 💎",
    description: "📌 **BOT BÁSICO** — **R$ 15,00/mês**\n• Comandos essenciais e estáveis\n• Bot leve, rápido e com hospedagem inclusa\n\n📌 **BOT PERSONALIZADO** — **R$ 50,00/mês**\n• Sistemas sob medida (Sua ideia vira realidade)\n• Funções exclusivas & API de dados personalizada\n\n📌 **BOT ENTERPRISE** — **R$ 120,00/mês**\n• Integrações completas com painéis ou servidores externos\n• Automação avançada para grandes comunidades virtuais\n\n⚡ **INFORMAÇÕES ADICIONAIS:**\n✔ **Entrega Expressa:** Configuração em tempo recorde\n✔ **Suporte Premium:** Equipe pronta para te ajudar 24/7\n\n🎫 Para fazer seu pedido, abra um canal de ticket!",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Orçamentos via Ticket"
  },
  "🤖・bots-disponíveis": {
    title: "🟢 CONEXÃO E LATÊNCIA DOS BOTS OFICIAIS 🟢",
    description: "🤖 `[ONLINE]` **Aura Ticket Bot#1001** (Atendimento Automatizado)\n🤖 `[ONLINE]` **Aura Moderador Bot#1002** (Segurança & Antiraid)\n🤖 `[ONLINE]` **Aura Casino Bot#1003** (Economia & Entretenimento)\n🤖 `[ONLINE]` **Aura Gemini AI Bot#1004** (Inteligência Artificial)\n\n🌍 **Servidores de Hospedagem:** América do Sul (Latência ultra-baixa de **12ms**)\n🛡️ **Mecanismo de Proteção:** Ativo contra ataques DDoS e quedas inesperadas!",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Status de Sistemas"
  },
  "💎・planos": {
    title: "📦 PLANOS DE ASSINATURA EXCLUSIVOS 📦",
    description: "• 📅 **Plano Mensal:** **R$ 59,00/mês** (Renovação simples sem fidelidade)\n• 🌟 **Plano Semestral:** **R$ 299,00** (Economize R$ 55,00 + Receba suporte VIP priorizado)\n• 👑 **Plano Anual:** **R$ 499,00** (Economize R$ 209,00 + Ganhe acesso vitalício ao grupo de testes de novos bots!)\n\n💡 *Todos os planos acima já acompanham hospedagem cloud grátis inclusa no valor.*",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Adquira já o seu!"
  },
  "🔥・promoções": {
    title: "🔥 CAMPANHA DE DESCONTO IMEDIATO 🔥",
    description: "Adquirindo qualquer bot hoje, você ganha **15 dias de licença grátis adicionais** no seu primeiro mês!\n\n🔑 Use o cupom **AURAFIRST15** ao iniciar o seu atendimento privado em <#abrir-ticket> para validar o benefício.",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Promoções Ativas"
  },
  "💳・formas-de-pagamento": {
    title: "💳 MÉTODOS DE PAGAMENTO SEGUROS 💳",
    description: "⚡ **PIX:** QR Code gerado instantaneamente no ticket. A liberação do bot ocorre de forma **automática em menos de 1 minuto**.\n💳 **Cartão de Crédito:** Parcelamento disponível via Mercado Pago ou Stripe.\n🏦 **Boleto Bancário:** Compensação e ativação em até 1 dia útil.\n\n🧾 *Enviamos o recibo e detalhes da licença diretamente para o seu e-mail cadastrado.*",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Financeiro Seguro"
  },
  "🎫・abrir-ticket": {
    title: "🎫 CENTRAL DE ATENDIMENTO E SUPORTE 🎫",
    description: "Precisa comprar um bot ou falar com nossa equipe de suporte? Abra um ticket privado clicando no botão verde abaixo!\n\n🕒 **Horário de Funcionamento:**\n• Segunda a Sábado: **09:00 às 22:00**\n• Domingo: **Plantão de urgências**\n\n*Clique abaixo para iniciar seu atendimento personalizado com o Aura Bot.*",
    color: "#00ffcc",
    footer: "Aura Bots Studio • Atendimento VIP",
    isTicket: true
  }
};

client.once('ready', async () => {
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

  // Executa o scanner automático de canais de texto e voz ao iniciar
  console.log(`🔍 [SCANNER] Identificando todos os canais do servidor...`);
  const guilds = client.guilds.cache.values();
  for (const guild of guilds) {
    console.log(`⚙️ Sincronizando canais no servidor: ${guild.name}`);
    
    // Mapeamento automático por nome aproximado ou exato
    guild.channels.cache.forEach(channel => {
      const channelNameClean = channel.name.toLowerCase().trim();
      configuredChannels[channelNameClean] = channel.id;
      console.log(`  ✔️ Canal identificado: "${channel.name}" -> ID: ${channel.id}`);
    });

    // Se o usuário desejar enviar as mensagens oficiais automaticamente, descomente abaixo:
    // await enviarMensagensOficiais(guild);
  }
});

// Função para enviar os embeds configurados do Aura Bots Studio nos canais correspondentes
async function enviarMensagensOficiais(guild) {
  console.log(`📤 [GERADOR] Enviando mensagens e embeds oficiais do Aura Bots Studio...`);

  for (const [channelName, embedData] of Object.entries(OFFICIAL_MESSAGES)) {
    // Procura o canal correspondente no cache do servidor
    const targetChannel = guild.channels.cache.find(ch => 
      ch.name.toLowerCase().includes(channelName.toLowerCase()) || 
      channelName.toLowerCase().includes(ch.name.toLowerCase())
    );

    if (targetChannel && targetChannel.isTextBased()) {
      try {
        // Limpar mensagens antigas para evitar duplicados (opcional)
        await targetChannel.bulkDelete(10).catch(() => {});

        const embed = new EmbedBuilder()
          .setTitle(embedData.title)
          .setDescription(embedData.description.replace(/\\n/g, '\n'))
          .setColor(embedData.color || '#00ffcc')
          .setFooter({ text: embedData.footer || 'Aura Bots Studio' })
          .setTimestamp();

        if (embedData.image) {
          embed.setImage(embedData.image);
        }

        // Adiciona botões interativos de ticket se for o canal de ticket
        if (embedData.isTicket) {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('abrir_ticket_btn')
              .setLabel('🎫 Abrir Ticket')
              .setStyle(ButtonStyle.Success)
          );
          await targetChannel.send({ embeds: [embed], components: [row] });
        } else {
          await targetChannel.send({ embeds: [embed] });
        }

        console.log(`  ✨ Mensagem oficial publicada em #${targetChannel.name} (ID: ${targetChannel.id})`);
      } catch (err) {
        console.error(`  ❌ Erro ao enviar mensagem no canal ${channelName}: `, err.message);
      }
    } else {
      console.log(`  ⚠️ Canal '#${channelName}' não encontrado ou não é de texto.`);
    }
  }
}

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

// Evento de interação para botões (como o de abrir ticket)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'abrir_ticket_btn') {
    const guild = interaction.guild;
    const member = interaction.user;

    // Nome único do canal do ticket
    const channelName = `ticket-${member.username}`;

    // Verifica se já não existe um ticket para este usuário
    const existingChannel = guild.channels.cache.find(ch => ch.name === channelName);
    if (existingChannel) {
      return interaction.reply({ content: `❌ Você já possui um ticket aberto em ${existingChannel}!`, ephemeral: true });
    }

    // Cria o canal privado de ticket
    try {
      const ticketChannel = await guild.channels.create({
        name: channelName,
        type: 0, // GuildText
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel'], // Oculta de todos por padrão
          },
          {
            id: member.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'], // Permite ao usuário do ticket
          },
          {
            id: client.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ManageMessages'], // Permite ao bot
          }
        ]
      });

      const welcomeTicketEmbed = new EmbedBuilder()
        .setTitle('🎫 ATENDIMENTO INICIADO - AURA BOTS')
        .setDescription(`Olá ${member}, seja muito bem-vindo ao suporte técnico da **Aura Bots Studio**!\n\nDescreva detalhadamente sua dúvida ou qual bot deseja comprar. Nossa equipe entrará em contato em instantes.`)
        .setColor('#00ffcc')
        .setFooter({ text: 'Aura Bots Studio' })
        .setTimestamp();

      const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('fechar_ticket_btn')
          .setLabel('🔒 Fechar Atendimento')
          .setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({ content: `👋 Olá ${member}!`, embeds: [welcomeTicketEmbed], components: [closeRow] });
      await interaction.reply({ content: `✔️ Seu canal de atendimento privado foi criado com sucesso em ${ticketChannel}!`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Erro crítico ao criar seu canal de ticket.', ephemeral: true });
    }
  }

  if (interaction.customId === 'fechar_ticket_btn') {
    await interaction.reply('🔒 O ticket será fechado e deletado em 5 segundos...');
    setTimeout(async () => {
      try {
        await interaction.channel.delete();
      } catch (err) {
        console.error('Erro ao deletar canal do ticket:', err.message);
      }
    }, 5000);
  }
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

  // === COMANDO: !gerarmensagens ===
  if (command === 'gerarmensagens' || command === 'configurar') {
    if (message.author.id !== DEV_ID) {
      return message.reply(`❌ Acesso negado. Apenas o desenvolvedor oficial Henrique pode forçar o gerador de embeds oficiais.`);
    }
    const msg = await message.reply('⚡ Iniciando a publicação automática dos embeds oficiais em todos os canais identificados...');
    await enviarMensagensOficiais(message.guild);
    return msg.edit('✨ **Sucesso!** Os embeds oficiais do Aura Bots Studio foram publicados nos canais correspondentes!');
  }

  // === COMANDO: !canais ===
  if (command === 'canais' || command === 'ids') {
    if (message.author.id !== DEV_ID) {
      return message.reply(`❌ Acesso negado. Apenas o desenvolvedor oficial Henrique pode visualizar a lista mapeada de IDs.`);
    }
    let list = '📌 **IDs DOS CANAIS IDENTIFICADOS:**\n━━━━━━━━━━━━━━━━━━━━━━━━\n';
    let count = 0;
    for (const [name, id] of Object.entries(configuredChannels)) {
      list += `• **${name}** ➔ `${id}`\n`;
      count++;
    }
    if (count === 0) list = '⚠️ Nenhum canal foi identificado ainda. Certifique-se de reiniciar o bot ou que canais válidos existam.';
    return message.reply(list);
  }

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
        { name: `ℹ️ \`${PREFIX}botinfo\``, value: "Mostra estatísticas técnicas do bot.", inline: true },
        { name: `📤 \`${PREFIX}configurar\``, value: "Gera e publica os embeds oficiais nos canais (Henrique).", inline: true },
        { name: `🔍 \`${PREFIX}canais\``, value: "Mostra a lista de canais e seus IDs detectados (Henrique).", inline: true }
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
