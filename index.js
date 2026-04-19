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

// 🚀 CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// 🔑 CONFIG
const SERVIDOR_ID = "1495178024759332914";
const CANAL_BOAS_VINDAS = "1495275678533288068";
const CARGO_STAFF = "1495178024797208588";
const CARGO_AUTO = "1495178024759332917";

// 💰 PREÇOS
const PRECOS = {
  simples: "R$ 15",
  premium: "R$ 50",
  sistema: "R$ 120"
};

// ==========================
// SLASH COMMAND
// ==========================
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("Enviar painel de pedidos")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// registro seguro
(async () => {
  try {
    if (!process.env.CLIENT_ID || !process.env.TOKEN) {
      throw new Error("CLIENT_ID ou TOKEN não definido no .env");
    }

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("✅ comandos registrados");
  } catch (err) {
    console.log("❌ erro comandos:", err);
  }
})();

// ==========================
// BOT ONLINE
// ==========================
client.once("ready", () => {
  console.log(`💎 ULTRA ELITE ONLINE: ${client.user.tag}`);
});

// ==========================
// BOAS-VINDAS
// ==========================
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== SERVIDOR_ID) return;

  try {
    await member.roles.add(CARGO_AUTO).catch(() => {});

    const canal = await member.guild.channels.fetch(CANAL_BOAS_VINDAS).catch(() => null);
    if (!canal) return;

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("👋 Bem-vindo à Aura Bots Studio")
      .setDescription(
`💎 Olá ${member.user}

🤖 Bots simples e profissionais  
💎 Bots personalizados  
⚙️ Sistemas automatizados  

🎫 Use /painel para começar`
      );

    await canal.send({ embeds: [embed] }).catch(() => {});
  } catch (err) {
    console.log("Erro boas-vindas:", err);
  }
});

// ==========================
// INTERAÇÕES
// ==========================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.guild) return;

  // ======================
  // PAINEL
  // ======================
  if (interaction.isChatInputCommand() && interaction.commandName === "painel") {

    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({ content: "❌ Apenas staff", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setDescription("💎 Clique abaixo para abrir um pedido");

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

    const canal = await interaction.guild.channels.create({
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
          id: CARGO_STAFF,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    }).catch(() => null);

    if (!canal) {
      return interaction.reply({ content: "❌ erro ao criar ticket", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("💎 NOVO PEDIDO")
      .setDescription("Escolha o produto abaixo:");

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Selecionar produto")
        .addOptions([
          { label: `🤖 Bot Simples - ${PRECOS.simples}`, value: "simples" },
          { label: `💎 Bot Personalizado - ${PRECOS.premium}`, value: "premium" },
          { label: `⚙️ Sistema Completo - ${PRECOS.sistema}`, value: "sistema" }
        ])
    );

    const fechar = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("fechar")
        .setLabel("🔒 Fechar")
        .setStyle(ButtonStyle.Danger)
    );

    await canal.send({ embeds: [embed], components: [menu, fechar] });

    return interaction.reply({ content: `✅ ticket criado`, ephemeral: true });
  }

  // ======================
  // MENU
  // ======================
  if (interaction.isStringSelectMenu()) {
    const escolha = interaction.values?.[0];
    if (!escolha) return;

    const msg =
      escolha === "simples"
        ? `🤖 Bot Simples - ${PRECOS.simples}`
        : escolha === "premium"
        ? `💎 Bot Personalizado - ${PRECOS.premium}`
        : `⚙️ Sistema Completo - ${PRECOS.sistema}`;

    return interaction.reply({ content: msg, ephemeral: true });
  }

  // ======================
  // FECHAR
  // ======================
  if (interaction.isButton() && interaction.customId === "fechar") {

    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({ content: "❌ apenas staff", ephemeral: true });
    }

    await interaction.reply("🔒 fechando...");
    setTimeout(() => interaction.channel.delete().catch(() => {}), 2500);
  }
});

// ==========================
// LOGIN
// ==========================
client.login(process.env.TOKEN);
