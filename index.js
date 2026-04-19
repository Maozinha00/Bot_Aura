import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  StringSelectMenuBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

// ==========================
// 🏢 CONFIG EMPRESA
// ==========================
const CONFIG = {
  serverId: "1495178024759332914",
  welcomeChannel: "1495275678533288068",
  staffRole: "1495178024797208588",
  autoRole: "1495178024759332917"
};

// ==========================
// 💰 CATÁLOGO COM PREÇOS
// ==========================
const PRODUCTS = {
  basic: {
    name: "🤖 Bot Básico",
    price: "R$ 15",
    desc: "Comandos simples + estrutura leve"
  },
  pro: {
    name: "💎 Bot Personalizado",
    price: "R$ 50",
    desc: "Sistema completo sob medida"
  },
  enterprise: {
    name: "⚙️ Sistema Enterprise",
    price: "R$ 120",
    desc: "Automação avançada + recursos premium"
  }
};

// ==========================
// 🤖 CLIENT
// ==========================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ==========================
// 📌 COMANDOS
// ==========================
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("🏢 Abrir catálogo da empresa")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        CONFIG.serverId
      ),
      { body: commands }
    );

    console.log("🏢 BOT EMPRESA ONLINE");
  } catch (err) {
    console.log(err);
  }
})();

// ==========================
// 🚀 ONLINE
// ==========================
client.once("ready", () => {
  console.log(`🏢 AURA BOTS STUDIO ONLINE: ${client.user.tag}`);
});

// ==========================
// 👋 BOAS-VINDAS
// ==========================
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== CONFIG.serverId) return;

  try {
    await member.roles.add(CONFIG.autoRole).catch(() => {});

    const channel = await member.guild.channels.fetch(CONFIG.welcomeChannel).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🏢 AURA BOTS STUDIO | EMPRESA OFICIAL")
      .setDescription(
`👋 Bem-vindo ${member.user}

💼 Você entrou na **AURA BOTS STUDIO**

Somos especialistas em:

🤖 Desenvolvimento de Bots Discord  
⚙️ Sistemas automatizados  
🚀 Soluções profissionais para servidores RP  

📦 Use /painel para acessar o catálogo`
      );

    await channel.send({ embeds: [embed] });
  } catch {}
});

// ==========================
// 🎛️ INTERAÇÕES
// ==========================
client.on("interactionCreate", async (interaction) => {

  if (!interaction.guild) return;

  // ======================
  // /PAINEL
  // ======================
  if (interaction.isChatInputCommand() && interaction.commandName === "painel") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ Apenas equipe da empresa", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🏢 AURA BOTS STUDIO - CATÁLOGO OFICIAL")
      .setDescription(
`╔══════════════════════════════╗
💎 AURA BOTS STUDIO - ELITE STORE
╚══════════════════════════════╝

🚀 AUTOMAÇÃO PROFISSIONAL PARA SERVIDORES

📦 CATÁLOGO DE SERVIÇOS:

🤖 ${PRODUCTS.basic.name}
💰 ${PRODUCTS.basic.price}
📝 ${PRODUCTS.basic.desc}

───────────────────────────────

💎 ${PRODUCTS.pro.name}
💰 ${PRODUCTS.pro.price}
📝 ${PRODUCTS.pro.desc}

───────────────────────────────

⚙️ ${PRODUCTS.enterprise.name}
💰 ${PRODUCTS.enterprise.price}
📝 ${PRODUCTS.enterprise.desc}

═══════════════════════════════
🎫 Clique abaixo para solicitar
🔥 Atendimento premium e rápido
═══════════════════════════════`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("📦 Abrir Pedido")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });

    return interaction.reply({ content: "✅ catálogo enviado", ephemeral: true });
  }

  // ======================
  // 🎫 TICKET
  // ======================
  if (interaction.isButton() && interaction.customId === "open_ticket") {

    const channel = await interaction.guild.channels.create({
      name: `pedido-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        },
        {
          id: CONFIG.staffRole,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🏢 PEDIDO EMPRESA")
      .setDescription("Selecione o serviço desejado:");

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Selecionar serviço")
        .addOptions([
          {
            label: `${PRODUCTS.basic.name} - ${PRODUCTS.basic.price}`,
            value: "basic"
          },
          {
            label: `${PRODUCTS.pro.name} - ${PRODUCTS.pro.price}`,
            value: "pro"
          },
          {
            label: `${PRODUCTS.enterprise.name} - ${PRODUCTS.enterprise.price}`,
            value: "enterprise"
          }
        ])
    );

    const close = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close")
        .setLabel("🔒 Encerrar")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [menu, close] });

    return interaction.reply({ content: `📦 pedido criado`, ephemeral: true });
  }

  // ======================
  // MENU
  // ======================
  if (interaction.isStringSelectMenu()) {

    const v = interaction.values[0];

    const msg =
      v === "basic"
        ? `🤖 ${PRODUCTS.basic.name} - ${PRODUCTS.basic.price}`
        : v === "pro"
        ? `💎 ${PRODUCTS.pro.name} - ${PRODUCTS.pro.price}`
        : `⚙️ ${PRODUCTS.enterprise.name} - ${PRODUCTS.enterprise.price}`;

    return interaction.reply({ content: msg, ephemeral: true });
  }

  // ======================
  // FECHAR
  // ======================
  if (interaction.isButton() && interaction.customId === "close") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ apenas equipe", ephemeral: true });
    }

    await interaction.reply("🔒 encerrando pedido...");
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }
});

// ==========================
// LOGIN
// ==========================
client.login(process.env.TOKEN);
