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
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// 🔑 IDs
const CANAL_BOAS_VINDAS = "1495178025296461992";
const CANAL_PAINEL = "1495178025602515176";
const CARGO_STAFF = "1495178024797208588";

// 🚀 ONLINE
client.once("ready", async () => {
  console.log(`✅ Logado como ${client.user.tag}`);

  const canal = await client.channels.fetch(CANAL_PAINEL);

  const embed = new EmbedBuilder()
    .setTitle("🎛️ Painel Aura Bots Studio")
    .setDescription(
`👋 Bem-vindo ao Aura Bots Studio

🤖 Especialistas na criação de bots simples, profissionais e automatizados  
⚙️ Sistemas sob medida para Discord e FiveM  

🎫 Clique no botão abaixo para abrir um ticket  
🚀 Automatize tudo com qualidade`
    )
    .setColor("Purple");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("abrir_ticket")
      .setLabel("🎫 Abrir Ticket")
      .setStyle(ButtonStyle.Primary)
  );

  canal.send({ embeds: [embed], components: [row] });
});

// 👋 BOAS-VINDAS
client.on("guildMemberAdd", async (member) => {
  const canal = await member.guild.channels.fetch(CANAL_BOAS_VINDAS);

  const embed = new EmbedBuilder()
    .setTitle("👋 Bem-vindo ao Aura Bots Studio")
    .setDescription(
`Fala ${member}, seja muito bem-vindo! 🚀

🤖 Aqui você encontra bots profissionais  
⚙️ Sistemas automatizados para Discord e FiveM  

🎫 Abra um ticket para começar seu projeto`
    )
    .setColor("Purple")
    .setThumbnail(member.user.displayAvatarURL());

  canal.send({ embeds: [embed] });
});

// 🎫 SISTEMA DE TICKET
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "abrir_ticket") {
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
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        },
        {
          id: CARGO_STAFF,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle("🎫 Ticket Aberto")
      .setDescription(
`Olá ${interaction.user}, descreva seu pedido.

👨‍💻 Um membro da staff irá te atender em breve.`
      )
      .setColor("Purple");

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
  }

  // 🔒 FECHAR TICKET
  if (interaction.customId === "fechar_ticket") {
    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({
        content: "❌ Apenas staff pode fechar.",
        ephemeral: true
      });
    }

    await interaction.reply("🔒 Fechando ticket...");
    setTimeout(() => {
      interaction.channel.delete();
    }, 3000);
  }
});

client.login(process.env.TOKEN);
