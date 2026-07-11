/**
 * 🤖 Aura Bots Studio - Discord Bot Script (discord.js v14)
 * 
 * Este é o script completo do bot configurado com os seus IDs personalizados.
 * Ele apaga todos os canais do servidor de destino e recria a estrutura completa 
 * da loja Aura Bots Studio com mensagens profissionais embutidas (embeds).
 * 
 * Requisitos:
 * 1. Node.js v16.9.0 ou superior instalado.
 * 2. Instalar a biblioteca: npm install discord.js dotenv
 * 3. Configurar o Token do seu bot no arquivo .env
 */

const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  Partials, 
  PermissionsBitField,
  ChannelType
} = require("discord.js");
require("dotenv").config();

// Configurações personalizadas enviadas pelo usuário:
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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.GuildMember, Partials.User]
});

client.once("ready", () => {
  console.log(`🤖 Aura Bot está online como ${client.user.tag}!`);
  console.log("👉 Digite '!acriaraura' em qualquer canal de texto para iniciar a reestruturação.");
});

// Evento: Auto-cargo ao entrar novos membros
client.on("guildMemberAdd", async (member) => {
  // Ignorar bots
  if (member.user.bot) return;

  // Verifica se o membro entrou no servidor principal
  if (member.guild.id === CONFIG.serverId) {
    try {
      // 1. Atribui o Auto Role (@Membro / Não Verificado)
      const role = member.guild.roles.cache.get(CONFIG.autoRole);
      if (role) {
        await member.roles.add(role);
        console.log(`🌐 Cargo automático atribuído para ${member.user.tag}`);
      }

      // 2. Envia mensagem de Boas-Vindas no canal especificado
      const channel = member.guild.channels.cache.get(CONFIG.welcomeChannel);
      if (channel) {
        const welcomeEmbed = new EmbedBuilder()
          .setTitle("👋 Bem-vindo(a) ao Aura Bots Studio!")
          .setDescription(`Olá ${member}, bem-vindo à nossa comunidade de desenvolvimento!\n\n🔹 **Leia nossas regras em:** <#regras>\n🔹 **Confira os bots e planos em:** <#catálogo>\n🔹 **Precisa de suporte? Abra um ticket em:** <#abrir-ticket>`)
          .setColor("#a855f7")
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: "Aura Bots Studio • Desenvolvimento Profissional" })
          .setTimestamp();

        await channel.send({ content: `${member}`, embeds: [welcomeEmbed] });
      }
    } catch (err) {
      console.error("Erro no evento guildMemberAdd:", err);
    }
  }
});

