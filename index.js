// ============================================================
// AURA BOT STUDIO v4.1
// Desenvolvido por Henrique
// Sistema automático de canais, IDs e mensagens
// ============================================================

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType,
  PermissionFlagsBits,
  ChannelType
} = require("discord.js");

const fs = require("fs");
require("dotenv").config();

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const DEV_ID = "1174745079630549014";

const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX || "!";

if (!TOKEN) {
  console.error("❌ ERRO: TOKEN não configurado no arquivo .env");
  process.exit(1);
}

// ============================================================
// CLIENT
// ============================================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ============================================================
// CONFIGURAÇÃO DAS MENSAGENS AUTOMÁTICAS
// ============================================================

const mensagensAutomaticas = {
  "regras": {
    titulo: "📜 REGRAS DO SERVIDOR",
    descricao:
      "Seja bem-vindo(a) ao nosso servidor!\n\n" +
      "📌 Respeite todos os membros.\n" +
      "📌 Não envie spam.\n" +
      "📌 Não divulgue outros servidores.\n" +
      "📌 Não utilize conteúdo ofensivo.\n" +
      "📌 Respeite a equipe administrativa.\n\n" +
      "⚠️ O desconhecimento das regras não impede punições.",
    cor: "#ff0000"
  },

  "boas-vindas": {
    titulo: "👋 BEM-VINDO(A)",
    descricao:
      "Seja muito bem-vindo(a) à nossa comunidade! ❤️\n\n" +
      "📜 Leia nossas regras.\n" +
      "🎫 Abra um ticket caso precise de suporte.\n" +
      "🤖 Conheça nossos bots e sistemas.\n\n" +
      "Esperamos que você aproveite o servidor!",
    cor: "#00ffcc"
  },

  "anuncios": {
    titulo: "📢 CENTRAL DE ANÚNCIOS",
    descricao:
      "Este canal é destinado aos anúncios oficiais.\n\n" +
      "🔔 Ative as notificações para não perder nenhuma novidade!",
    cor: "#ffaa00"
  },

  "suporte": {
    titulo: "🎫 CENTRAL DE SUPORTE",
    descricao:
      "Precisa de ajuda?\n\n" +
      "Entre em contato com nossa equipe de suporte.\n\n" +
      "📌 Explique seu problema corretamente.\n" +
      "📸 Envie provas ou prints quando necessário.\n" +
      "⏳ Aguarde o atendimento da equipe.",
    cor: "#3498db"
  },

  "comandos": {
    titulo: "🤖 COMANDOS DO AURA BOT",
    descricao:
      `Utilize os comandos abaixo:\n\n` +
      `🏓 \`${PREFIX}ping\` — Ver latência\n` +
      `👑 \`${PREFIX}dev\` — Informações do desenvolvedor\n` +
      `⚙️ \`${PREFIX}ajuda\` — Central de ajuda\n` +
      `🧹 \`${PREFIX}limpar 10\` — Limpar mensagens\n` +
      `ℹ️ \`${PREFIX}botinfo\` — Informações do bot\n` +
      `🆔 \`${PREFIX}canais\` — Mostrar canais e IDs\n` +
      `🔄 \`${PREFIX}configurar\` — Configurar servidor`,
    cor: "#9b59b6"
  }
};

// ============================================================
// NORMALIZAR NOME DO CANAL
// ============================================================

function normalizarNome(nome) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w-]/g, "");
}

// ============================================================
// IDENTIFICAR TIPO DE CANAL
// ============================================================

function identificarCanal(nome) {
  const canal = normalizarNome(nome);

  if (
    canal.includes("regras") ||
    canal.includes("regra")
  ) {
    return "regras";
  }

  if (
    canal.includes("boas-vindas") ||
    canal.includes("boasvindas") ||
    canal.includes("welcome")
  ) {
    return "boas-vindas";
  }

  if (
    canal.includes("anuncios") ||
    canal.includes("anuncio") ||
    canal.includes("novidades")
  ) {
    return "anuncios";
  }

  if (
    canal.includes("suporte") ||
    canal.includes("ticket") ||
    canal.includes("ajuda")
  ) {
    return "suporte";
  }

  if (
    canal.includes("comandos") ||
    canal.includes("bot-comandos")
  ) {
    return "comandos";
  }

  return null;
}

