// ======================================================================
// 🤖 AURA BOT STUDIO v4.2
// 👑 DESENVOLVIDO POR HENRIQUE
// Scanner automático de canais + mensagens + tickets + comandos
// ======================================================================

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType
} = require("discord.js");

require("dotenv").config();

// ======================================================================
// CONFIGURAÇÕES
// ======================================================================

const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX || "!";
const DEV_ID = process.env.DEV_ID || "1174745079630549014";

if (!TOKEN) {
  console.error("❌ ERRO CRÍTICO: TOKEN não configurado no .env!");
  process.exit(1);
}

// ======================================================================
// CLIENT
// ======================================================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ======================================================================
// BANCO DE CANAIS EM MEMÓRIA
// ======================================================================

const configuredChannels = new Map();

// ======================================================================
// NORMALIZAR NOME
// ======================================================================

function normalizarNome(nome) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .trim();
}

// ======================================================================
// PEGAR MAPA DO SERVIDOR
// ======================================================================

function getGuildChannels(guildId) {
  if (!configuredChannels.has(guildId)) {
    configuredChannels.set(guildId, new Map());
  }

  return configuredChannels.get(guildId);
}

// ======================================================================
// ESCANEAR CANAIS
// ======================================================================

function escanearCanais(guild) {
  const canaisMap = getGuildChannels(guild.id);

  canaisMap.clear();

  console.log("");
  console.log("====================================================");
  console.log(`🔍 ESCANEANDO SERVIDOR: ${guild.name}`);
  console.log(`🆔 SERVIDOR ID: ${guild.id}`);
  console.log("====================================================");

  const canais = [...guild.channels.cache.values()].sort(
    (a, b) => a.rawPosition - b.rawPosition
  );

  for (const canal of canais) {
    const nomeLimpo = normalizarNome(canal.name);

    canaisMap.set(nomeLimpo, canal.id);

    if (canal.type === ChannelType.GuildCategory) {
      console.log("");
      console.log(`📁 CATEGORIA: ${canal.name}`);
      console.log(`🆔 ${canal.id}`);
      continue;
    }

    if (canal.type === ChannelType.GuildText) {
      console.log(`💬 #${canal.name} ➜ ${canal.id}`);
      continue;
    }

    if (canal.type === ChannelType.GuildVoice) {
      console.log(`🔊 ${canal.name} ➜ ${canal.id}`);
      continue;
    }

    console.log(`⚙️ ${canal.name} ➜ ${canal.id}`);
  }

  console.log("");
  console.log(`✅ ${canaisMap.size} canais/categorias identificados.`);
  console.log("====================================================");

  return canaisMap;
}

// ======================================================================
// LOCALIZAR CANAL
// ======================================================================

function localizarCanal(guild, nomes) {
  const nomesNormalizados = nomes.map(normalizarNome);

  // PRIMEIRO: NOME EXATO

  let canal = guild.channels.cache.find((ch) => {
    const nome = normalizarNome(ch.name);

    return nomesNormalizados.includes(nome);
  });

  if (canal) return canal;

  // SEGUNDO: NOME APROXIMADO

  canal = guild.channels.cache.find((ch) => {
    const nome = normalizarNome(ch.name);

    return nomesNormalizados.some(
      (procurado) =>
        nome.includes(procurado) ||
        procurado.includes(nome)
    );
  });

  return canal || null;
}

// ======================================================================
// MENÇÃO AUTOMÁTICA DE CANAL
// ======================================================================

function mencionarCanal(guild, nomes, fallback) {
  const canal = localizarCanal(guild, nomes);

  if (!canal) {
    return `#${fallback}`;
  }

  return `<#${canal.id}>`;
}

// ======================================================================
// CRIAR MENSAGENS OFICIAIS
// ======================================================================

