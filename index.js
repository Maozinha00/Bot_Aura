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
          SendMessages: true,
          AddReactions: true
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
// 📌 COMANDO PAINEL
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
      Routes.applicationGuildCommands(process.env.CLIENT_ID, CONFIG.serverId),
      { body: commands }
    );
    console.log("🏢 BOT ONLINE");
  } catch (err) {
    console.log(err);
  }
})();

// ==========================
// 🚀 READY
// ==========================
client.once("ready", async () => {
  console.log(`🏢 ONLINE: ${client.user.tag}`);

  const guild = client.guilds.cache.get(CONFIG.serverId);
  if (guild) await bloquearCargo(guild);
});

// ==========================
// 👋 BOAS-VINDAS
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

💼 Você entrou na AURA BOTS STUDIO

🤖 Desenvolvimento de Bots Discord  
⚙️ Sistemas automatizados  
🚀 Soluções profissionais para servidores RP`
    );

  channel.send({ embeds: [embed] });
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
      return interaction.reply({ content: "❌ Apenas equipe", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🏢 AURA BOTS STUDIO - CATÁLOGO OFICIAL")
      .setDescription(
`╔══════════════════════════════╗
💎 AURA BOTS STUDIO - ELITE STORE
╚══════════════════════════════╝

🚀 AUTOMAÇÃO PROFISSIONAL

🤖 Bot Básico - R$ 15  
💎 Bot Personalizado - R$ 50  
⚙️ Sistema Enterprise - R$ 120

═══════════════════════════════
🎫 Clique abaixo para solicitar
═══════════════════════════════`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("📦 Abrir Pedido")
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
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        },
        {
          id: CONFIG.staffRole,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🏢 PEDIDO ABERTO")
      .setDescription(
`📦 Escolha seu serviço:

🤖 Bot Básico - R$ 15  
💎 Bot Personalizado - R$ 50  
⚙️ Sistema Enterprise - R$ 120`
      );

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Selecionar serviço")
        .addOptions([
          { label: "Bot Básico - R$ 15", value: "basic" },
          { label: "Bot Personalizado - R$ 50", value: "pro" },
          { label: "Sistema Enterprise - R$ 120", value: "enterprise" }
        ])
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("feedback")
        .setLabel("⭐ Dar Feedback")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("close")
        .setLabel("🔒 Encerrar")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [menu, row2] });

    return interaction.reply({ content: "📦 ticket criado", ephemeral: true });
  }

  // ======================
  // ⭐ FEEDBACK
  // ======================
  if (interaction.isButton() && interaction.customId === "feedback") {

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⭐ FEEDBACK")
      .setDescription("Escolha uma nota de 1 a 5 estrelas:");

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("nota_feedback")
        .setPlaceholder("Selecionar nota")
        .addOptions([
          { label: "⭐ 1", value: "1" },
          { label: "⭐⭐ 2", value: "2" },
          { label: "⭐⭐⭐ 3", value: "3" },
          { label: "⭐⭐⭐⭐ 4", value: "4" },
          { label: "⭐⭐⭐⭐⭐ 5", value: "5" }
        ])
    );

    return interaction.reply({ embeds: [embed], components: [menu], ephemeral: true });
  }

  // ======================
  // RECEBER FEEDBACK
  // ======================
  if (interaction.isStringSelectMenu() && interaction.customId === "nota_feedback") {

    const nota = interaction.values[0];
    const channel = interaction.guild.channels.cache.get(CONFIG.feedbackChannel);

    if (channel) {
      channel.send(
`⭐ **NOVO FEEDBACK RECEBIDO**

👤 Usuário: ${interaction.user}
⭐ Nota: ${nota}/5
📦 Ticket: ${interaction.channel.name}`
      );
    }

    return interaction.reply({ content: "✅ Feedback enviado com sucesso!", ephemeral: true });
  }

  // ======================
  // FECHAR TICKET
  // ======================
  if (interaction.isButton() && interaction.customId === "close") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ apenas equipe", ephemeral: true });
    }

    await interaction.reply("🔒 encerrando...");
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }
});

// ==========================
// LOGIN
// ==========================
client.login(process.env.TOKEN);
