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
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

// ==========================
// 🏢 CONFIG
// ==========================
const CONFIG = {
  serverId: "1495178024759332914",
  welcomeChannel: "1495275678533288068",
  staffRole: "1495178024797208588",
  autoRole: "1495178024759332917",
  chatGeral: "1495178025296461986",
  feedbackChannel: "1495178025443000471"
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
// 🔒 BLOQUEIO DE CARGO
// ==========================
async function bloquearCargo(guild) {
  const roleId = CONFIG.autoRole;
  const canalLiberado = CONFIG.chatGeral;

  guild.channels.cache.forEach(async (channel) => {
    try {
      if (channel.id === canalLiberado) {
        await channel.permissionOverwrites.edit(roleId, {
          ViewChannel: true,
          SendMessages: true
        });
      } else {
        await channel.permissionOverwrites.edit(roleId, {
          SendMessages: false,
          AddReactions: false,
          Speak: false
        });
      }
    } catch {}
  });
}

// ==========================
// SLASH COMMAND
// ==========================
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("🏢 Abrir catálogo")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, CONFIG.serverId),
    { body: commands }
  );
  console.log("🏢 BOT ONLINE");
})();

// ==========================
// READY
// ==========================
client.once("ready", async () => {
  console.log(`🏢 ONLINE: ${client.user.tag}`);

  const guild = client.guilds.cache.get(CONFIG.serverId);
  if (guild) await bloquearCargo(guild);
});

// ==========================
// BOAS-VINDAS
// ==========================
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== CONFIG.serverId) return;

  await member.roles.add(CONFIG.autoRole).catch(() => {});

  const channel = await member.guild.channels.fetch(CONFIG.welcomeChannel).catch(() => null);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#6A0DAD")
    .setTitle("🏢 AURA BOTS STUDIO | EMPRESA OFICIAL")
    .setDescription(
`👋 Bem-vindo ${member.user}

🤖 Bots Discord  
⚙️ Sistemas automatizados  
🚀 Soluções profissionais RP`
    );

  channel.send({ embeds: [embed] });
});

// ==========================
// INTERAÇÕES
// ==========================
client.on("interactionCreate", async (interaction) => {

  if (!interaction.guild) return;

  // ======================
  // /PAINEL
  // ======================
  if (interaction.isChatInputCommand() && interaction.commandName === "painel") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ Apenas equipe", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🏢 AURA BOTS STUDIO - CATÁLOGO OFICIAL")
      .setDescription(
`╔══════════════════════════════╗
💎 ELITE STORE
╚══════════════════════════════╝

🚀 AUTOMAÇÃO PROFISSIONAL

Escolha uma categoria abaixo 👇`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cat_basic")
        .setLabel("🤖 Básico - R$15")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("cat_pro")
        .setLabel("💎 Personalizado - R$50")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("cat_enterprise")
        .setLabel("⚙️ Enterprise - R$120")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });

    return interaction.reply({ content: "✅ painel enviado", ephemeral: true });
  }

  // ======================
  // ABRIR TICKET
  // ======================
  if (interaction.isButton() && interaction.customId.startsWith("cat_")) {

    const tipo = interaction.customId;

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

    let plano = "";

    if (tipo === "cat_basic") plano = "🤖 Bot Básico - R$15";
    if (tipo === "cat_pro") plano = "💎 Bot Personalizado - R$50";
    if (tipo === "cat_enterprise") plano = "⚙️ Sistema Enterprise - R$120";

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🏢 PEDIDO ABERTO")
      .setDescription(
`📦 Plano selecionado:

${plano}

💬 Aguarde atendimento da equipe`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("feedback")
        .setLabel("⭐ Feedback")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("close")
        .setLabel("🔒 Fechar")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [row] });

    return interaction.reply({ content: "📦 ticket criado", ephemeral: true });
  }

  // ======================
  // FEEDBACK
  // ======================
  if (interaction.isButton() && interaction.customId === "feedback") {

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⭐ FEEDBACK")
      .setDescription("Escolha sua nota:");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("fb1").setLabel("⭐ 1").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("fb2").setLabel("⭐⭐ 2").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("fb3").setLabel("⭐⭐⭐ 3").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("fb4").setLabel("⭐⭐⭐⭐ 4").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("fb5").setLabel("⭐⭐⭐⭐⭐ 5").setStyle(ButtonStyle.Success)
    );

    return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  // ======================
  // SALVAR FEEDBACK
  // ======================
  if (interaction.isButton() && interaction.customId.startsWith("fb")) {

    const nota = interaction.customId.replace("fb", "");
    const canal = await interaction.guild.channels.fetch(CONFIG.feedbackChannel).catch(() => null);

    if (canal) {
      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("⭐ NOVO FEEDBACK")
        .addFields(
          { name: "Usuário", value: `${interaction.user}` },
          { name: "Nota", value: `${nota}/5` },
          { name: "Ticket", value: interaction.channel.name }
        );

      canal.send({ embeds: [embed] });
    }

    return interaction.reply({ content: "✅ obrigado pelo feedback!", ephemeral: true });
  }

  // ======================
  // FECHAR
  // ======================
  if (interaction.isButton() && interaction.customId === "close") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ sem permissão", ephemeral: true });
    }

    await interaction.reply("🔒 fechando...");
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }
});

// ==========================
client.login(process.env.TOKEN);
