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

// 🚀 CLIENT PREMIUM
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// 🔑 CONFIG
const CONFIG = {
  serverId: "1495178024759332914",
  welcomeChannel: "1495275678533288068",
  staffRole: "1495178024797208588",
  autoRole: "1495178024759332917"
};

// 💰 PREÇOS
const PRICE = {
  simple: "R$ 15",
  premium: "R$ 50",
  system: "R$ 120"
};

// ==========================
// 📌 SLASH COMMANDS
// ==========================
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("📦 Enviar painel de pedidos premium")
].map(c => c.toJSON());

// ==========================
// 🔥 REGISTRO GUILD (INSTANT)
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

    console.log("💎 Comandos registrados (PREMIUM MODE)");
  } catch (err) {
    console.log("❌ erro comandos:", err);
  }
})();

// ==========================
// 🚀 READY (CORRIGIDO)
// ==========================
client.once("ready", () => {
  console.log(`💎 AURA BOTS ONLINE: ${client.user.tag}`);
});

// ==========================
// 👋 BOAS-VINDAS PREMIUM
// ==========================
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== CONFIG.serverId) return;

  try {
    await member.roles.add(CONFIG.autoRole).catch(() => {});

    const channel = await member.guild.channels.fetch(CONFIG.welcomeChannel).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("💎 Bem-vindo à Aura Bots Studio")
      .setDescription(
`👋 Olá ${member.user}

💎 **AURA BOTS STUDIO - PREMIUM STORE**

🤖 Bots simples e leves  
💎 Bots personalizados avançados  
⚙️ Sistemas automatizados completos  

🚀 Use /painel para iniciar seu pedido`
      )
      .setThumbnail(member.user.displayAvatarURL());

    await channel.send({ embeds: [embed] }).catch(() => {});
  } catch (err) {
    console.log(err);
  }
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
      return interaction.reply({ content: "❌ Apenas staff pode usar.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("💎 PAINEL PREMIUM")
      .setDescription("Clique abaixo para abrir seu pedido");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket")
        .setLabel("🎫 Abrir Pedido")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });

    return interaction.reply({ content: "✅ painel enviado", ephemeral: true });
  }

  // ======================
  // TICKET
  // ======================
  if (interaction.isButton() && interaction.customId === "ticket") {

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
      .setTitle("💎 PEDIDO PREMIUM ABERTO")
      .setDescription("Escolha o produto desejado:");

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Selecionar produto")
        .addOptions([
          { label: `🤖 Bot Simples - ${PRICE.simple}`, value: "simple" },
          { label: `💎 Bot Premium - ${PRICE.premium}`, value: "premium" },
          { label: `⚙️ Sistema Completo - ${PRICE.system}`, value: "system" }
        ])
    );

    const close = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close")
        .setLabel("🔒 Fechar Pedido")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [menu, close] });

    return interaction.reply({ content: `✅ ticket criado: ${channel}`, ephemeral: true });
  }

  // ======================
  // MENU
  // ======================
  if (interaction.isStringSelectMenu()) {

    const choice = interaction.values[0];

    const msg =
      choice === "simple"
        ? `🤖 Bot Simples - ${PRICE.simple}`
        : choice === "premium"
        ? `💎 Bot Premium - ${PRICE.premium}`
        : `⚙️ Sistema Completo - ${PRICE.system}`;

    return interaction.reply({ content: msg, ephemeral: true });
  }

  // ======================
  // FECHAR
  // ======================
  if (interaction.isButton() && interaction.customId === "close") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ apenas staff", ephemeral: true });
    }

    await interaction.reply("🔒 fechando pedido...");
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }
});

// ==========================
// LOGIN
// ==========================
client.login(process.env.TOKEN);
