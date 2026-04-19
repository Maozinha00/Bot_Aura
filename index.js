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
  console.log(`💎 ${client.user.tag} ONLINE - AURA ELITE`);

  const guild = await client.guilds.fetch(SERVIDOR_ID);
  const canal = await guild.channels.fetch(CANAL_PAINEL);

  const embed = new EmbedBuilder()
    .setColor("#6A0DAD")
    .setDescription(
`╔══════════════════════════════╗
💎 **AURA BOTS STUDIO - ELITE STORE**
╚══════════════════════════════╝

🚀 **AUTOMAÇÃO PROFISSIONAL PARA SERVIDORES**

🤖 Bots modernos, rápidos e personalizados  
⚙️ Sistemas completos para Discord e FiveM  

💼 Soluções para servidores RP e comunidades profissionais  

═══════════════════════════════
🎫 Clique abaixo e abra seu pedido
🔥 Atendimento premium e rápido
═══════════════════════════════`
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket")
      .setLabel("🎫 Abrir Pedido")
      .setStyle(ButtonStyle.Primary)
  );

  canal.send({ embeds: [embed], components: [row] });
});

// 👋 BOAS-VINDAS + CATÁLOGO
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== SERVIDOR_ID) return;

  await member.roles.add(CARGO_AUTO);

  const canal = await member.guild.channels.fetch(CANAL_BOAS_VINDAS);

  const embed = new EmbedBuilder()
    .setColor("#6A0DAD")
    .setDescription(
`╔══════════════════════════════╗
👋 **BEM-VINDO À AURA BOTS STUDIO**
╚══════════════════════════════╝

💎 **LOJA OFICIAL DE BOTS PREMIUM**

🤖 Criamos bots profissionais para Discord e FiveM  
⚙️ Sistemas automatizados sob medida  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
📦 **CATÁLOGO DE PRODUTOS:**  

🤖 **BOT SIMPLES**
• Comandos básicos  
• Sistemas leves  
• Ideal para servidores iniciantes  

💎 **BOT PERSONALIZADO**
• Sistema completo sob medida  
• Design e funções exclusivas  
• Ideal para servidores profissionais  

⚙️ **SISTEMA COMPLETO**
• Projetos avançados  
• Automação total do servidor  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
🎫 Abra um ticket para orçamento  
🚀 Suporte rápido e atendimento premium  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    )
    .setThumbnail(member.user.displayAvatarURL());

  canal.send({ embeds: [embed] });
});

// 🎫 SISTEMA DE TICKET ELITE
client.on("interactionCreate", async (interaction) => {
  if (interaction.guild.id !== SERVIDOR_ID) return;

  // ABRIR TICKET
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
      .setTitle("💎 Orçamento Aura Bots Studio")
      .setDescription(
`👋 Olá ${interaction.user}

📌 Preencha abaixo seu pedido:

• Tipo de bot desejado  
• Funções que precisa  
• Prazo esperado  

💼 Nossa equipe irá te responder com orçamento personalizado.`
      );

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Escolha o produto")
        .addOptions([
          { label: "🤖 Bot Simples", value: "simples" },
          { label: "💎 Bot Personalizado", value: "premium" },
          { label: "⚙️ Sistema Completo", value: "sistema" }
        ])
    );

    const fechar = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("fechar")
        .setLabel("🔒 Finalizar Pedido")
        .setStyle(ButtonStyle.Danger)
    );

    canal.send({ embeds: [embed], components: [menu, fechar] });

    interaction.reply({ content: `✅ Pedido aberto: ${canal}`, ephemeral: true });
  }

  // MENU
  if (interaction.isStringSelectMenu()) {

    let msg = "";

    switch (interaction.values[0]) {
      case "simples":
        msg = "🤖 Pedido: **Bot Simples** registrado.";
        break;
      case "premium":
        msg = "💎 Pedido: **Bot Personalizado** registrado.";
        break;
      case "sistema":
        msg = "⚙️ Pedido: **Sistema Completo** registrado.";
        break;
    }

    interaction.reply({ content: msg, ephemeral: true });
  }

  // FECHAR TICKET
  if (interaction.isButton() && interaction.customId === "fechar") {

    if (!interaction.member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({ content: "❌ Apenas staff pode finalizar pedidos.", ephemeral: true });
    }

    await interaction.reply("🔒 Finalizando pedido...");
    setTimeout(() => interaction.channel.delete(), 3000);
  }
});

client.login(process.env.TOKEN);
