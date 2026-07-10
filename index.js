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

// ==========================================
// 🏢 CONFIGURAÇÕES DO SERVIDOR (AURA BOTS)
// ==========================================
const CONFIG = {
  serverId: "1495178024759332914",         // ID do Servidor Principal da Aura Bots
  welcomeChannel: "1495275678533288068",   // ID do canal onde envia as Boas-Vindas
  staffRole: "1495178024797208588",        // ID do cargo de Equipe autorizado
  autoRole: "1495178024759332917",         // ID do cargo automático de novos membros (Não Verificado)
  chatGeral: "1495178025296461986",        // ID do canal público liberado para ler
  feedbackChannel: "1495178025443000471",  // ID do canal onde envia as avaliações de estrelas
  
  // IDs para Clonagem de Backup Automática:
  sourceServerId: "1495178024759332914",   // ID do servidor de ORIGEM (copiar canais)
  destServerId: "1195468742595985438",     // ID do servidor de DESTINO (onde tudo será criado)
  targetServerName: "A͎u͎r͎a͎ ͎B͎o͎t͎s͎ ͎S͎t͎u͎d͎i͎o͎"       // Nome que o servidor de destino receberá
};

// ==========================================
// 🤖 INICIALIZAÇÃO DO BOT E INTENTS
// ==========================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Auxiliar para pausas entre requisições
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// 🔒 BLOQUEIO AUTOMÁTICO DE CANAIS
// ==========================================
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

// ==========================================
// 📌 REGISTRO DO COMANDO SLASH (/painel)
// ==========================================
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("🏢 Abrir catálogo da empresa")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN || process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    if (process.env.TOKEN || process.env.DISCORD_BOT_TOKEN) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID || "SEU_CLIENT_ID", CONFIG.serverId),
        { body: commands }
      );
      console.log("🏢 Comando /painel registrado com sucesso globalmente!");
    }
  } catch (err) {
    console.log("Erro ao registrar comandos Slash:", err);
  }
})();

// ==========================================
// 🚀 EVENTO: BOT ONLINE
// ==========================================
client.once("ready", async () => {
  console.log(`🏢 ONLINE: ${client.user.tag}`);

  const guild = client.guilds.cache.get(CONFIG.serverId);
  if (guild) await bloquearCargo(guild);
});

// ==========================================
// 👋 BOAS-VINDAS COM EMBED
// ==========================================
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