function criarMensagensOficiais(guild) {
  const regras = mencionarCanal(
    guild,
    ["regras", "📚・regras"],
    "regras"
  );

  const catalogo = mencionarCanal(
    guild,
    ["catalogo", "catálogo", "🛍️・catálogo"],
    "catálogo"
  );

  const ticket = mencionarCanal(
    guild,
    ["abrir-ticket", "ticket", "🎫・abrir-ticket"],
    "abrir-ticket"
  );

  const pagamento = mencionarCanal(
    guild,
    ["formas-de-pagamento", "pagamento"],
    "formas-de-pagamento"
  );

  return [
    {
      canais: ["boas-vindas", "welcome"],

      titulo: "👋 BEM-VINDO AO AURA BOTS STUDIO 👋",

      descricao:
        `🌟 **Olá! Seja muito bem-vindo à nossa comunidade oficial!**\n\n` +
        `Aqui você encontrará soluções de automação e desenvolvimento para servidores Discord.\n\n` +
        `🔹 **COMECE POR AQUI:**\n` +
        `• Leia nossas diretrizes em ${regras}\n` +
        `• Conheça nossos produtos em ${catalogo}\n` +
        `• Solicite atendimento em ${ticket}\n\n` +
        `🚀 **NOSSO OBJETIVO**\n` +
        `Criar bots rápidos, modernos, organizados e personalizados para sua comunidade.`,

      cor: "#00ffcc"
    },

    {
      canais: ["regras"],

      titulo: "👑 DIRETRIZES DA COMUNIDADE 👑",

      descricao:
        `🌟 **Leia atentamente nossas regras oficiais.**\n\n` +

        `1️⃣・**RESPEITO EM PRIMEIRO LUGAR**\n` +
        `• Respeite todos os membros e clientes.\n` +
        `• Comportamentos tóxicos não serão tolerados.\n\n` +

        `2️⃣・**SEM SPAM OU DIVULGAÇÃO**\n` +
        `• Proibido flood e spam.\n` +
        `• Proibido divulgar servidores sem autorização.\n\n` +

        `3️⃣・**ATENDIMENTO VIA TICKET**\n` +
        `• Compras e suporte devem ser tratados em ${ticket}.\n` +
        `• Evite chamar a equipe no privado.\n\n` +

        `4️⃣・**UTILIZE OS CANAIS CORRETAMENTE**\n` +
        `• Cada canal possui sua finalidade.\n\n` +

        `5️⃣・**SEGURANÇA**\n` +
        `• Tentativas de abuso dos sistemas poderão resultar em banimento.`,

      cor: "#00ffcc"
    },

    {
      canais: ["anuncios", "anúncios"],

      titulo: "📢 ANÚNCIOS OFICIAIS",

      descricao:
        `📢 **Bem-vindo ao canal oficial de anúncios!**\n\n` +
        `Todas as novidades, lançamentos e atualizações da **Aura Bots Studio** serão publicadas aqui.\n\n` +
        `🔔 Ative as notificações para não perder nenhuma novidade.`,

      cor: "#00ffcc"
    },

    {
      canais: ["novidades"],

      titulo: "🚀 NOVIDADES AURA BOTS STUDIO",

      descricao:
        `⚡ **Fique por dentro das novidades!**\n\n` +
        `🤖 Novos bots\n` +
        `🛠️ Novos sistemas\n` +
        `⚙️ Atualizações\n` +
        `🎁 Promoções\n` +
        `🚀 Melhorias de performance\n\n` +
        `A Aura Bots Studio está sempre evoluindo!`,

      cor: "#00ffcc"
    },

    {
      canais: ["changelog"],

      titulo: "⚙️ CHANGELOG OFICIAL",

      descricao:
        `🛠️ **ATUALIZAÇÕES DOS SISTEMAS**\n\n` +
        `Este canal registra melhorias, correções e novas funções dos nossos bots.\n\n` +
        `🐛 Correções de bugs\n` +
        `⚡ Melhorias de performance\n` +
        `🔒 Atualizações de segurança\n` +
        `🤖 Novos comandos\n` +
        `🚀 Novos sistemas`,

      cor: "#00ffcc"
    },

    {
      canais: ["sorteios"],

      titulo: "🎉 SORTEIOS AURA BOTS STUDIO",

      descricao:
        `🎁 **Bem-vindo ao nosso canal de sorteios!**\n\n` +
        `Aqui serão realizados sorteios de:\n\n` +
        `🤖 Bots\n` +
        `💎 Planos Premium\n` +
        `🎫 Sistemas personalizados\n` +
        `🎁 Benefícios exclusivos\n\n` +
        `Boa sorte! 🍀`,

      cor: "#00ffcc"
    },

    {
      canais: ["faq"],

      titulo: "❓ DÚVIDAS FREQUENTES — FAQ",

      descricao:
        `📌 **Como funcionam os bots?**\n` +
        `Nossos bots são configurados conforme o sistema contratado.\n\n` +

        `📌 **Posso personalizar nome e foto?**\n` +
        `Sim. Sistemas personalizados podem receber identidade própria.\n\n` +

        `📌 **Como faço uma compra?**\n` +
        `Abra um atendimento em ${ticket}.\n\n` +

        `📌 **Quais formas de pagamento?**\n` +
        `Consulte ${pagamento}.\n\n` +

        `📌 **Preciso de suporte?**\n` +
        `Abra um ticket e explique detalhadamente seu problema.`,

      cor: "#00ffcc"
    },

    {
      canais: ["catalogo", "catálogo"],

      titulo: "💎 CATÁLOGO OFICIAL — AURA BOTS STUDIO 💎",

      descricao:
        `🚀 **BOTS E SISTEMAS DISPONÍVEIS**\n\n` +

        `🎫・**AURA TICKET BOT**\n` +
        `• Atendimento com botões\n` +
        `• Sistema privado de tickets\n` +
        `• Organização automática\n` +
        `💰 **R$ 19,00/mês**\n\n` +

        `🛡️・**AURA MODERADOR PRO**\n` +
        `• Sistema de moderação\n` +
        `• Proteção contra links\n` +
        `• Logs administrativos\n` +
        `💰 **R$ 25,00/mês**\n\n` +

        `🎰・**AURA ECONOMIA**\n` +
        `• Economia personalizada\n` +
        `• Rankings\n` +
        `• Sistema de níveis\n` +
        `💰 **R$ 29,00/mês**\n\n` +

        `🧠・**AURA IA BOT**\n` +
        `• Inteligência artificial\n` +
        `• Respostas automáticas\n` +
        `• Auxílio em programação\n` +
        `💰 **R$ 39,00/mês**\n\n` +

        `🌟・**COMBO PREMIUM**\n` +
        `🔥 Pacote completo de sistemas.\n` +
        `💰 **R$ 59,00/mês**\n\n` +

        `🎫 Para comprar, abra um atendimento em ${ticket}.`,

      cor: "#00ffcc"
    },

    {
      canais: ["precos", "preços"],

      titulo: "💎 TABELA DE PREÇOS",

      descricao:
        `📌 **BOT BÁSICO**\n` +
        `💰 R$ 15,00/mês\n\n` +

        `📌 **BOT PERSONALIZADO**\n` +
        `💰 A partir de R$ 50,00\n\n` +

        `📌 **BOT ENTERPRISE**\n` +
        `💰 A partir de R$ 120,00\n\n` +

        `⚠️ O valor final poderá variar conforme as funções solicitadas.\n\n` +

        `🎫 Solicite seu orçamento em ${ticket}.`,

      cor: "#00ffcc"
    },

    {
      canais: ["bots-disponiveis", "bots-disponíveis"],

      titulo: "🤖 BOTS DISPONÍVEIS",

      descricao:
        `🟢 **AURA TICKET BOT**\n` +
        `Sistema de atendimento.\n\n` +

        `🟢 **AURA MODERADOR**\n` +
        `Sistema administrativo e proteção.\n\n` +

        `🟢 **AURA ECONOMIA**\n` +
        `Sistema de economia e níveis.\n\n` +

        `🟢 **AURA IA BOT**\n` +
        `Inteligência artificial integrada.\n\n` +

        `🚀 Novos sistemas serão adicionados ao catálogo.`,

      cor: "#00ffcc"
    },

    {
      canais: ["planos"],

      titulo: "📦 PLANOS DE ASSINATURA",

      descricao:
        `📅 **PLANO MENSAL**\n` +
        `💰 R$ 59,00/mês\n\n` +

        `🌟 **PLANO SEMESTRAL**\n` +
        `💰 R$ 299,00\n\n` +

        `👑 **PLANO ANUAL**\n` +
        `💰 R$ 499,00\n\n` +

        `🎫 Consulte condições e disponibilidade através de ${ticket}.`,

      cor: "#00ffcc"
    },

    {
      canais: ["promocoes", "promoções"],

      titulo: "🔥 PROMOÇÕES AURA BOTS",

      descricao:
        `🔥 **OFERTAS E BENEFÍCIOS ESPECIAIS**\n\n` +
        `As promoções oficiais da Aura Bots Studio serão publicadas neste canal.\n\n` +
        `⚠️ Valores e benefícios podem possuir prazo limitado.\n\n` +
        `🎫 Para consultar uma promoção, abra um ticket.`,

      cor: "#00ffcc"
    },

    {
      canais: ["formas-de-pagamento", "pagamento"],

      titulo: "💳 FORMAS DE PAGAMENTO",

      descricao:
        `⚡ **PIX**\n` +
        `Pagamento rápido e prático.\n\n` +

        `💳 **CARTÃO**\n` +
        `Disponibilidade conforme atendimento.\n\n` +

        `🏦 **OUTRAS FORMAS**\n` +
        `Consulte nossa equipe.\n\n` +

        `🔒 Nunca envie dados sensíveis em canais públicos.\n\n` +

        `🎫 Realize seu atendimento através de ${ticket}.`,

      cor: "#00ffcc"
    },

    {
      canais: ["abrir-ticket", "ticket"],

      titulo: "🎫 CENTRAL DE ATENDIMENTO",

      descricao:
        `Precisa comprar um bot ou falar com nossa equipe?\n\n` +

        `🛒 **COMPRAS**\n` +
        `Solicite orçamento de bots e sistemas.\n\n` +

        `🛠️ **SUPORTE**\n` +
        `Informe detalhadamente seu problema.\n\n` +

        `📸 Envie prints quando necessário.\n` +
        `⏳ Aguarde o atendimento da equipe.\n\n` +

        `👇 **Clique no botão abaixo para abrir seu ticket.**`,

      cor: "#00ffcc",

      ticket: true
    }
  ];
}

