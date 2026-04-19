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
  StringSelectMenuBuilder
} from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// 🔑 CONFIG
const SERVIDOR_ID = "1495178024759332914";
const CANAL_BOAS_VINDAS = "1495178025296461992";
const CANAL_PAINEL = "1495178025602515176";
const CARGO_STAFF = "1495178024797208588";
const CARGO_AUTO = "1495178024759332917";

// 🚀 ONLINE
client.once("ready", async () => {
  console.log(`✅ ${client.user.tag} online`);

  const guild = await client.guilds.fetch(SERVIDOR_ID);
  const canal = await guild.channels.fetch(CANAL_PAINEL);

  const embed = new EmbedBuilder()
    .setColor("#6A0DAD")
    .setDescription(
`╔══════════════════════════════╗
👑 **AURA BOTS STUDIO**
╚══════════════════════════════╝

💎 **AUTOMAÇÃO DE ALTO NÍVEL PARA SERVIDORES**

🤖 Bots personalizados com padrão profissional
⚙️ Sistemas inteligentes e automatizados

🚀 Ideal para servidores RP, comunidades e projetos

═══════════════════════════════
🎫 **SOLICITE AGORA SEU BOT**
🔥 Atendimento rápido e suporte ativo
═══════════════════════════════`
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket")
      .setLabel("🎫 Abrir Ticket")
      .setStyle(ButtonStyle.Primary)
  );

  canal.send({ embeds: [embed], components: [row] });
});

// 👋 ENTRADA
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== SERVIDOR_ID) return;

  await member.roles.add(CARGO_AUTO);

  const canal = await member.guild.channels.fetch(CANAL_BOAS_VINDAS);

  const embed = new EmbedBuilder()
    .setColor("#6A0DAD")
    .setDescription(`👋 ${member}\nBem-vindo ao **Aura Bots Studio** 🚀`);

  canal.send({ embeds: [embed] });
});

// 🎫 INTERAÇÕES
client.on("interactionCreate", async (interaction) => {
  if (interaction.guild.id !== SERVIDOR_ID) return;

  // ABRIR TICKET
  if (interaction.isButton() && interaction.customId === "ticket") {

    const canal = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        { id: CARGO_STAFF, allow: [PermissionsBitField.Flags.ViewChannel] }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🎫 Atendimento")
      .setDescription("Selecione o tipo de pedido abaixo:");

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Escolha uma opção")
        .addOptions([
          { label: "🤖 Bot Simples", value: "simples" },
          { label: "💎 Bot Premium", value: "premium" },
          { label: "⚙️ Sistema Personalizado", value: "sistema" }
        ])
    );

    const fechar = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("fechar")
        .setLabel("🔒 Fechar Ticket")
        .setStyle(ButtonStyle.Danger)
    );

    canal.send({ embeds: [embed], components: [menu, fechar] });

    interaction.reply({ content: `✅ Ticket criado: ${canal}`, ephemeral: true });
  }

  // MENU
  if (interaction.isStringSelectMenu()) {
    let resposta = "";

    if (interaction.values[0] === "simples")
      resposta = "🤖 Bot simples solicitado.";
    if (interaction.values[0] === "premium")
      resposta = "💎 Bot premium solicitado.";
    if (interaction.values[0] === "sistema")
      resposta = "⚙️ Sistema personalizado solicitado.";

    interaction.reply({ content: resposta });
  }

  // FECHAR
  if (interaction.isButton() && interaction.customId === "fechar") {
    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({ content: "❌ Apenas staff", ephemeral: true });
    }

    await interaction.reply("🔒 Fechando...");
    setTimeout(() => interaction.channel.delete(), 3000);
  }
});

client.login(process.env.TOKEN);
