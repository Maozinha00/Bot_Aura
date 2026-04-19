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
// 📌 COMANDO /PAINEL
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
🏢 AURA BOTS STUDIO
╚══════════════════════════════╝

🚀 DESENVOLVIMENTO PROFISSIONAL DE SISTEMAS

A AURA BOTS STUDIO cria soluções modernas para Discord e servidores RP, focando em automação, performance e qualidade.

📦 SERVIÇOS DISPONÍVEIS:

🤖 Bot Básico - R$ 15  
📝 Comandos simples e automações leves

───────────────────────────────

💎 Bot Personalizado - R$ 50  
📝 Sistema completo sob medida para seu servidor

───────────────────────────────

⚙️ Sistema Enterprise - R$ 120  
📝 Automação avançada, integrações e recursos premium

═══════════════════════════════
🎫 Clique abaixo para abrir um pedido
🔥 Atendimento rápido e profissional
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
      .setTitle("🏢 PEDIDO ABERTO - AURA BOTS STUDIO")
      .setDescription(
`📦 Escolha seu serviço:

🤖 Bot Básico - R$ 15  
💎 Bot Personalizado - R$ 50  
⚙️ Sistema Enterprise - R$ 120`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("feedback")
        .setLabel("⭐ Feedback")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("close")
        .setLabel("🔒 Encerrar")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [row] });

    return interaction.reply({ content: "📦 ticket criado", ephemeral: true });
  }

  // ======================
  // ⭐ FEEDBACK
  // ======================
  if (interaction.isButton() && interaction.customId === "feedback") {

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⭐ FEEDBACK AURA BOTS STUDIO")
      .setDescription("Escolha sua avaliação:");

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

    return interaction.reply({ content: "✅ feedback enviado!", ephemeral: true });
  }

  // ======================
  // FECHAR TICKET
  // ======================
  if (interaction.isButton() && interaction.customId === "close") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ sem permissão", ephemeral: true });
    }

    await interaction.reply("🔒 encerrando...");
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }
});

// ==========================
client.login(process.env.TOKEN);