// Evento: Comando de Setup para recriar tudo
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Comando de setup
  if (message.content === "!acriaraura") {
    // Verificar se o usuário possui cargo de staff ou administrador
    const hasPermission = message.member.permissions.has(PermissionsBitField.Flags.Administrator) || 
                          message.member.roles.cache.has(CONFIG.staffRole);

    if (!hasPermission) {
      return message.reply("❌ Você não tem permissão para usar este comando de alta segurança.");
    }

    const targetGuild = client.guilds.cache.get(CONFIG.destServerId);
    if (!targetGuild) {
      return message.reply(`❌ Não consegui encontrar o servidor de destino com ID: ${CONFIG.destServerId}. Certifique-se de que o bot foi adicionado a ele primeiro!`);
    }

    try {
      await message.reply(`🛠️ Iniciando reestruturação completa no servidor de destino **${CONFIG.targetServerName}**...`);

      // 1. Atualizar o nome do servidor de destino
      await targetGuild.setName(CONFIG.targetServerName);

      // 2. Apagar absolutamente todos os canais antigos do servidor de destino
      console.log("Limpando canais antigos...");
      const oldChannels = await targetGuild.channels.fetch();
      for (const [id, chan] of oldChannels) {
        if (chan) {
          await chan.delete().catch(e => console.log(`Não pude deletar o canal ${chan.name}: ${e.message}`));
        }
      }

      // 3. Criar a nova estrutura de categorias e canais com destaques e ilustrações
      const categorias = [
        {
          name: "📢・INFORMAÇÕES",
          permissionType: "read-only",
          channels: [
            { name: "👋・boas-vindas", type: ChannelType.GuildText, msgType: "welcome", permissionType: "read-only" },
            { name: "📚・regras", type: ChannelType.GuildText, msgType: "rules", permissionType: "read-only" },
            { name: "📢・anúncios", type: ChannelType.GuildText, msgType: "anuncios", permissionType: "read-only" },
            { name: "✨・novidades", type: ChannelType.GuildText, msgType: "novidades", permissionType: "read-only" },
            { name: "⚙️・changelog", type: ChannelType.GuildText, msgType: "changelog", permissionType: "read-only" },
            { name: "🎉・sorteios", type: ChannelType.GuildText, msgType: "sorteios", permissionType: "read-only" },
            { name: "❓・faq", type: ChannelType.GuildText, msgType: "faq", permissionType: "read-only" }
          ]
        },
        {
          name: "🛒・LOJA OFICIAL",
          permissionType: "read-only",
          channels: [
            { name: "🛍️・catálogo", type: ChannelType.GuildText, msgType: "sales", permissionType: "read-only" },
            { name: "📦・preços", type: ChannelType.GuildText, msgType: "prices", permissionType: "read-only" },
            { name: "🤖・bots-disponíveis", type: ChannelType.GuildText, msgType: "bots_disponiveis", permissionType: "read-only" },
            { name: "💎・planos", type: ChannelType.GuildText, msgType: "planos", permissionType: "read-only" },
            { name: "🔥・promoções", type: ChannelType.GuildText, msgType: "promocoes", permissionType: "read-only" },
            { name: "💳・formas-de-pagamento", type: ChannelType.GuildText, msgType: "formas_pagamento", permissionType: "read-only" }
          ]
        },
        {
          name: "🧪・TESTES DE BOTS",
          permissionType: "write",
          channels: [
            { name: "🧪・teste-bot-1", type: ChannelType.GuildText, msgType: "teste_bot_1", permissionType: "write" },
            { name: "🧪・teste-bot-2", type: ChannelType.GuildText, msgType: "teste_bot_2", permissionType: "write" },
            { name: "🧪・teste-bot-3", type: ChannelType.GuildText, msgType: "teste_bot_3", permissionType: "write" },
            { name: "🧪・teste-bot-4", type: ChannelType.GuildText, msgType: "teste_bot_4", permissionType: "write" },
            { name: "🧪・teste-bot-5", type: ChannelType.GuildText, msgType: "teste_bot_5", permissionType: "write" },
            { name: "🧱・sandbox", type: ChannelType.GuildText, msgType: "sandbox", permissionType: "write" },
            { name: "💬・feedback", type: ChannelType.GuildText, msgType: "feedback", permissionType: "write" },
            { name: "⭐・avaliações", type: ChannelType.GuildText, msgType: "avaliacoes", permissionType: "write" }
          ]
        },
        {
          name: "🎫・CENTRAL DE SUPORTE",
          permissionType: "read-only",
          channels: [
            { name: "🎫・abrir-ticket", type: ChannelType.GuildText, msgType: "ticket_central", permissionType: "ticket-central" }
          ]
        },
        {
          name: "💬・CONVERSAS & INTERAÇÃO",
          permissionType: "write",
          channels: [
            { name: "💬・chat-geral", type: ChannelType.GuildText, msgType: "general", permissionType: "write" },
            { name: "🤪・memes", type: ChannelType.GuildText, msgType: "memes", permissionType: "write" },
            { name: "📸・prints", type: ChannelType.GuildText, msgType: "prints", permissionType: "write" },
            { name: "🎮・games", type: ChannelType.GuildText, msgType: "games", permissionType: "write" },
            { name: "⌨️・comandos", type: ChannelType.GuildText, msgType: "comandos", permissionType: "write" }
          ]
        },
        {
          name: "💻・DESENVOLVIMENTO",
          permissionType: "staff-only",
          channels: [
            { name: "💻・projetos", type: ChannelType.GuildText, msgType: "projetos", permissionType: "staff-only" },
            { name: "📋・tarefas", type: ChannelType.GuildText, msgType: "tarefas", permissionType: "staff-only" },
            { name: "🪲・bugs", type: ChannelType.GuildText, msgType: "bugs", permissionType: "staff-only" },
            { name: "💡・ideias", type: ChannelType.GuildText, msgType: "ideias", permissionType: "write" },
            { name: "⚙️・scripts", type: ChannelType.GuildText, msgType: "scripts", permissionType: "staff-only" }
          ]
        },
        {
          name: "🤝・PARCERIAS",
          permissionType: "read-only",
          channels: [
            { name: "🤝・parcerias", type: ChannelType.GuildText, msgType: "parcerias", permissionType: "read-only" },
            { name: "📢・divulgação", type: ChannelType.GuildText, msgType: "divulgacao", permissionType: "read-only" }
          ]
        },
        {
          name: "🔒・STAFF INTERNO",
          permissionType: "staff-only",
          channels: [
            { name: "💬・staff-chat", type: ChannelType.GuildText, msgType: "staff_chat", permissionType: "staff-only" },
            { name: "🛡️・logs", type: ChannelType.GuildText, msgType: "logs", permissionType: "staff-only" },
            { name: "🚨・denúncias", type: ChannelType.GuildText, msgType: "denuncias", permissionType: "staff-only" },
            { name: "🎙️・reuniões", type: ChannelType.GuildText, msgType: "reunioes", permissionType: "staff-only" },
            { name: "💳・vendas-staff", type: ChannelType.GuildText, msgType: "vendas_staff", permissionType: "staff-only" }
          ]
        }
      ];

      for (const cat of categorias) {
        // Configurar permissões da categoria
        const categoryOverwrites = [
          {
            id: targetGuild.roles.everyone.id,
            deny: cat.permissionType === "staff-only" ? [PermissionsBitField.Flags.ViewChannel] : [],
            allow: cat.permissionType === "staff-only" ? [] : [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
          }
        ];

        if (CONFIG.staffRole) {
          categoryOverwrites.push({
            id: CONFIG.staffRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
              PermissionsBitField.Flags.EmbedLinks,
              PermissionsBitField.Flags.AttachFiles
            ],
            deny: []
          });
        }

        // Criar categoria principal
        const createdCategory = await targetGuild.channels.create({
          name: cat.name,
          type: ChannelType.GuildCategory,
          permissionOverwrites: categoryOverwrites
        });

        // Criar subcanais de texto dentro da categoria
        for (const chan of cat.channels) {
          let chanOverwrites = [];

          if (chan.permissionType === "read-only") {
            chanOverwrites = [
              {
                id: targetGuild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.SendMessages],
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
              }
            ];
            if (CONFIG.staffRole) {
              chanOverwrites.push({
                id: CONFIG.staffRole,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.ReadMessageHistory,
                  PermissionsBitField.Flags.EmbedLinks,
                  PermissionsBitField.Flags.AttachFiles
                ]
              });
            }
          } else if (chan.permissionType === "write") {
            chanOverwrites = [
              {
                id: targetGuild.roles.everyone.id,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.ReadMessageHistory,
                  PermissionsBitField.Flags.EmbedLinks,
                  PermissionsBitField.Flags.AttachFiles,
                  PermissionsBitField.Flags.UseExternalEmojis,
                  PermissionsBitField.Flags.AddReactions
                ],
                deny: []
              }
            ];
            if (CONFIG.staffRole) {
              chanOverwrites.push({
                id: CONFIG.staffRole,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.ReadMessageHistory,
                  PermissionsBitField.Flags.EmbedLinks,
                  PermissionsBitField.Flags.AttachFiles,
                  PermissionsBitField.Flags.ManageMessages
                ]
              });
            }
          } else if (chan.permissionType === "staff-only") {
            chanOverwrites = [
              {
                id: targetGuild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
              }
            ];
            if (CONFIG.staffRole) {
              chanOverwrites.push({
                id: CONFIG.staffRole,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.ReadMessageHistory,
                  PermissionsBitField.Flags.EmbedLinks,
                  PermissionsBitField.Flags.AttachFiles,
                  PermissionsBitField.Flags.ManageMessages
                ]
              });
            }
          } else if (chan.permissionType === "ticket-central") {
            chanOverwrites = [
              {
                id: targetGuild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.SendMessages],
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.ReadMessageHistory,
                  PermissionsBitField.Flags.AddReactions
                ]
              }
            ];
            if (CONFIG.staffRole) {
              chanOverwrites.push({
                id: CONFIG.staffRole,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.ReadMessageHistory,
                  PermissionsBitField.Flags.EmbedLinks,
                  PermissionsBitField.Flags.AttachFiles
                ]
              });
            }
          }

          const createdChan = await targetGuild.channels.create({
            name: chan.name,
            type: chan.type,
            parent: createdCategory.id,
            permissionOverwrites: chanOverwrites
          });

          // Enviar mensagens iniciais formatadas e embeds destacados
          if (chan.msgType === "welcome") {
            const embedWelcome = new EmbedBuilder()
              .setTitle("👋 **BEM-VINDO AO AURA BOTS STUDIO** 👋")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🌟 **Olá! Seja muito bem-vindo à nossa comunidade oficial!**\nAqui você encontrará as melhores soluções de automação e inteligência artificial para o seu servidor Discord.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔹 **Comece por aqui:**\n• Leia nossas diretrizes em: <#regras>\n• Acesse nosso catálogo oficial em: <#catálogo>\n• Peça ajuda ou faça orçamentos em: <#abrir-ticket>\n\n🚀 **Nosso Objetivo:** Unir tecnologia de ponta, estabilidade 24/7 e suporte VIP de alta qualidade.")
              .setColor("#a855f7")
              .setImage("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80")
              .setFooter({ text: "Aura Bots Studio • Tecnologia Virtual de Ponta" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedWelcome] });
          } 
          else if (chan.msgType === "rules") {
            const embedRegras = new EmbedBuilder()
              .setTitle("👑 **DIRETRIZES DA COMUNIDADE - AURA BOTS STUDIO** 👑")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🌟 **Seja muito bem-vindo!** Leia atentamente as nossas regras oficiais para manter a ordem e garantir um suporte de altíssima qualidade.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#a855f7")
              .addFields(
                { name: "1️⃣・**RESPEITO EM PRIMEIRO LUGAR**", value: "• É obrigatório tratar todos com o máximo de cordialidade.\n• **Proibido** insultos, discursos de ódio ou comportamentos tóxicos." },
                { name: "2️⃣・**SEM SPAM OU DIVULGAÇÃO (DM/CHAT)**", value: "• **Proibido** enviar convites de servidores ou links externos sem autorização.\n• **Punição imediata** para quem fizer flood ou importunar membros no privado." },
                { name: "3️⃣・**ATENDIMENTO EXCLUSIVO VIA TICKET**", value: "• Para suporte técnico ou compras, use sempre o canal de ticket.\n• **Não marque** a diretoria ou desenvolvedores no privado." },
                { name: "4️⃣・**USO ADEQUADO DOS CANAIS**", value: "• Cada canal tem um propósito único. Use os chats adequados para conversas e comandos." },
                { name: "5️⃣・**PROTEÇÃO & SEGURANÇA GERAL**", value: "• Qualquer abuso de bugs ou de comandos de nossos bots resultará em **banimento permanente**." }
              )
              .setFooter({ text: "🔒 Aura Bots Studio • Segurança & Tecnologia Garantida" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedRegras] });
          } 
          else if (chan.msgType === "anuncios") {
            const embedAnuncio = new EmbedBuilder()
              .setTitle("📢 **ANÚNCIO OFICIAL - INTEGRAÇÃO GEMINI AI** 🧠")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFala rapaziada! Estamos lançando oficialmente nosso novo bot integrado ao **Gemini AI**! Agora você pode ter uma inteligência artificial completa que conversa, resume discussões, cria eventos e tira dúvidas de código em tempo real no Discord.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✨ **PLANO DISPONÍVEL:** Já configurado no canal <#catálogo>.\n🎁 **Sandbox Ativa:** Clientes Premium têm acesso exclusivo em <#sandbox> para testar os prompts.")
              .setColor("#3b82f6")
              .setFooter({ text: "Aura Bots Studio • Inteligência Artificial Integrada" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedAnuncio] });
          }
          else if (chan.msgType === "novidades") {
            const embedNovidades = new EmbedBuilder()
              .setTitle("🚀 **NOVIDADES INCRÍVEIS - CLOUD UPGRADE** ⚡")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFechamos uma nova parceria estratégica de infraestrutura em nuvem de altíssima performance!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Estabilidade Absoluta:** Nossos bots agora rodam com 99.9% de uptime.\n• **Ping Reduzido:** Latência média inferior a **15ms** em servidores sul-americanos.\n• **Mais Velocidade:** Respostas instantâneas para comandos complexos!")
              .setColor("#a855f7")
              .setFooter({ text: "Aura Bots Studio • Tecnologia e Infraestrutura" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedNovidades] });
          }
          else if (chan.msgType === "changelog") {
            const embedChangelog = new EmbedBuilder()
              .setTitle("⚙️ **CHANGELOG - Aura Ticket Bot v2.4.1** ⚙️")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🛠️ **MELHORIAS E ATUALIZAÇÕES DA SEMANA:**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Correção de Bugs:** Resolvido o erro onde o arquivo de transcrição em HTML ficava vazio.\n• **Multi-Painéis:** Agora com suporte para múltiplos painéis de atendimento em canais separados.\n• **Segurança:** Implementamos limite de tickets ativos por usuário para evitar spam.\n• **Performance:** Otimização geral no tempo de carregamento do bot em **40%**.")
              .setColor("#10b981")
              .setFooter({ text: "Aura Bots Studio • Desenvolvimento e Updates" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedChangelog] });
          }
          else if (chan.msgType === "sorteios") {
            const embedSorteio = new EmbedBuilder()
              .setTitle("🎉 **RESULTADO DO SORTEIO ESPECIAL** 🎉")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nParabéns aos grandes vencedores do nosso sorteio mensal de aniversário!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n👑 **Ganhadores (1 Mês de Combo Premium 💎 Grátis):**\n• @LucasGamer#9901\n• @JuliaDev#4421\n\n🔔 **Instruções:** Abram um ticket privado em <#abrir-ticket> para resgatar sua assinatura dentro do prazo de **48 horas**!")
              .setColor("#fb923c")
              .setFooter({ text: "Aura Bots Studio • Eventos & Sorteios" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedSorteio] });
          }
          else if (chan.msgType === "faq") {
            const embedFaq = new EmbedBuilder()
              .setTitle("❓ **CENTRAL DE DÚVIDAS FREQUENTES (FAQ)** ❓")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 **Como funcionam os bots?**\n• *Nossos bots operam 24/7 de forma 100% autônoma. A configuração é feita de forma simples e intuitiva via painel.*\n\n📌 **Consigo alterar o nome e foto do bot?**\n• *Sim! No plano personalizado ou no Combo Premium, o bot é totalmente moldado com a sua própria marca e identidade visual.*\n\n📌 **Quais as formas de pagamento aceitas?**\n• *Aceitamos PIX, Cartão de Crédito e Boleto. Para conferir os detalhes de taxas e descontos, leia <#formas-de-pagamento>.*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#06b6d4")
              .setFooter({ text: "Aura Bots Studio • Central de Ajuda" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedFaq] });
          }
          else if (chan.msgType === "sales") {
            const embedVendas = new EmbedBuilder()
              .setTitle("💎 **CATÁLOGO OFICIAL - AURA BOTS STUDIO** 💎")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🚀 **Adquira os melhores bots para a sua comunidade!** Nossos sistemas funcionam **24/7 hospedados em servidores de ponta**, garantindo 100% de estabilidade!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#facc15")
              .addFields(
                { name: "🎫・**AURA TICKET BOT**", value: "• Atendimento dinâmico com **botões integrados**\n• Transcrições de conversas salvas em **HTML**\n• Painel de controle completo\n• 📦 **Valor: R$ 19,00/mês**" },
                { name: "🛡️・**AURA MODERADOR PRO**", value: "• Sistema robusto de **antiraid & anti-link**\n• Logs detalhados de todas as ações de membros\n• Verificação para evitar contas falsas\n• 📦 **Valor: R$ 25,00/mês**" },
                { name: "🎰・**AURA ECONOMIA & CASSINO**", value: "• Moeda própria com mini-jogos exclusivos\n• Rankings globais e sistema de níveis (XP)\n• Loja para resgatar cargos no servidor\n• 📦 **Valor: R$ 29,00/mês**" },
                { name: "🧠・**AURA GEMINI AI**", value: "• Inteligência Artificial integrada ao chat\n• Responde dúvidas e ajuda na programação\n• 📦 **Valor: R$ 39,00/mês**" },
                { name: "🌟・**COMBO SUPREMO PREMIUM (💎)**", value: "• 🔥 **Leve todos os nossos bots integrados em um único pacote!**\n• Suporte prioritário 24 horas + Hospedagem Premium inclusa de graça\n• 💰 **De R$ 112,00 por APENAS R$ 59,00/mês!**" }
              )
              .setFooter({ text: "Para adquirir, abra um ticket em #abrir-ticket!" });

            await createdChan.send({ embeds: [embedVendas] });
          }
          else if (chan.msgType === "prices") {
            const embedPrecos = new EmbedBuilder()
              .setTitle("💎 **AURA BOTS STUDIO - TABELA DE PREÇOS** 💎")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 **BOT BÁSICO** — **R$ 15,00/mês**\n• Comandos essenciais e estáveis\n• Bot leve, rápido e com hospedagem inclusa\n\n📌 **BOT PERSONALIZADO** — **R$ 50,00/mês**\n• Sistemas sob medida (Sua ideia vira realidade)\n• Funções exclusivas & API de dados personalizada\n\n📌 **BOT ENTERPRISE** — **R$ 120,00/mês**\n• Integrações completas com painéis ou servidores externos\n• Automação avançada para grandes comunidades virtuais\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⚡ **INFORMAÇÕES ADICIONAIS:**\n✔ **Entrega Expressa:** Configuração em tempo recorde\n✔ **Suporte Premium:** Equipe pronta para te ajudar 24/7\n\n🎫 Para fazer seu pedido, abra um canal de ticket!")
              .setColor("#a855f7")
              .setFooter({ text: "Aura Bots Studio • Orçamentos via Ticket" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedPrecos] });
          }
          else if (chan.msgType === "bots_disponiveis") {
            const embedBots = new EmbedBuilder()
              .setTitle("🟢 **CONEXÃO E LATÊNCIA DOS BOTS OFICIAIS** 🟢")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🤖 `[ONLINE]` **Aura Ticket Bot#1001** (Atendimento Automatizado)\n🤖 `[ONLINE]` **Aura Moderador Bot#1002** (Segurança & Antiraid)\n🤖 `[ONLINE]` **Aura Casino Bot#1003** (Economia & Entretenimento)\n🤖 `[ONLINE]` **Aura Gemini AI Bot#1004** (Inteligência Artificial)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🌍 **Servidores de Hospedagem:** América do Sul (Latência ultra-baixa de **12ms**)\n🛡️ **Mecanismo de Proteção:** Ativo contra ataques DDoS e quedas inesperadas!")
              .setColor("#10b981")
              .setFooter({ text: "Aura Bots Studio • Status de Sistemas" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedBots] });
          }
          else if (chan.msgType === "planos") {
            const embedPlanos = new EmbedBuilder()
              .setTitle("📦 **PLANOS DE ASSINATURA EXCLUSIVOS** 📦")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• 📅 **Plano Mensal:** **R$ 59,00/mês** (Renovação simples sem fidelidade)\n• 🌟 **Plano Semestral:** **R$ 299,00** (Economize R$ 55,00 + Receba suporte VIP priorizado)\n• 👑 **Plano Anual:** **R$ 499,00** (Economize R$ 209,00 + Ganhe acesso vitalício ao grupo de testes de novos bots!)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💡 *Todos os planos acima já acompanham hospedagem cloud grátis inclusa no valor.*")
              .setColor("#6366f1")
              .setFooter({ text: "Aura Bots Studio • Adquira já o seu!" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedPlanos] });
          }
          else if (chan.msgType === "promocoes") {
            const embedPromo = new EmbedBuilder()
              .setTitle("🔥 **CAMPANHA DE DESCONTO IMEDIATO** 🔥")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAdquirindo qualquer bot hoje, você ganha **15 dias de licença grátis adicionais** no seu primeiro mês!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔑 Use o cupom **AURAFIRST15** ao iniciar o seu atendimento privado em <#abrir-ticket> para validar o benefício.")
              .setColor("#ef4444")
              .setFooter({ text: "Aura Bots Studio • Promoções Ativas" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedPromo] });
          }
          else if (chan.msgType === "formas_pagamento") {
            const embedPags = new EmbedBuilder()
              .setTitle("💳 **MÉTODOS DE PAGAMENTO SEGUROS** 💳")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⚡ **PIX:** QR Code gerado instantaneamente no ticket. A liberação do bot ocorre de forma **automática em menos de 1 minuto**.\n💳 **Cartão de Crédito:** Parcelamento disponível via Mercado Pago ou Stripe.\n🏦 **Boleto Bancário:** Compensação e ativação em até 1 dia útil.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🧾 *Enviamos o recibo e detalhes da licença diretamente para o seu e-mail cadastrado.*")
              .setColor("#10b981")
              .setFooter({ text: "Aura Bots Studio • Financeiro Seguro" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedPags] });
          }
          else if (chan.msgType === "teste_bot_1") {
            const embedT1 = new EmbedBuilder()
              .setTitle("🎫 **Aura Ticket Bot • TESTE ATIVO** 🎫")
              .setDescription("Este canal simula o funcionamento do nosso renomado bot de atendimento.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Ação:** Criação de canal privado solicitada com sucesso por um membro.\n• **Status:** O seu ticket de teste está pronto em <#abrir-ticket>!\n\n*Clique no botão correspondente no canal para iniciar seu chat privativo.*")
              .setColor("#ec4899")
              .setFooter({ text: "Aura Bots Studio • Canal de Teste 1" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedT1] });
          }
          else if (chan.msgType === "teste_bot_2") {
            const embedT2 = new EmbedBuilder()
              .setTitle("🛡️ **Aura Moderador Pro • MÓDULO DE SEGURANÇA** 🛡️")
              .setDescription("Este canal simula o funcionamento do bot de segurança e moderação.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**USUÁRIO @Troll123 PUNIDO COM SUCESSO!**\n\n• **Punição aplicada:** Banimento Permanente\n• **Motivo apresentado:** Envio consecutivo de mensagens e links suspeitos\n• **Aplicado por:** @JuliaDev#4421\n\n*Logs de auditoria atualizados para consulta da Staff no canal interno.*")
              .setColor("#f43f5e")
              .setFooter({ text: "Aura Bots Studio • Canal de Teste 2" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedT2] });
          }
          else if (chan.msgType === "teste_bot_3") {
            const embedT3 = new EmbedBuilder()
              .setTitle("🎰 **Aura Economia & Cassino • MINI-GAME ATIVO** 🎰")
              .setDescription("Este canal simula o bot de entretenimento e apostas para engajamento.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**@LucasGamer#9901** girou os tambores da roleta virtual e...\n\n🎉 **RESULTADO: VITÓRIA SUPREMA!** 🎉\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **Moedas Apostadas:** 1.000 moedas 🪙\n• **Multiplicador Sorteado:** 3x\n• **Moedas Recebidas:** **+ 3.000 moedas 🪙**\n\n*Consulte seu saldo total digitando `!perfil` ou resgate seu bônus diário com `!daily`.*")
              .setColor("#eab308")
              .setFooter({ text: "Aura Bots Studio • Canal de Teste 3" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedT3] });
          }
          else if (chan.msgType === "teste_bot_4") {
            const embedT4 = new EmbedBuilder()
              .setTitle("🧠 **Aura Gemini AI Bot • MODELO ATIVO** 🧠")
              .setDescription("Este canal simula o bot integrado com Inteligência Artificial Gemini.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**DevCarlos#777:** `!gemini O que é o Aura Bots Studio?`\n\n**RESPOSTA DA IA:**\nOlá **@DevCarlos#777**! A **Aura Bots Studio** é uma desenvolvedora de ponta focada em criar sistemas de automação integrados e bots sob medida para o Discord.\n\n• **Diferenciais:** Nossos bots utilizam **Gemini AI**, hospedagem 24/7 com latência de **12ms** e atendimento profissional via <#abrir-ticket>!")
              .setColor("#8b5cf6")
              .setFooter({ text: "Aura Bots Studio • Canal de Teste 4" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedT4] });
          }
          else if (chan.msgType === "teste_bot_5") {
            const embedT5 = new EmbedBuilder()
              .setTitle("🤖 **Aura Bot • PAINEL DE AJUDA DO SISTEMA** 🤖")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOlá! Aqui estão os comandos mais usados disponíveis para testes neste canal:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• `!ticket` - Demonstração do sistema de atendimento em <#abrir-ticket>\n• `!ban @membro` - Demonstração do comando de moderação segura\n• `!roleta <valor>` - Demonstração do mini-game de apostas de moedas\n• `!gemini <pergunta>` - Faz uma pergunta inteligente para a IA")
              .setColor("#db2777")
              .setFooter({ text: "Aura Bots Studio • Canal de Teste 5" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedT5] });
          }
          else if (chan.msgType === "sandbox") {
            const embedSandbox = new EmbedBuilder()
              .setTitle("🧪 **AMBIENTE DE TESTES (SANDBOX)** 🧪")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nBem-vindo ao laboratório de testes oficial!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Livre para Testes:** Digite comandos dos nossos bots à vontade.\n• **Suporte Multilinguagem:** Teste respostas de IA e comandos de moderação.\n• **Ambiente Isolado:** Sem poluir os outros canais principais do servidor.")
              .setColor("#4b5563")
              .setFooter({ text: "Aura Bots Studio • Sandbox de Desenvolvedor" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedSandbox] });
          }
          else if (chan.msgType === "feedback") {
            const embedFeed = new EmbedBuilder()
              .setTitle("⭐ **DEPOIMENTOS DE CLIENTES SATISFEITOS** ⭐")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **Produto:** Aura Ticket Bot (🎫)\n• **Nota do Suporte:** 5/5 ⭐⭐⭐⭐⭐\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**Depoimento:** \n\"O sistema de suporte por botões é incrível! O bot cria os canais instantaneamente e as transcrições das conversas em HTML me ajudam a manter tudo registrado. Recomendo muito!\"\n\n*— Enviado por Marcos#8812*")
              .setColor("#f59e0b")
              .setFooter({ text: "Aura Bots Studio • Feedbacks Verificados" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedFeed] });
          }
          else if (chan.msgType === "avaliacoes") {
            const embedAv = new EmbedBuilder()
              .setTitle("👑 **AVALIAÇÕES DE COMPRA** 👑")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **Produto:** Combo Supremo Anual (💎)\n• **Nota da Hospedagem:** 5/5 ⭐⭐⭐⭐⭐\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**Depoimento:** \n\"Nossos bots estão rodando 24/7 sem nenhuma queda. O ping é extremamente baixo e o suporte técnico nos ajudou a configurar tudo em menos de 10 minutos! Nota 10!\"\n\n*— Enviada por SofiaDev#0091*")
              .setColor("#eab308")
              .setFooter({ text: "Aura Bots Studio • Avaliações Ativas" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedAv] });
          }
          else if (chan.msgType === "ticket_central") {
            const embedTicket = new EmbedBuilder()
              .setTitle("🎫 **CENTRAL DE ATENDIMENTO E SUPORTE** 🎫")
              .setDescription("Precisa comprar um bot ou falar com nossa equipe de suporte? Abra um ticket privado clicando no botão verde abaixo!\n\n🕒 **Horário de Funcionamento:**\n• Segunda a Sábado: **09:00 às 22:00**\n• Domingo: **Plantão de urgências**\n\n*Clique abaixo para iniciar seu atendimento personalizado com o Aura Bot.*")
              .setColor("#34d399")
              .setFooter({ text: "Aura Bots Studio • Atendimento VIP" });

            await createdChan.send({ embeds: [embedTicket] });
          }
          else if (chan.msgType === "general") {
            const embedGen = new EmbedBuilder()
              .setTitle("💬 **BATE-PAPO OFICIAL • CANAL GERAL** 💬")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nEste é o canal principal para conversas gerais da nossa comunidade. Sinta-se livre para interagir com outros membros!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Networking:** Troque experiências sobre desenvolvimento e Discord.\n• **Respeito:** Mantenha um ambiente saudável.\n• **Catálogo:** Conheça nossa loja em <#catálogo>!\n\n*Seja muito bem-vindo e aproveite o bate-papo!*")
              .setColor("#3b82f6")
              .setFooter({ text: "Aura Bots Studio • Chat Geral" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedGen] });
          }
          else if (chan.msgType === "memes") {
            const embedMemes = new EmbedBuilder()
              .setTitle("🤪 **MEMES E DESCONTRAÇÃO** 🤪")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nEspaço reservado para o compartilhamento de imagens engraçadas, piadas de programação e diversão geral.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Evite Flood:** Envie memes com moderação.\n• **Regras:** Sem conteúdos ofensivos, preconceituosos ou NSFW.\n• **Compartilhe:** Envie aquele meme de código clássico de sexta-feira!")
              .setColor("#ec4899")
              .setFooter({ text: "Aura Bots Studio • Espaço Memes" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedMemes] });
          }
          else if (chan.msgType === "prints") {
            const embedPrints = new EmbedBuilder()
              .setTitle("📸 **GALERIA DE IMAGENS & PRINTS** 📸")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nMostre capturas de tela dos seus servidores, setups de bots ou customizações de canais que você desenvolveu!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Feedback:** Peça a opinião da comunidade sobre seu design.\n• **Dica:** Divulgue as interfaces fantásticas dos bots que você comprou conosco!")
              .setColor("#8b5cf6")
              .setFooter({ text: "Aura Bots Studio • Galeria de Imagens" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedPrints] });
          }
          else if (chan.msgType === "games") {
            const embedGames = new EmbedBuilder()
              .setTitle("🎮 **LOBBY DE JOGOS & GAMES** 🎮")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nEncontre companheiros de jogo, divulgue seu nick ou convide pessoas para chamadas nos nossos canais de voz!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **LFG:** Buscando grupo para jogar agora? Escreva aqui!\n• **Comunidade:** Valorant, League of Legends, CS2, Minecraft e muito mais.")
              .setColor("#10b981")
              .setFooter({ text: "Aura Bots Studio • Lobby de Games" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedGames] });
          }
          else if (chan.msgType === "comandos") {
            const embedComando = new EmbedBuilder()
              .setTitle("⌨️ **GUIA DE COMANDOS PÚBLICOS DISPONÍVEIS** ⌨️")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nInteraja com nossos bots utilizando estes comandos rápidos:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• `!ping` - Retorna o tempo de resposta do bot (latência atual)\n• `!perfil` - Exibe o seu nível de XP atual e saldo de moedas no Cassino\n• `!daily` - Resgata a recompensa diária de moedas gratuitas\n• `!status` - Exibe informações de estabilidade e ping dos servidores de hospedagem")
              .setColor("#6b7280")
              .setFooter({ text: "Aura Bots Studio • Central de Comandos" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedComando] });
          }
          else if (chan.msgType === "projetos") {
            const embedProj = new EmbedBuilder()
              .setTitle("💻 **PLANEJAMENTO DE PROJETOS OFICIAIS** 💻")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• 🛡️ **Aura Moderador Pro v3.0:** Desenvolvimento de IA para detecção inteligente de spams em imagens.\n• 🎫 **Aura Ticket Bot v3.0:** Integração com login Discord OAuth para gerenciamento 100% web.\n• 🧠 **Aura Gemini AI v1.2:** Automatização de respostas frequentes enviadas em canais públicos.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#ef4444")
              .setFooter({ text: "🔒 Staff Only • Projetos em Andamento" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedProj] });
          }
          else if (chan.msgType === "tarefas") {
            const embedTar = new EmbedBuilder()
              .setTitle("📋 **QUADRO DE TAREFAS ATIVAS DA EQUIPE** 📋")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• 🟥 **Alta Prioridade:** Corrigir redirecionamento de webhook na integração do Mercado Pago.\n• 🟨 **Média Prioridade:** Finalizar a tradução dos painéis de economia e mini-jogos.\n• 🟩 **Baixa Prioridade:** Otimizar e atualizar os emojis personalizados dos embeds de suporte.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#f59e0b")
              .setFooter({ text: "🔒 Staff Only • Painel de Controle de Tarefas" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedTar] });
          }
          else if (chan.msgType === "bugs") {
            const embedBug = new EmbedBuilder()
              .setTitle("🪲 **LOG DE CORREÇÃO DE BUGS INTERNOS** 🪲")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **ID do Bug:** #AURA-0091\n• **Bot afetado:** Aura Economia & Cassino\n• **Descrição:** Erro de estouro numérico ao apostar mais de 10 bilhões de moedas de uma vez só na roleta.\n• **Status:** **[RESOLVIDO]** na atualização v2.1.2. Limite máximo de aposta definido.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#ef4444")
              .setFooter({ text: "🔒 Staff Only • Gestão de Incidentes" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedBug] });
          }
          else if (chan.msgType === "ideias") {
            const embedId = new EmbedBuilder()
              .setTitle("💡 **SUGESTÃO DE IDEIA - NOVO BOT** 💡")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **Proposta:** Aura Music Bot (🎙️)\n• **Função:** Tocar músicas em alta definição de plataformas como Spotify e YouTube diretamente nos canais de voz, com painel completo de botões de controle.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n*Os clientes estão pedindo muito essa integração! Deixe seu feedback ou nova ideia abaixo.*")
              .setColor("#06b6d4")
              .setFooter({ text: "Aura Bots Studio • Canal de Sugestões de Ideias" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedId] });
          }
          else if (chan.msgType === "scripts") {
            const embedScr = new EmbedBuilder()
              .setTitle("⚙️ **CONTAINER DOCKER DE CONFIGURAÇÃO DE BOTS** ⚙️")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSe você deseja realizar a configuração local (self-hosted) do seu bot Aura, utilize o comando Docker abaixo:\\n\\n\`\`\`bash\\ndocker run -d \\\\\\n  --name aura-ticket-bot \\\\\\n  -e TOKEN=\\\"MOCK_DISCORD_TOKEN_XYZ\\\" \\\\\\n  -e MONGODB_URI=\\\"mongodb://localhost:27017/aura\\\" \\\\\\n  aurabots/ticket-bot:latest\\n\`\`\`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#1f2937")
              .setFooter({ text: "🔒 Staff Only • Scripts de Infraestrutura" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedScr] });
          }
          else if (chan.msgType === "parcerias") {
            const embedParcerias = new EmbedBuilder()
              .setTitle("🤝 **DIRETRIZES DE PARCERIAS OFICIAIS** 🤝")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nQuer se tornar um parceiro oficial da **Aura Bots Studio**? Atenda aos requisitos mínimos:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Servidores Discord:** Mínimo de **500 membros ativos** e engajados.\n• **YouTube / Twitch:** Mínimo de **2.000 inscritos/seguidores** dedicados à tecnologia ou games.\n\n*Caso o seu canal atenda aos requisitos, abra um ticket privado de atendimento em <#abrir-ticket> para negociar!*")
              .setColor("#6366f1")
              .setFooter({ text: "Aura Bots Studio • Parcerias & Integrações" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedParcerias] });
          }
          else if (chan.msgType === "divulgacao") {
            const embedDiv = new EmbedBuilder()
              .setTitle("📢 **DIVULGAÇÃO DE PARCEIROS CERTIFICADOS** 📢")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nConheça e apoie as comunidades parceiras oficiais da Aura Bots Studio:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• 🎮 **União Gamer Brasil:** A maior comunidade de jogos eletrônicos competitivos do país.\n• 💻 **Devs do Futuro:** Grupo focado em estudos de novas tecnologias e cursos de programação 100% gratuitos.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n*Apoiamos o crescimento de comunidades saudáveis e profissionais!*")
              .setColor("#ec4899")
              .setFooter({ text: "Aura Bots Studio • Parcerias Oficiais" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedDiv] });
          }
          else if (chan.msgType === "staff_chat") {
            const embedStc = new EmbedBuilder()
              .setTitle("🔒 **CHAT INTERNO DA STAFF (STAFF ONLY)** 🔒")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCanal de comunicação restrito para administradores, moderadores e desenvolvedores do Aura Bots Studio.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• **Privacidade:** Todos os assuntos tratados aqui devem permanecer em sigilo.\n• **Colaboração:** Use para alinhar ideias, debater denúncias e definir cronogramas.\n\n*Obrigado pelo seu empenho diário em manter nosso estúdio no topo!*")
              .setColor("#6366f1")
              .setFooter({ text: "🔒 Staff Only • Chat Exclusivo" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedStc] });
          }
          else if (chan.msgType === "logs") {
            const embedLogs = new EmbedBuilder()
              .setTitle("🛡️ **REGISTRO DE LOGS DE SEGURANÇA (AUDITORIA)** 🛡️")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **Ação:** Novo canal de texto <#bugs> foi criado por @Alice (Dev).\n• **Ação:** Cargo **[Moderador]** concedido com sucesso para @Carol por @Jones (Fundador).\n• **Ação:** Reinicialização e sincronização do banco de dados na nuvem executada com sucesso.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#1f2937")
              .setFooter({ text: "🔒 Staff Only • Logs do Servidor" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedLogs] });
          }
          else if (chan.msgType === "denuncias") {
            const embedDen = new EmbedBuilder()
              .setTitle("🚨 **RELATÓRIO DE DENÚNCIA RECEBIDA** 🚨")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **Membro denunciante:** @LucasGamer#9901\n• **Usuário acusado:** @Invasor441\n• **Motivo da denúncia:** Envio em massa de spam com links maliciosos via DM privada.\n• **Veredito da Staff:** **[BANNED]** Banimento definitivo aplicado por @Alek (Sócio).\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#ef4444")
              .setFooter({ text: "🔒 Staff Only • Central de Denúncias" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedDen] });
          }
          else if (chan.msgType === "reunioes") {
            const embedReun = new EmbedBuilder()
              .setTitle("🎙️ **ATA RESUMIDA DA ÚLTIMA REUNIÃO DA DIRETORIA** 🎙️")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **Ponto 1:** Contratação de nova infraestrutura cloud para reduzir latência sul-americana para **12ms**.\n• **Ponto 2:** Lançamento oficial do Aura Music Bot programado com sucesso para o próximo mês.\n• **Ponto 3:** Disponibilização de cupons promocionais especiais de até 15% de desconto para fomento de vendas.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#8b5cf6")
              .setFooter({ text: "🔒 Staff Only • Atas de Reuniões" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedReun] });
          }
          else if (chan.msgType === "vendas_staff") {
            const embedVes = new EmbedBuilder()
              .setTitle("💳 **NOTIFICAÇÃO DE VENDAS CONCLUÍDAS (STAFF LOGS)** 💳")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• **Transação:** #TRX-99411\n• **Produto:** Combo Supremo Anual (💎)\n• **Cliente:** @Marcos#8812\n• **Valor faturado:** R$ 499,00 (Pagamento instantâneo via PIX)\n\n• **Transação:** #TRX-99412\n• **Produto:** Aura Moderador Pro Mensal (🛡️)\n• **Cliente:** @SofiaDev#0091\n• **Valor faturado:** R$ 25,00 (Pagamento via Cartão de Crédito)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#10b981")
              .setFooter({ text: "🔒 Staff Only • Controle de Faturamento" })
              .setTimestamp();

            await createdChan.send({ embeds: [embedVes] });
          }
        }
      }

      // 4. Criar canais de voz padrões fora de categorias ou em nova categoria
      const createdVoiceCategory = await targetGuild.channels.create({
        name: "🔊 CANAIS DE VOZ",
        type: ChannelType.GuildCategory
      });

      const canaisVoz = [
        "🎙️ Geral", 
        "🎙️ Suporte", 
        "🎙️ Desenvolvimento", 
        "🎙️ Clientes", 
        "🎙️ Staff",
        "🎙️ Reunião",
        "🎙️ Testes de Bots"
      ];
      for (const voz of canaisVoz) {
        // Determinar permissões de voz baseadas no canal
        let voiceOverwrites = [];
        if (voz === "🎙️ Staff") {
          voiceOverwrites = [
            {
              id: targetGuild.roles.everyone.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            }
          ];
          if (CONFIG.staffRole) {
            voiceOverwrites.push({
              id: CONFIG.staffRole,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.Connect,
                PermissionsBitField.Flags.Speak
              ]
            });
          }
        } else {
          voiceOverwrites = [
            {
              id: targetGuild.roles.everyone.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.Connect,
                PermissionsBitField.Flags.Speak
              ]
            }
          ];
        }

        await targetGuild.channels.create({
          name: voz,
          type: ChannelType.GuildVoice,
          parent: createdVoiceCategory.id,
          permissionOverwrites: voiceOverwrites
        });
      }

      await message.reply("✅ Reestruturação completa finalizada! Todos os canais e categorias foram criados e as permissões de canais aplicadas com sucesso. Nenhuma aba de texto ficou sem sua mensagem embutida.");

    } catch (err) {
      console.error(err);
      await message.reply(`❌ Erro fatal durante a reestruturação: ${err.message}`);
    }
  }
});

// Coloque o TOKEN do seu bot no arquivo .env
client.login(process.env.DISCORD_BOT_TOKEN);
