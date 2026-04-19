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
  autoRole: "1495178024759332917",
  chatGeral: "1495178025296461986"
};

// ==========================
// 💰 CATÁLOGO
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
// 🔒 BLOQUEIO DE CARGO
// ==========================
async function bloquearCargo(guild) {
  const roleId = CONFIG.autoRole;
  const canalLiberado = CONFIG.chatGeral;

  guild.channels.cache.forEach(async (channel) => {
    try {

      // 🔓 CHAT GERAL LIBERADO
      if (channel.id === canalLiberado) {
        await channel.permissionOverwrites.edit(roleId, {
          ViewChannel: true,
          SendMessages: true,
          AddReactions: true
        });
      }

      // 🔒 DEMAIS CANAIS BLOQUEADOS
      else {
        await channel.permissionOverwrites.edit(roleId, {
          SendMessages: false,
          AddReactions: false,
          Speak: false
        });
      }

    } catch (err) {
      console.log(`Erro no canal ${channel.name}`);
    }
  });
}

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
// 🚀 READY
// ==========================
client.once("ready", async () => {
  console.log(`🏢 ONLINE: ${client.user.tag}`);

  const guild = client.guilds.cache.get(CONFIG.serverId);
  if (!guild) return;

  await bloquearCargo(guild);
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

💼 Você entrou na AURA BOTS STUDIO

Somos especialistas em:

🤖 Desenvolvimento de Bots Discord  
⚙️ Sistemas automatizados  
🚀 Soluções profissionais para servidores RP`
      );

    await channel.send({ embeds: [embed] });

  } catch {}
});

// ==========================
// 🎛️ INTERAÇÕES
// ==========================
client.on("interactionCreate", async (interaction) => {

  if (!interaction.guild) return;

  // /painel
  if (interaction.isChatInputCommand() && interaction.commandName === "painel") {

    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ Apenas equipe", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🏢 CATÁLOGO OFICIAL")
      .setDescription(
`🤖 ${PRODUCTS.basic.name} - ${PRODUCTS.basic.price}
💎 ${PRODUCTS.pro.name} - ${PRODUCTS.pro.price}
⚙️ ${PRODUCTS.enterprise.name} - ${PRODUCTS.enterprise.price}`
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

  // ticket
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

    await channel.send("📦 pedido criado");
    return interaction.reply({ content: "ticket criado", ephemeral: true });
  }
});

// ==========================
// LOGIN
// ==========================
client.login(process.env.TOKEN);