// ============================================================
// SALVAR IDS DOS CANAIS
// ============================================================

async function salvarCanais(guild) {
  const dados = {
    servidor: {
      nome: guild.name,
      id: guild.id
    },

    categorias: {},

    canais: {}
  };

  const canais = guild.channels.cache.sort(
    (a, b) => a.rawPosition - b.rawPosition
  );

  canais.forEach((canal) => {
    if (canal.type === ChannelType.GuildCategory) {
      dados.categorias[canal.name] = canal.id;
    } else {
      dados.canais[canal.name] = {
        id: canal.id,
        tipo: canal.type,
        categoria: canal.parent?.name || "SEM CATEGORIA",
        categoriaId: canal.parentId || null
      };
    }
  });

  fs.writeFileSync(
    "./canais.json",
    JSON.stringify(dados, null, 2)
  );

  console.log("💾 IDs dos canais salvos em canais.json");
}

// ============================================================
// MOSTRAR CANAIS NO CONSOLE
// ============================================================

function mostrarCanais(guild) {
  console.log("");
  console.log("================================================");
  console.log(`🏠 SERVIDOR: ${guild.name}`);
  console.log(`🆔 ID: ${guild.id}`);
  console.log("================================================");

  const categorias = guild.channels.cache
    .filter(
      canal => canal.type === ChannelType.GuildCategory
    )
    .sort(
      (a, b) => a.rawPosition - b.rawPosition
    );

  categorias.forEach((categoria) => {
    console.log("");
    console.log(`📁 ${categoria.name}`);
    console.log(`🆔 ${categoria.id}`);

    const canais = guild.channels.cache
      .filter(
        canal => canal.parentId === categoria.id
      )
      .sort(
        (a, b) => a.rawPosition - b.rawPosition
      );

    canais.forEach((canal) => {
      console.log(`   ├─ #${canal.name}`);
      console.log(`   │  ID: ${canal.id}`);
    });
  });

  console.log("");
  console.log("================================================");
}

// ============================================================
// VERIFICAR SE O BOT JÁ ENVIOU A MENSAGEM
// ============================================================

async function botJaEnviouMensagem(canal, titulo) {
  try {
    const mensagens = await canal.messages.fetch({
      limit: 50
    });

    return mensagens.some(
      mensagem =>
        mensagem.author.id === client.user.id &&
        mensagem.embeds.length > 0 &&
        mensagem.embeds[0]?.title === titulo
    );
  } catch (error) {
    console.log(
      `⚠️ Não foi possível verificar #${canal.name}`
    );

    return true;
  }
}

// ============================================================
// GERAR MENSAGENS AUTOMÁTICAS
// ============================================================

async function gerarMensagens(guild) {
  console.log("");
  console.log("🤖 ANALISANDO CANAIS...");
  console.log("");

  const canais = guild.channels.cache.filter(
    canal => canal.type === ChannelType.GuildText
  );

  for (const canal of canais.values()) {
    const tipo = identificarCanal(canal.name);

    if (!tipo) {
      console.log(
        `⚪ Canal ignorado: #${canal.name}`
      );

      continue;
    }

    const config = mensagensAutomaticas[tipo];

    const permissao = canal
      .permissionsFor(guild.members.me);

    if (
      !permissao ||
      !permissao.has(
        PermissionFlagsBits.SendMessages
      )
    ) {
      console.log(
        `❌ Sem permissão em #${canal.name}`
      );

      continue;
    }

    const jaExiste = await botJaEnviouMensagem(
      canal,
      config.titulo
    );

    if (jaExiste) {
      console.log(
        `🟡 Mensagem já existe: #${canal.name}`
      );

      continue;
    }

    const embed = new EmbedBuilder()
      .setTitle(config.titulo)
      .setDescription(config.descricao)
      .setColor(config.cor)
      .setFooter({
        text: "Aura Bots Studio • Henrique Dev"
      })
      .setTimestamp();

    try {
      await canal.send({
        embeds: [embed]
      });

      console.log(
        `✅ Mensagem enviada: #${canal.name}`
      );
    } catch (error) {
      console.error(
        `❌ Erro no canal #${canal.name}`,
        error
      );
    }
  }
}