// ==========================================
// 🛠️ COMANDO !clonaraura (SISTEMA DE BACKUP)
// ==========================================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Comando com prefixo para iniciar a clonagem/backup
  if (message.content.toLowerCase() === "!clonaraura") {
    
    // Verificar permissão (Cargo Staff da Aura ou Administrador do servidor)
    const isStaff = message.member?.roles.cache.has(CONFIG.staffRole) || message.member?.permissions.has(PermissionsBitField.Flags.Administrator);
    if (!isStaff) {
      return message.reply("❌ Apenas membros da equipe ou Administradores podem executar este comando!");
    }

    const logChannel = message.channel;
    const progressEmbed = new EmbedBuilder()
      .setColor("#6A0DAD")
      .setTitle("🌀 INICIANDO CLONAGEM DO SERVIDOR")
      .setDescription("🔄 Preparando e estabelecendo conexões com as APIs...")
      .setTimestamp();

    const progressMsg = await logChannel.send({ embeds: [progressEmbed] });

    const updateStatus = async (stage, description, progressColor = "#6A0DAD") => {
      const updated = new EmbedBuilder()
        .setColor(progressColor)
        .setTitle("🌀 PROGRESSO DA CLONAGEM - AURA BOTS")
        .setDescription(`**Etapa:** ${stage}\n\n${description}`)
        .setTimestamp();
      await progressMsg.edit({ embeds: [updated] }).catch(() => {});
    };

    try {
      // 1. Validar e obter os servidores de Origem e Destino
      const sourceGuild = client.guilds.cache.get(CONFIG.sourceServerId) || await client.guilds.fetch(CONFIG.sourceServerId).catch(() => null);
      const destGuild = client.guilds.cache.get(CONFIG.destServerId) || await client.guilds.fetch(CONFIG.destServerId).catch(() => null);

      if (!sourceGuild) {
        return updateStatus("Erro", `❌ Servidor de origem não encontrado (${CONFIG.sourceServerId}). Certifique-se de que o bot está nele!`, "#FF0000");
      }
      if (!destGuild) {
        return updateStatus("Erro", `❌ Servidor de destino não encontrado (${CONFIG.destServerId}). Certifique-se de que o bot está nele e tem cargo de Administrador!`, "#FF0000");
      }

      // 2. Mudar Nome do Servidor de Destino
      await updateStatus("Renomeando Destino", `✏️ Renomeando servidor de destino para **${CONFIG.targetServerName}**...`);
      await destGuild.setName(CONFIG.targetServerName).catch(() => {});
      await sleep(1000);

      // 3. Deletar Canais Existentes no Destino (Limpeza completa)
      await updateStatus("Limpando Destino", "🧹 Apagando todos os canais antigos para evitar duplicações...");
      
      // Criar canal temporário (obrigatório, pois o Discord não aceita servidor sem canais)
      const tempChannel = await destGuild.channels.create({
        name: "suporte-clonagem",
        type: ChannelType.GuildText
      });

      const currentDestChannels = await destGuild.channels.fetch();
      for (const [id, channel] of currentDestChannels) {
        if (channel && channel.id !== tempChannel.id) {
          await channel.delete().catch(() => {});
          await sleep(250);
        }
      }

      // 4. Limpar Cargos antigos do Destino
      await updateStatus("Limpando Cargos", "🧹 Removendo cargos antigos (exceto @everyone e cargos gerenciados por bots)...");
      const currentDestRoles = await destGuild.roles.fetch();
      for (const [id, role] of currentDestRoles) {
        if (role && role.name !== "@everyone" && !role.managed && role.id !== destGuild.id && role.comparePositionTo(destGuild.members.me.roles.highest) < 0) {
          await role.delete().catch(() => {});
          await sleep(200);
        }
      }

      // 5. Clonar Cargos Originais
      await updateStatus("Clonando Cargos", "🎨 Recriando todos os cargos, cores e permissões no servidor novo...");
      const sourceRoles = await sourceGuild.roles.fetch();
      const roleMap = new Map(); // oldRoleId -> newRoleId

      const sortedRoles = Array.from(sourceRoles.values())
        .filter(r => r.name !== "@everyone" && !r.managed)
        .sort((a, b) => a.position - b.position);

      for (const role of sortedRoles) {
        const newRole = await destGuild.roles.create({
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          permissions: role.permissions,
          mentionable: role.mentionable,
          reason: "Cópia Aura Cloner"
        }).catch(() => null);

        if (newRole) {
          roleMap.set(role.id, newRole.id);
          await sleep(300);
        }
      }

      // 6. Criar Categorias e Canais
      await updateStatus("Criando Canais", "📁 Construindo canais de texto, de voz e organizando as categorias...");
      const sourceChannels = await sourceGuild.channels.fetch();
      const channelMap = new Map(); // oldChannelId -> newChannelId

      // Criar Categorias primeiro (tipo 4)
      const categories = Array.from(sourceChannels.values())
        .filter(c => c && c.type === ChannelType.GuildCategory)
        .sort((a, b) => a.position - b.position);

      for (const cat of categories) {
        const newCat = await destGuild.channels.create({
          name: cat.name,
          type: ChannelType.GuildCategory,
          position: cat.position
        }).catch(() => null);

        if (newCat) {
          channelMap.set(cat.id, newCat.id);
          await sleep(300);
        }
      }

      // Criar canais de texto/voz sob as novas categorias
      const nonCategories = Array.from(sourceChannels.values())
        .filter(c => c && c.type !== ChannelType.GuildCategory)
        .sort((a, b) => a.position - b.position);

      for (const chan of nonCategories) {
        const parentId = chan.parentId ? channelMap.get(chan.parentId) : null;
        let chanType = ChannelType.GuildText;
        if (chan.type === ChannelType.GuildVoice) chanType = ChannelType.GuildVoice;
        if (chan.type === ChannelType.GuildStageVoice) chanType = ChannelType.GuildStageVoice;
        if (chan.type === ChannelType.GuildAnnouncement) chanType = ChannelType.GuildAnnouncement;

        const newChan = await destGuild.channels.create({
          name: chan.name,
          type: chanType,
          topic: chan.topic || null,
          nsfw: chan.nsfw || false,
          parent: parentId,
          position: chan.position
        }).catch(() => null);

        if (newChan) {
          channelMap.set(chan.id, newChan.id);
          await sleep(300);
        }
      }

      // Apagar canal temporário criado no início
      await tempChannel.delete().catch(() => {});

      // 7. Clonar mensagens recentes importantes (últimas 30 por canal)
      await updateStatus("Clonando Mensagens", "💬 Copiando históricos de mensagens recentes dos canais mais ativos...");
      const textChannels = Array.from(sourceChannels.values()).filter(c => c && c.isTextBased() && !c.isVoiceBased());
      let copiedMessagesCount = 0;

      for (const oldChan of textChannels) {
        const newChanId = channelMap.get(oldChan.id);
        if (!newChanId) continue;

        const newChan = await destGuild.channels.fetch(newChanId).catch(() => null);
        if (!newChan || !newChan.isTextBased()) continue;

        const messages = await oldChan.messages.fetch({ limit: 30 }).catch(() => null);
        if (messages) {
          const sortedMsgs = Array.from(messages.values()).reverse();
          for (const msg of sortedMsgs) {
            if (msg.content || msg.embeds.length > 0) {
              const textToSend = msg.content ? `**[${msg.author.username}]**: ${msg.content}` : `**[${msg.author.username}]**: *(Apenas mídia/embed)*`;
              await newChan.send({
                content: textToSend,
                embeds: msg.embeds
              }).catch(() => {});
              copiedMessagesCount++;
              await sleep(400); // Evitar rate-limits do Discord
            }
          }
        }
      }

      // 8. Auto-cargo Membro em todos os jogadores presentes no destino
      await updateStatus("Atribuindo Cargos", "👥 Atualizando lista de membros e adicionando o cargo 'Membro'...");
      
      let membroRole = Array.from(destGuild.roles.cache.values()).find(r => r.name.toLowerCase() === "membro");
      if (!membroRole) {
        membroRole = await destGuild.roles.create({
          name: "Membro",
          color: "#3498db",
          hoist: true,
          mentionable: true,
          reason: "Cargo de Membro Padrão Aura"
        }).catch(() => null);
      }

      let updatedMembersCount = 0;
      if (membroRole) {
        const members = await destGuild.members.fetch().catch(() => []);
        for (const [id, member] of members) {
          if (!member.user.bot) {
            await member.roles.add(membroRole).catch(() => {});
            updatedMembersCount++;
            await sleep(350);
          }
        }
      }

      // 9. Concluído com Sucesso!
      await updateStatus(
        "Clonagem Concluída!",
        `🎉 **Parabéns! Servidor clonado com sucesso para "${CONFIG.targetServerName}"**\n\n` +
        `📁 **Canais Criados:** ${channelMap.size}\n` +
        `🎨 **Cargos Criados:** ${roleMap.size}\n` +
        `💬 **Mensagens Copiadas:** ${copiedMessagesCount}\n` +
        `👥 **Cargos "Membro" Atribuídos:** ${updatedMembersCount} players`,
        "#00FF00"
      );

    } catch (err) {
      console.error(err);
      await updateStatus("Erro Crítico", `❌ Ocorreu um erro ao processar a clonagem: \`\`\`${err.message}\`\`\``, "#FF0000");
    }
  }
});