// ======================================================================
// VERIFICAR MENSAGEM DO BOT
// ======================================================================

async function mensagemJaExiste(canal, titulo) {
  try {
    const mensagens = await canal.messages.fetch({
      limit: 50
    });

    return mensagens.some(
      (msg) =>
        msg.author.id === client.user.id &&
        msg.embeds.some(
          (embed) => embed.title === titulo
        )
    );
  } catch {
    return false;
  }
}

// ======================================================================
// ENVIAR MENSAGENS
// ======================================================================

async function enviarMensagensOficiais(guild, forcar = false) {
  console.log("");
  console.log("📤 INICIANDO GERADOR DE MENSAGENS...");

  const mensagens = criarMensagensOficiais(guild);

  let enviados = 0;
  let ignorados = 0;
  let erros = 0;

  for (const config of mensagens) {
    const canal = localizarCanal(
      guild,
      config.canais
    );

    if (
      !canal ||
      !canal.isTextBased() ||
      canal.isThread()
    ) {
      console.log(
        `⚠️ Canal não localizado: ${config.canais.join(", ")}`
      );

      ignorados++;
      continue;
    }

    const permissoes = canal.permissionsFor(
      guild.members.me
    );

    if (
      !permissoes?.has(
        PermissionFlagsBits.ViewChannel
      ) ||
      !permissoes?.has(
        PermissionFlagsBits.SendMessages
      ) ||
      !permissoes?.has(
        PermissionFlagsBits.EmbedLinks
      )
    ) {
      console.log(
        `❌ Sem permissão em #${canal.name}`
      );

      erros++;
      continue;
    }

    if (!forcar) {
      const existe = await mensagemJaExiste(
        canal,
        config.titulo
      );

      if (existe) {
        console.log(
          `🟡 Mensagem já existe em #${canal.name}`
        );

        ignorados++;
        continue;
      }
    }

    try {
      const embed = new EmbedBuilder()
        .setTitle(config.titulo)
        .setDescription(config.descricao)
        .setColor(config.cor || "#00ffcc")
        .setFooter({
          text: "Aura Bots Studio • Henrique Dev"
        })
        .setTimestamp();

      if (config.ticket) {
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("abrir_ticket_btn")
              .setLabel("Abrir Ticket")
              .setEmoji("🎫")
              .setStyle(ButtonStyle.Success)
          );

        await canal.send({
          embeds: [embed],
          components: [row]
        });
      } else {
        await canal.send({
          embeds: [embed]
        });
      }

      enviados++;

      console.log(
        `✅ Mensagem publicada em #${canal.name}`
      );
    } catch (error) {
      erros++;

      console.error(
        `❌ Erro em #${canal.name}:`,
        error.message
      );
    }
  }

  return {
    enviados,
    ignorados,
    erros
  };
}

