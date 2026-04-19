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
// ⚙️ CONFIG ELITE
// ==========================
const CONFIG = {
  serverId: "1495178024759332914",
  welcomeChannel: "1495275678533288068",
  staffRole: "1495178024797208588",
  autoRole: "1495178024759332917"
};

// 💎 PLANOS ELITE
const PLANS = {
  basic: "R$ 15",
  pro: "R$ 50",
  elite: "R$ 120"
};

// 🚀 CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ==========================
// 📌 SLASH COMMANDS
// ==========================
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("💎 Enviar painel elite"),
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("⚙️ Criar painel fixo")
].map(c => c.toJSON());

// ==========================
// 🔥 REGISTRO GUILD
// ==========================
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

    console.log("💎 BOT ELITE ONLINE");
  } catch (err) {
    console.log("❌ erro comandos:", err);
  }
})();

// ==========================
// 🚀 READY
// ==========================
client.once("ready", () => {
  console.log(`💎 ELITE ONLINE: ${client.user.tag}`);
});

// ==========================
// 👋 BOAS-VINDAS ELITE
// ==========================
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== CONFIG.serverId) return;

  try {
    await member.roles.add(CONFIG.autoRole).catch(() => {});

    const channel = await member.guild.channels.fetch(CONFIG.welcomeChannel).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("💎 AURA BOTS STUDIO | ELITE")
      .setDescription(
`👋 Olá ${member.user}

💎 Bem-vindo à experiência **ELITE**

🤖 Bots profissionais sob medida  
⚙️ Sistemas automatizados avançados  
🚀 Suporte premium  

📦 Use /painel para começar`
      );

    channel.send({ embeds: [embed] }).catch(() => {});
  } catch {}
});

// ==========================
// 🎛️ INTERAÇÕES
// ==========================
client.on("interactionCreate", async (interaction) => {

  if (!interaction.guild) return;

  // ======================
  // /SETUP
  // ======================
  if (interaction.isChatInputCommand() && interaction.commandName === "setup") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ Apenas staff", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("💎 PAINEL ELITE")
      .setDescription("Clique para abrir atendimento");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("🎫 Abrir Atendimento")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });

    return interaction.reply({ content: "✅ painel criado", ephemeral: true });
  }

  // ======================
  // /PAINEL
  // ======================
  if (interaction.isChatInputCommand() && interaction.commandName === "painel") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ Apenas staff", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("💎 AURA ELITE PANEL")
      .setDescription("Abra seu pedido abaixo");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("🎫 Abrir Pedido")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });

    return interaction.reply({ content: "✅ enviado", ephemeral: true });
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
      .setTitle("💎 ATENDIMENTO ELITE")
      .setDescription("Selecione o plano desejado");

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("plans")
        .setPlaceholder("Escolha seu plano")
        .addOptions([
          { label: `🤖 Básico - ${PLANS.basic}`, value: "basic" },
          { label: `💎 Pro - ${PLANS.pro}`, value: "pro" },
          { label: `⚙️ Elite - ${PLANS.elite}`, value: "elite" }
        ])
    );

    const close = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close")
        .setLabel("🔒 Fechar")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [menu, close] });

    return interaction.reply({ content: `✅ criado: ${channel}`, ephemeral: true });
  }

  // ======================
  // MENU
  // ======================
  if (interaction.isStringSelectMenu()) {

    const v = interaction.values[0];

    const msg =
      v === "basic"
        ? `🤖 Plano Básico - ${PLANS.basic}`
        : v === "pro"
        ? `💎 Plano Pro - ${PLANS.pro}`
        : `⚙️ Plano Elite - ${PLANS.elite}`;

    return interaction.reply({ content: msg, ephemeral: true });
  }

  // ======================
  // FECHAR
  // ======================
  if (interaction.isButton() && interaction.customId === "close") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ apenas staff", ephemeral: true });
    }

    await interaction.reply("🔒 encerrando...");
    setTimeout(() => interaction.channel.delete().catch(() => {}), 2500);
  }
});

// ==========================
// LOGIN
// ==========================
client.login(process.env.TOKEN);