// ==========================================
// 🎛️ GERENCIADOR DE INTERAÇÕES (TICKET & FEEDBACK)
// ==========================================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.guild) return;

  // Interação do /painel (Envio do Catálogo)
  if (interaction.isChatInputCommand() && interaction.commandName === "painel") {
    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ Apenas a equipe oficial pode enviar este painel!", ephemeral: true });
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
    return interaction.reply({ content: "✅ Catálogo enviado com sucesso!", ephemeral: true });
  }

  // Interação de Abrir Ticket (Botão)
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
        .setLabel("⭐ Enviar Feedback")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("close")
        .setLabel("🔒 Encerrar Atendimento")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [row] });
    return interaction.reply({ content: `📦 Seu canal de ticket foi criado com sucesso: ${channel}!`, ephemeral: true });
  }

  // Interação para acionar o Feedback (Botão)
  if (interaction.isButton() && interaction.customId === "feedback") {
    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⭐ AVALIAÇÃO DE ATENDIMENTO")
      .setDescription("Escolha a quantidade de estrelas correspondente à sua experiência na Aura Bots Studio:");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("fb1").setLabel("⭐ 1").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("fb2").setLabel("⭐⭐ 2").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("fb3").setLabel("⭐⭐⭐ 3").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("fb4").setLabel("⭐⭐⭐⭐ 4").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("fb5").setLabel("⭐⭐⭐⭐⭐ 5").setStyle(ButtonStyle.Success)
    );

    return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  // Salvar nota de Feedback enviada pelo usuário
  if (interaction.isButton() && interaction.customId.startsWith("fb")) {
    const nota = interaction.customId.replace("fb", "");
    const canal = await interaction.guild.channels.fetch(CONFIG.feedbackChannel).catch(() => null);

    if (canal) {
      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("⭐ NOVO FEEDBACK REGISTRADO")
        .addFields(
          { name: "Usuário", value: `${interaction.user}` },
          { name: "Avaliação", value: `${nota}/5 Estrelas` },
          { name: "Canal do Ticket", value: interaction.channel.name }
        );

      canal.send({ embeds: [embed] });
    }

    return interaction.reply({ content: "✅ Muito obrigado! Seu feedback avaliado foi registrado com sucesso!", ephemeral: true });
  }

  // Interação para Fechar o Ticket
  if (interaction.isButton() && interaction.customId === "close") {
    if (!interaction.member.roles.cache.has(CONFIG.staffRole)) {
      return interaction.reply({ content: "❌ Apenas membros do suporte/staff podem encerrar este ticket!", ephemeral: true });
    }

    await interaction.reply("🔒 Encerramento solicitado. Este canal será excluído permanentemente em 3 segundos...");
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }
});

// Login do Bot
client.login(process.env.TOKEN);