// ======================================================================
// READY
// ======================================================================

client.once("ready", async () => {
  console.log("");
  console.log("====================================================");
  console.log(`🤖 BOT ONLINE: ${client.user.tag}`);
  console.log(`👑 DESENVOLVEDOR: HENRIQUE`);
  console.log(`🆔 DEV ID: ${DEV_ID}`);
  console.log(`⚡ SERVIDORES: ${client.guilds.cache.size}`);
  console.log("====================================================");

  client.user.setPresence({
    activities: [
      {
        name: "Aura Bots Studio • Henrique Dev",
        type: ActivityType.Watching
      }
    ],

    status: "online"
  });

  for (const guild of client.guilds.cache.values()) {
    escanearCanais(guild);

    console.log(
      `🤖 Verificando mensagens em ${guild.name}...`
    );

    const resultado =
      await enviarMensagensOficiais(
        guild,
        false
      );

    console.log("");
    console.log("📊 RESULTADO DA CONFIGURAÇÃO");
    console.log(`✅ Enviadas: ${resultado.enviados}`);
    console.log(`🟡 Ignoradas: ${resultado.ignorados}`);
    console.log(`❌ Erros: ${resultado.erros}`);
  }

  console.log("");
  console.log("🚀 AURA BOT v4.2 TOTALMENTE INICIADO!");
});