// ============================================================
// BOT ONLINE
// ============================================================

client.once("ready", async () => {
  console.log("");
  console.log("========================================");
  console.log(
    `🤖 BOT ONLINE: ${client.user.tag}`
  );
  console.log(
    `👑 DONO OFICIAL: HENRIQUE`
  );
  console.log(
    `🆔 DEV ID: ${DEV_ID}`
  );
  console.log(
    `⚡ SERVIDORES: ${client.guilds.cache.size}`
  );
  console.log("========================================");

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
    mostrarCanais(guild);

    await salvarCanais(guild);

    await gerarMensagens(guild);
  }

  console.log("");
  console.log("🚀 CONFIGURAÇÃO AUTOMÁTICA FINALIZADA!");
});

// ============================================================
// BOAS-VINDAS
// ============================================================

client.on("guildMemberAdd", async (member) => {
  const canal = member.guild.channels.cache.find(
    ch =>
      ch.type === ChannelType.GuildText &&
      identificarCanal(ch.name) === "boas-vindas"
  );

  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle("👋 NOVO MEMBRO!")
    .setDescription(
      `Olá ${member}! ❤️\n\n` +
      `Seja muito bem-vindo(a) ao **${member.guild.name}**!\n\n` +
      `📜 Leia as regras do servidor.\n` +
      `🎫 Utilize nosso suporte caso precise.\n\n` +
      `Você é o membro **#${member.guild.memberCount}**!`
    )
    .setColor("#00ffcc")
    .setThumbnail(
      member.user.displayAvatarURL({
        dynamic: true
      })
    )
    .setFooter({
      text: "Aura Bots Studio"
    })
    .setTimestamp();

  await canal.send({
    content: `👋 Bem-vindo(a) ${member}!`,
    embeds: [embed]
  });
});

// ============================================================
// COMANDOS
// ============================================================

