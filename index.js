import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// 🔑 IDs
const SERVIDOR_ID = "1495178024759332914";
const CANAL_BOAS_VINDAS = "1495178025296461992";
const CANAL_PAINEL = "1495178025602515176";
const CARGO_STAFF = "1495178024797208588";
const CARGO_AUTO = "1495178024759332917";

// 🚀 BOT ONLINE
client.once("ready", async () => {
  console.log(`✅ Logado como ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(SERVIDOR_ID);
    const canal = await guild.channels.fetch(CANAL_PAINEL);

    if (!canal) return console.log("❌ Canal não encontrado");

    const embed = new EmbedBuilder()
      .setColor("Purple")
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
        .setCustomId("abrir_ticket")
        .setLabel("🎫 Abrir Ticket")
        .setStyle(ButtonStyle.Primary)
    );

    canal.send({ embeds: [embed], components: [row] });

  } catch (err) {
    console.log("Erro painel:", err);
  }
});

// 👋 ENTRADA + AUTO CARGO
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== SERVIDOR_ID) return;

  try {
    await member.roles.add(CARGO_AUTO);

    const canal = await member.guild.channels.fetch(CANAL_BOAS_VINDAS);
    if (!canal) return;

    const embed = new EmbedBuilder()
      .setColor("Purple")
      .setDescription(
`👋 ${member}

Seja bem-vindo ao **AURA BOTS STUDIO** 🚀

🎫 Abra um ticket para solicitar seu bot`
      )
      .setThumbnail(member.user.displayAvatarURL());

    canal.send({ embeds: [embed] });

  } catch (err) {
    console.log("Erro entrada:", err);
  }
});

// 🎫 SISTEMA DE TICKET
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.guild.id !== SERVIDOR_ID) return;

  if (interaction.customId === "abrir_ticket") {
    try {
      const canal = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
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
      });

      const embed = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(
`🎫 **Ticket aberto**

Explique seu pedido que a equipe irá te atender.`
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("fechar_ticket")
          .setLabel("🔒 Fechar Ticket")
          .setStyle(ButtonStyle.Danger)
      );

      canal.send({ embeds: [embed], components: [row] });

      interaction.reply({
        content: `✅ Ticket criado: ${canal}`,
        ephemeral: true
      });

    } catch (err) {
      console.log("Erro ticket:", err);
    }
  }

  if (interaction.customId === "fechar_ticket") {
    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({
        content: "❌ Apenas staff pode fechar",
        ephemeral: true
      });
    }

    await interaction.reply("🔒 Fechando...");
    setTimeout(() => interaction.channel.delete(), 3000);
  }
});

client.login(process.env.TOKEN);