// ======================================================================
// NOVO CANAL
// ======================================================================

client.on("channelCreate", async (channel) => {
  if (!channel.guild) return;

  console.log(
    `🆕 Novo canal identificado: ${channel.name}`
  );

  escanearCanais(channel.guild);
});

// ======================================================================
// CANAL DELETADO
// ======================================================================

client.on("channelDelete", async (channel) => {
  if (!channel.guild) return;

  console.log(
    `🗑️ Canal removido: ${channel.name}`
  );

  escanearCanais(channel.guild);
});

// ======================================================================
// CANAL ATUALIZADO
// ======================================================================

client.on(
  "channelUpdate",
  async (oldChannel, newChannel) => {
    if (!newChannel.guild) return;

    if (oldChannel.name !== newChannel.name) {
      console.log(
        `✏️ Canal renomeado: ${oldChannel.name} ➜ ${newChannel.name}`
      );

      escanearCanais(newChannel.guild);
    }
  }
);

// ======================================================================
// BOAS-VINDAS
// ======================================================================

client.on("guildMemberAdd", async (member) => {
  const canal = localizarCanal(
    member.guild,
    ["boas-vindas", "welcome"]
  );

  if (!canal || !canal.isTextBased()) {
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("👋 NOVO MEMBRO!")
    .setDescription(
      `Olá ${member}! ❤️\n\n` +
      `Seja muito bem-vindo(a) ao **${member.guild.name}**!\n\n` +
      `📜 Leia nossas regras.\n` +
      `🛍️ Conheça nossos bots.\n` +
      `🎫 Abra um ticket caso precise de atendimento.\n\n` +
      `🎉 Você é o membro **#${member.guild.memberCount}**!`
    )
    .setColor("#00ffcc")
    .setThumbnail(
      member.user.displayAvatarURL({
        size: 512
      })
    )
    .setFooter({
      text: "Aura Bots Studio"
    })
    .setTimestamp();

  await canal.send({
    content: `👋 Bem-vindo(a), ${member}!`,
    embeds: [embed]
  }).catch(console.error);
});

// ======================================================================
// INTERAÇÕES
// ======================================================================

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // ====================================================================
  // ABRIR TICKET
  // ====================================================================

  if (
    interaction.customId ===
    "abrir_ticket_btn"
  ) {
    await interaction.deferReply({
      ephemeral: true
    });

    const guild = interaction.guild;
    const member = interaction.member;

    const ticketExistente =
      guild.channels.cache.find(
        (ch) =>
          ch.type === ChannelType.GuildText &&
          ch.topic ===
            `AURA_TICKET_USER:${interaction.user.id}`
      );

    if (ticketExistente) {
      return interaction.editReply(
        `❌ Você já possui um ticket aberto em ${ticketExistente}.`
      );
    }

    try {
      let categoria = localizarCanal(
        guild,
        [
          "tickets",
          "atendimentos",
          "suporte"
        ]
      );

      if (
        categoria &&
        categoria.type !==
          ChannelType.GuildCategory
      ) {
        categoria = null;
      }

      const nomeUsuario =
        interaction.user.username
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 20) || "usuario";

      const ticketChannel =
        await guild.channels.create({
          name: `ticket-${nomeUsuario}`,

          type: ChannelType.GuildText,

          parent: categoria?.id || null,

          topic:
            `AURA_TICKET_USER:${interaction.user.id}`,

          permissionOverwrites: [
            {
              id: guild.id,

              deny: [
                PermissionFlagsBits.ViewChannel
              ]
            },

            {
              id: interaction.user.id,

              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks
              ]
            },

            {
              id: client.user.id,

              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageMessages
              ]
            }
          ]
        });

      const embed = new EmbedBuilder()
        .setTitle(
          "🎫 ATENDIMENTO INICIADO"
        )
        .setDescription(
          `Olá ${interaction.user}! 👋\n\n` +
          `Bem-vindo ao atendimento da **Aura Bots Studio**.\n\n` +
          `📌 Informe o bot ou sistema desejado.\n` +
          `🛠️ Caso seja suporte, explique detalhadamente o problema.\n` +
          `📸 Envie prints caso necessário.\n\n` +
          `⏳ Aguarde nossa equipe responder.\n\n` +
          `🆔 Cliente: \`${interaction.user.id}\``
        )
        .setColor("#00ffcc")
        .setThumbnail(
          interaction.user.displayAvatarURL({
            size: 512
          })
        )
        .setFooter({
          text: "Aura Bots Studio • Atendimento"
        })
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("fechar_ticket_btn")
            .setLabel("Fechar Ticket")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Danger)
        );

      await ticketChannel.send({
        content: `${interaction.user}`,
        embeds: [embed],
        components: [row]
      });

      await interaction.editReply(
        `✅ Seu ticket foi criado: ${ticketChannel}`
      );
    } catch (error) {
      console.error(
        "❌ ERRO AO CRIAR TICKET:",
        error
      );

      await interaction.editReply(
        "❌ Não foi possível criar seu ticket. Verifique as permissões do bot."
      );
    }

    return;
  }

  // ====================================================================
  // FECHAR TICKET
  // ====================================================================

  if (
    interaction.customId ===
    "fechar_ticket_btn"
  ) {
    const topico = interaction.channel.topic;

    if (
      !topico?.startsWith(
        "AURA_TICKET_USER:"
      )
    ) {
      return interaction.reply({
        content:
          "❌ Este canal não foi identificado como ticket.",
        ephemeral: true
      });
    }

    const donoTicket = topico.replace(
      "AURA_TICKET_USER:",
      ""
    );

    const podeFechar =
      interaction.user.id === donoTicket ||
      interaction.user.id === DEV_ID ||
      interaction.member.permissions.has(
        PermissionFlagsBits.ManageChannels
      );

    if (!podeFechar) {
      return interaction.reply({
        content:
          "❌ Você não possui permissão para fechar este ticket.",
        ephemeral: true
      });
    }

    await interaction.reply(
      "🔒 **Ticket encerrado!**\n\nEste canal será deletado em **5 segundos**."
    );

    setTimeout(async () => {
      await interaction.channel
        .delete()
        .catch(console.error);
    }, 5000);

    return;
  }
});