client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild
  ) {
    return;
  }

  // ========================================================
  // MENÇÃO AO BOT
  // ========================================================

  if (
    message.mentions.has(client.user) &&
    !message.reference
  ) {
    return message.reply(
      `⚡ Olá! Meu prefixo é \`${PREFIX}\`\n` +
      `Use \`${PREFIX}ajuda\` para ver meus comandos.`
    );
  }

  if (!message.content.startsWith(PREFIX)) {
    return;
  }

  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/);

  const command = args
    .shift()
    ?.toLowerCase();

  // ========================================================
  // DEV
  // ========================================================

  if (command === "dev") {
    if (message.author.id !== DEV_ID) {
      return message.reply(
        "❌ Apenas Henrique pode utilizar este comando."
      );
    }

    const embed = new EmbedBuilder()
      .setTitle(
        "👑 CONTROLE DO DESENVOLVEDOR"
      )
      .setDescription(
        `Olá **Henrique**!\n\n` +
        `Seu ID foi reconhecido pelo Aura Bot.\n\n` +
        `🆔 ID: \`${DEV_ID}\`\n` +
        `🏓 Ping: \`${client.ws.ping}ms\`\n` +
        `🤖 Bot: ${client.user.tag}`
      )
      .setColor("#3498db")
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }

  // ========================================================
  // AJUDA
  // ========================================================

  if (command === "ajuda") {
    const embed = new EmbedBuilder()
      .setTitle(
        "⚙️ CENTRAL DE AJUDA - AURA BOT v4.1"
      )
      .setDescription(
        `🏓 \`${PREFIX}ping\`\n` +
        `👑 \`${PREFIX}dev\`\n` +
        `🧹 \`${PREFIX}limpar 10\`\n` +
        `ℹ️ \`${PREFIX}botinfo\`\n` +
        `🆔 \`${PREFIX}canais\`\n` +
        `🔄 \`${PREFIX}configurar\``
      )
      .setColor("#00ffcc")
      .setFooter({
        text: "Aura Bots Studio • Henrique"
      })
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }

  // ========================================================
  // PING
  // ========================================================

  if (command === "ping") {
    const sent = await message.reply(
      "🏓 Calculando latência..."
    );

    const latencia =
      sent.createdTimestamp -
      message.createdTimestamp;

    return sent.edit(
      `🏓 **Pong!**\n\n` +
      `🤖 Bot: \`${latencia}ms\`\n` +
      `🌐 API Discord: \`${client.ws.ping}ms\``
    );
  }

  // ========================================================
  // LIMPAR
  // ========================================================

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
      const mensagens =
        await message.channel.bulkDelete(
          quantidade,
          true
        );

      const aviso = await message.channel.send(
        `🧹 Foram apagadas **${mensagens.size} mensagens**.`
      );

      setTimeout(() => {
        aviso.delete().catch(() => {});
      }, 4000);
    } catch (error) {
      console.error(error);

      return message.reply(
        "❌ Erro ao limpar mensagens."
      );
    }
  }

  // ========================================================
  // BOT INFO
  // ========================================================

  if (command === "botinfo") {
    const embed = new EmbedBuilder()
      .setTitle(
        "ℹ️ INFORMAÇÕES DO AURA BOT"
      )
      .addFields(
        {
          name: "👑 Criador",
          value: "Henrique",
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
          name: "🤖 Versão",
          value: "Aura Bot v4.1",
          inline: true
        },
        {
          name: "🟢 Status",
          value: "Operacional",
          inline: true
        }
      )
      .setColor("#9b59b6")
      .setFooter({
        text: "Aura Bots Studio"
      })
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }

  // ========================================================
  // LISTAR CANAIS
  // ========================================================

  if (command === "canais") {
    if (message.author.id !== DEV_ID) {
      return message.reply(
        "❌ Comando exclusivo do desenvolvedor."
      );
    }

    let texto = "";

    const canais = message.guild.channels.cache
      .sort(
        (a, b) =>
          a.rawPosition - b.rawPosition
      );

    canais.forEach((canal) => {
      if (
        canal.type === ChannelType.GuildCategory
      ) {
        texto += `\n📁 **${canal.name}**\n`;
        texto += `🆔 \`${canal.id}\`\n`;
      }

      if (
        canal.type === ChannelType.GuildText
      ) {
        texto += `├─ #${canal.name}\n`;
        texto += `└ ID: \`${canal.id}\`\n`;
      }
    });

    if (texto.length > 1900) {
      texto = texto.slice(0, 1900);
    }

    return message.reply({
      content: texto
    });
  }

  // ========================================================
  // CONFIGURAR
  // ========================================================

  if (command === "configurar") {
    if (message.author.id !== DEV_ID) {
      return message.reply(
        "❌ Apenas Henrique pode configurar o bot."
      );
    }

    const aviso = await message.reply(
      "🔄 Analisando servidor e configurando canais..."
    );

    await salvarCanais(message.guild);

    mostrarCanais(message.guild);

    await gerarMensagens(message.guild);

    return aviso.edit(
      "✅ **CONFIGURAÇÃO FINALIZADA!**\n\n" +
      "🆔 IDs identificados\n" +
      "💾 canais.json atualizado\n" +
      "🤖 Canais analisados\n" +
      "📨 Mensagens configuradas"
    );
  }
});

// ============================================================
// TRATAMENTO DE ERROS
// ============================================================

process.on("unhandledRejection", (error) => {
  console.error(
    "❌ ERRO NÃO TRATADO:",
    error
  );
});

process.on("uncaughtException", (error) => {
  console.error(
    "❌ ERRO CRÍTICO:",
    error
  );
});

// ============================================================
// LOGIN
// ============================================================

client.login(TOKEN);
