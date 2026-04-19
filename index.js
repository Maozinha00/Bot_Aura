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

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// 🔑 CONFIG
const SERVIDOR_ID = "1495178024759332914";
const CARGO_STAFF = "1495178024797208588";
const CARGO_AUTO = "1495178024759332917";

// 📦 memória simples (painel config)
let PAINEL_CANAL = null;

// 💰 PREÇOS
const PRECOS = {
  simples: "R$ 15",
  premium: "R$ 50",
  sistema: "R$ 120"
};

// ==========================
// 📌 SLASH COMMANDS
// ==========================
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("Enviar painel de pedidos"),

  new SlashCommandBuilder()
    .setName("painel-setup")
    .setDescription("Definir canal do painel")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
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
// 🚀 ONLINE
// ==========================
client.once("ready", () => {
  console.log(`💎 ULTRA ELITE ONLINE: ${client.user.tag}`);
});

// ==========================
// 👋 AUTO CARGO
// ==========================
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== SERVIDOR_ID) return;

  try {
    await member.roles.add(CARGO_AUTO);
  } catch {}
});

// ==========================
// 🎛️ INTERAÇÕES
// ==========================
client.on("interactionCreate", async (interaction) => {

  // ======================
  // SETUP PAINEL
  // ======================
  if (interaction.isChatInputCommand() && interaction.commandName === "painel-setup") {

    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({ content: "❌ Apenas staff", ephemeral: true });
    }

    PAINEL_CANAL = interaction.channel.id;

    return interaction.reply({
      content: `✅ Painel configurado neste canal!`,
      ephemeral: true
    });
  }

  // ======================
  // PAINEL
  // ======================
  if (interaction.isChatInputCommand() && interaction.commandName === "painel") {

    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({ content: "❌ Apenas staff", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setDescription(
`💎 **AURA BOTS STUDIO - ULTRA ELITE**

🚀 Escolha abaixo e abra seu pedido`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket")
        .setLabel("🎫 Abrir Pedido")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({
      embeds: [embed],
      components: [row]
    });

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
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        { id: CARGO_STAFF, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("💎 NOVO PEDIDO ULTRA ELITE")
      .setDescription("Selecione o produto abaixo:");

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Escolha o produto")
        .addOptions([
          { label: `🤖 Bot Simples - ${PRECOS.simples}`, value: "simples" },
          { label: `💎 Bot Personalizado - ${PRECOS.premium}`, value: "premium" },
          { label: `⚙️ Sistema Completo - ${PRECOS.sistema}`, value: "sistema" }
        ])
    );

    const fechar = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("fechar")
        .setLabel("🔒 Fechar Pedido")
        .setStyle(ButtonStyle.Danger)
    );

    await canal.send({ embeds: [embed], components: [menu, fechar] });

    return interaction.reply({ content: `✅ criado: ${canal}`, ephemeral: true });
  }

  // ======================
  // MENU
  // ======================
  if (interaction.isStringSelectMenu()) {

    const escolha = interaction.values[0];

    const msg =
      escolha === "simples"
        ? `🤖 Bot Simples selecionado - ${PRECOS.simples}`
        : escolha === "premium"
        ? `💎 Bot Personalizado selecionado - ${PRECOS.premium}`
        : `⚙️ Sistema Completo selecionado - ${PRECOS.sistema}`;

    return interaction.reply({ content: msg, ephemeral: true });
  }

  // ======================
  // FECHAR
  // ======================
  if (interaction.isButton() && interaction.customId === "fechar") {

    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({ content: "❌ apenas staff", ephemeral: true });
    }

    await interaction.reply("🔒 finalizando pedido...");
    setTimeout(() => interaction.channel.delete(), 3000);
  }
});

client.login(process.env.TOKEN);