// ======================================================================
// COMANDOS
// ======================================================================

client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild
  ) {
    return;
  }

  // ====================================================================
  // MENÇÃO
  // ====================================================================

  if (
    message.mentions.has(client.user) &&
    !message.reference
  ) {
    return message.reply(
      `⚡ Olá! Meu prefixo é \`${PREFIX}\`.\n` +
      `Digite \`${PREFIX}ajuda\` para visualizar meus comandos.`
    );
  }

  if (
    !message.content.startsWith(PREFIX)
  ) {
    return;
  }

  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/);

  const command = args
    .shift()
    ?.toLowerCase();

  if (!command) return;

  // ====================================================================
  // CONFIGURAR
  // ====================================================================

  if (
    command === "configurar" ||
    command === "gerarmensagens"
  ) {
    if (message.author.id !== DEV_ID) {
      return message.reply(
        "❌ Apenas Henrique pode utilizar este comando."
      );
    }

    const aviso = await message.reply(
      "⚡ Escaneando canais e configurando o servidor..."
    );

    escanearCanais(message.guild);

    const resultado =
      await enviarMensagensOficiais(
        message.guild,
        false
      );

    return aviso.edit(
      `✨ **CONFIGURAÇÃO FINALIZADA!**\n\n` +
      `🔍 Canais identificados: **${message.guild.channels.cache.size}**\n` +
      `✅ Mensagens enviadas: **${resultado.enviados}**\n` +
      `🟡 Mensagens existentes: **${resultado.ignorados}**\n` +
      `❌ Erros: **${resultado.erros}**`
    );
  }

  // ====================================================================
  // FORÇAR MENSAGENS
  // ====================================================================

  if (command === "forcarmensagens") {
    if (message.author.id !== DEV_ID) {
      return message.reply(
        "❌ Comando exclusivo do desenvolvedor."
      );
    }

    const aviso = await message.reply(
      "🚀 Forçando envio das mensagens..."
    );

    const resultado =
      await enviarMensagensOficiais(
        message.guild,
        true
      );

    return aviso.edit(
      `🚀 **ENVIO FORÇADO FINALIZADO**\n\n` +
      `✅ Enviadas: **${resultado.enviados}**\n` +
      `🟡 Ignoradas: **${resultado.ignorados}**\n` +
      `❌ Erros: **${resultado.erros}**`
    );
  }

  // ====================================================================
  // CANAIS
  // ====================================================================

  if (
    command === "canais" ||
    command === "ids"
  ) {
    if (message.author.id !== DEV_ID) {
      return message.reply(
        "❌ Apenas Henrique pode visualizar os IDs."
      );
    }

    escanearCanais(message.guild);

    const canais = [
      ...message.guild.channels.cache.values()
    ].sort(
      (a, b) =>
        a.rawPosition - b.rawPosition
    );

    let partes = [];
    let texto =
      "📌 **CANAIS IDENTIFICADOS**\n\n";

    for (const canal of canais) {
      let linha = "";

      if (
        canal.type ===
        ChannelType.GuildCategory
      ) {
        linha =
          `\n📁 **${canal.name}**\n` +
          `🆔 \`${canal.id}\`\n`;
      } else if (
        canal.type ===
        ChannelType.GuildText
      ) {
        linha =
          `💬 #${canal.name} ➜ \`${canal.id}\`\n`;
      } else if (
        canal.type ===
        ChannelType.GuildVoice
      ) {
        linha =
          `🔊 ${canal.name} ➜ \`${canal.id}\`\n`;
      }

      if (
        texto.length + linha.length > 1900
      ) {
        partes.push(texto);

        texto = linha;
      } else {
        texto += linha;
      }
    }

    if (texto.length > 0) {
      partes.push(texto);
    }

    for (const parte of partes) {
      await message.channel.send(parte);
    }

    return;
  }

  // ====================================================================
  // DEV
  // ====================================================================

  if (command === "dev") {
    if (message.author.id !== DEV_ID) {
      return message.reply(
        "❌ Acesso negado."
      );
    }

    const embed = new EmbedBuilder()
      .setTitle(
        "👑 CONTROLE DO DESENVOLVEDOR"
      )
      .setDescription(
        `Olá **Henrique**! 🚀\n\n` +
        `Seu ID foi reconhecido pelo sistema.\n\n` +
        `🆔 \`${DEV_ID}\`\n` +
        `🤖 ${client.user.tag}\n` +
        `🏓 ${client.ws.ping}ms`
      )
      .setColor("#3498db")
      .setFooter({
        text: "Aura Bots Studio"
      })
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }

  // ====================================================================
  // AJUDA
  // ====================================================================

  if (command === "ajuda") {
    const embed = new EmbedBuilder()
      .setTitle(
        "⚙️ CENTRAL DE AJUDA — AURA BOT v4.2"
      )
      .addFields(
        {
          name: `🏓 ${PREFIX}ping`,
          value: "Ver latência do bot.",
          inline: true
        },

        {
          name: `🧹 ${PREFIX}limpar 10`,
          value: "Limpar mensagens.",
          inline: true
        },

        {
          name: `ℹ️ ${PREFIX}botinfo`,
          value: "Informações do bot.",
          inline: true
        },

        {
          name: `🔍 ${PREFIX}canais`,
          value: "Mostrar IDs dos canais.",
          inline: true
        },

        {
          name: `⚙️ ${PREFIX}configurar`,
          value: "Configurar mensagens.",
          inline: true
        },

        {
          name: `🚀 ${PREFIX}forcarmensagens`,
          value: "Forçar publicação.",
          inline: true
        }
      )
      .setColor("#00ffcc")
      .setFooter({
        text:
          "Aura Bots Studio • Desenvolvido por Henrique"
      })
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }

  // ====================================================================
  // PING
  // ====================================================================

  if (command === "ping") {
    const sent = await message.reply(
      "🏓 Calculando latência..."
    );

    const latency =
      sent.createdTimestamp -
      message.createdTimestamp;

    return sent.edit(
      `🏓 **Pong!**\n\n` +
      `🤖 Bot: \`${latency}ms\`\n` +
      `🌐 Discord API: \`${client.ws.ping}ms\``
    );
  }

  // ====================================================================
  // LIMPAR
  // ====================================================================

  if (
    command === "limpar" ||
    command === "clear"
  ) {
    if (
      !message.member.permissions.has(
        PermissionFlagsBits.ManageMessages
      )
    ) {
      return message.reply(
        "❌ Você não possui permissão para gerenciar mensagens."
      );
    }

    const quantidade = parseInt(args[0]);

    if (
      isNaN(quantidade) ||
      quantidade < 1 ||
      quantidade > 100
    ) {
      return message.reply(
        "❌ Informe um número entre 1 e 100."
      );
    }

    try {
      const apagadas =
        await message.channel.bulkDelete(
          quantidade,
          true
        );

      const aviso =
        await message.channel.send(
          `🧹 Foram apagadas **${apagadas.size} mensagens**.`
        );

      setTimeout(() => {
        aviso.delete().catch(() => {});
      }, 4000);
    } catch (error) {
      console.error(error);

      return message.reply(
        "❌ Não foi possível limpar as mensagens."
      );
    }

    return;
  }

  // ====================================================================
  // BOT INFO
  // ====================================================================

  if (command === "botinfo") {
    const embed = new EmbedBuilder()
      .setTitle(
        "ℹ️ INFORMAÇÕES DO AURA BOT"
      )
      .setColor("#9b59b6")
      .addFields(
        {
          name: "👑 Criador",
          value: "Henrique",
          inline: true
        },

        {
          name: "🤖 Versão",
          value: "v4.2",
          inline: true
        },

        {
          name: "📚 Biblioteca",
          value: "Discord.js v14",
          inline: true
        },

        {
          name: "⚡ Servidores",
          value: `${client.guilds.cache.size}`,
          inline: true
        },

        {
          name: "🏓 Ping",
          value: `${client.ws.ping}ms`,
          inline: true
        },

        {
          name: "🟢 Status",
          value: "100% Operacional",
          inline: true
        }
      )
      .setFooter({
        text: "Aura Bots Studio"
      })
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
});

// ======================================================================
// ERROS
// ======================================================================

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "❌ UNHANDLED REJECTION:",
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "❌ UNCAUGHT EXCEPTION:",
      error
    );
  }
);

// ======================================================================
// LOGIN
// ======================================================================

```js
client.login(TOKEN);
