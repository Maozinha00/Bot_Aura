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
  destServerId: "1495178024759332914",     // ID do servidor de DESTINO (onde tudo será criado)
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
          channels: [
            { name: "👋・boas-vindas", type: ChannelType.GuildText, msgType: "welcome" },
            { name: "📚・regras", type: ChannelType.GuildText, msgType: "rules" },
            { name: "📢・anúncios", type: ChannelType.GuildText, msgType: "normal" },
            { name: "✨・novidades", type: ChannelType.GuildText, msgType: "normal" },
            { name: "⚙️・changelog", type: ChannelType.GuildText, msgType: "normal" },
            { name: "🎉・sorteios", type: ChannelType.GuildText, msgType: "normal" },
            { name: "❓・faq", type: ChannelType.GuildText, msgType: "normal" }
          ]
        },
        {
          name: "🛒・LOJA OFICIAL",
          channels: [
            { name: "🛍️・catálogo", type: ChannelType.GuildText, msgType: "sales" },
            { name: "📦・preços", type: ChannelType.GuildText, msgType: "prices" },
            { name: "🤖・bots-disponíveis", type: ChannelType.GuildText, msgType: "normal" },
            { name: "💎・planos", type: ChannelType.GuildText, msgType: "normal" },
            { name: "🔥・promoções", type: ChannelType.GuildText, msgType: "normal" },
            { name: "💳・formas-de-pagamento", type: ChannelType.GuildText, msgType: "normal" }
          ]
        },
        {
          name: "🧪・TESTES DE BOTS",
          channels: [
            { name: "🧪・teste-bot-1", type: ChannelType.GuildText, msgType: "normal" },
            { name: "🧪・teste-bot-2", type: ChannelType.GuildText, msgType: "normal" },
            { name: "🧪・teste-bot-3", type: ChannelType.GuildText, msgType: "normal" },
            { name: "🧪・teste-bot-4", type: ChannelType.GuildText, msgType: "normal" },
            { name: "🧪・teste-bot-5", type: ChannelType.GuildText, msgType: "normal" },
            { name: "🧱・sandbox", type: ChannelType.GuildText, msgType: "normal" }
          ]
        },
        {
          name: "🎫・CENTRAL DE SUPORTE",
          channels: [
            { name: "🎫・abrir-ticket", type: ChannelType.GuildText, msgType: "ticket_central" },
            { name: "💬・feedback", type: ChannelType.GuildText, msgType: "normal" },
            { name: "⭐・avaliações", type: ChannelType.GuildText, msgType: "normal" }
          ]
        },
        {
          name: "💬・CONVERSAS & INTERAÇÃO",
          channels: [
            { name: "💬・chat-geral", type: ChannelType.GuildText, msgType: "general" },
            { name: "🤪・memes", type: ChannelType.GuildText, msgType: "normal" },
            { name: "📸・prints", type: ChannelType.GuildText, msgType: "normal" },
            { name: "🎮・games", type: ChannelType.GuildText, msgType: "normal" },
            { name: "⌨️・comandos", type: ChannelType.GuildText, msgType: "normal" }
          ]
        }
      ];

      for (const cat of categorias) {
        // Criar categoria principal
        const createdCategory = await targetGuild.channels.create({
          name: cat.name,
          type: ChannelType.GuildCategory
        });

        // Criar subcanais de texto dentro da categoria
        for (const chan of cat.channels) {
          const createdChan = await targetGuild.channels.create({
            name: chan.name,
            type: chan.type,
            parent: createdCategory.id
          });

          // Enviar mensagens iniciais formatadas e embeds destacados
          if (chan.msgType === "rules") {
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
          else if (chan.msgType === "sales") {
            const embedVendas = new EmbedBuilder()
              .setTitle("💎 **CATÁLOGO OFICIAL - AURA BOTS STUDIO** 💎")
              .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🚀 **Adquira os melhores bots para a sua comunidade!** Nossos sistemas funcionam **24/7 hospedados em servidores de ponta**, garantindo 100% de estabilidade!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
              .setColor("#facc15")
              .addFields(
                { name: "🎫・**AURA TICKET BOT**", value: "• Atendimento dinâmico com **botões integrados**\n• Transcrições de conversas salvas em **HTML**\n• Painel de controle completo\n• 📦 **Valor: R$ 19,00/mês**" },
                { name: "🛡️・**AURA MODERADOR PRO**", value: "• Sistema robusto de **antiraid & anti-link**\n• Logs detalhados de todas as ações de membros\n• Verificação para evitar contas falsas\n• 📦 **Valor: R$ 25,00/mês**" },
                { name: "🌟・**COMBO SUPREMO PREMIUM (💎)**", value: "• 🔥 **Leve todos os nossos bots integrados em um único pacote!**\n• Suporte prioritário 24 horas + Hospedagem Premium inclusa de graça\n• 💰 **De R$ 112,00 por APENAS R$ 59,00/mês!**" }
              )
              .setFooter({ text: "Para adquirir, abra um ticket em #abrir-ticket!" });

            await createdChan.send({ embeds: [embedVendas] });
          }
          else if (chan.msgType === "prices") {
            const msgPrecos = "╔══════════════════════════════════╗\n" +
                              "  💎 **AURA BOTS STUDIO - TABELA DE PREÇOS** 💎\n" +
                              "╚══════════════════════════════════╝\n\n" +
                              "📌 **BOT BÁSICO** — **R$ 15,00/mês**\n" +
                              "• Comandos essenciais e estáveis\n" +
                              "• Bot leve, rápido e com hospedagem inclusa\n\n" +
                              "📌 **BOT PERSONALIZADO** — **R$ 50,00/mês**\n" +
                              "• Sistemas sob medida (Sua ideia vira realidade)\n" +
                              "• Funções exclusivas & API de dados personalizada\n\n" +
                              "📌 **BOT ENTERPRISE** — **R$ 120,00/mês**\n" +
                              "• Integrações completas com painéis ou servidores externos\n" +
                              "• Automação avançada para grandes comunidades virtuais\n\n" +
                              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                              "⚡ **INFORMAÇÕES ADICIONAIS:**\n" +
                              "✔ **Entrega Expressa:** Configuração em tempo recorde\n" +
                              "✔ **Suporte Premium:** Equipe pronta para te ajudar 24/7\n\n" +
                              "🎫 Para fazer seu pedido, abra um canal de ticket!";

            await createdChan.send({ content: msgPrecos });
          }
          else if (chan.msgType === "ticket_central") {
            const embedTicket = new EmbedBuilder()
              .setTitle("🎫 **CENTRAL DE ATENDIMENTO E SUPORTE** 🎫")
              .setDescription("Precisa comprar um bot ou falar com nossa equipe de suporte? Abra um ticket privado clicando no botão abaixo!\n\n🕒 **Horário de Funcionamento:**\n• Segunda a Sábado: **09:00 às 22:00**\n• Domingo: **Plantão de urgências**\n\n*Clique abaixo para iniciar seu atendimento personalizado com o Aura Bot.*")
              .setColor("#34d399")
              .setFooter({ text: "Aura Bots Studio • Atendimento VIP" });

            await createdChan.send({ embeds: [embedTicket] });
          }
        }
      }

      // 4. Criar canais de voz padrões fora de categorias ou em nova categoria
      const createdVoiceCategory = await targetGuild.channels.create({
        name: "🔊 CANAIS DE VOZ",
        type: ChannelType.GuildCategory
      });

      const canaisVoz = ["🎙️ Geral", "🎙️ Suporte", "🎙️ Desenvolvimento", "🎙️ Clientes", "🎙️ Staff"];
      for (const voz of canaisVoz) {
        await targetGuild.channels.create({
          name: voz,
          type: ChannelType.GuildVoice,
          parent: createdVoiceCategory.id
        });
      }

      await message.reply("✅ Reestruturação completa finalizada! Todos os canais foram apagados e recriados perfeitamente com as mensagens de vendas e regras.");

    } catch (err) {
      console.error(err);
      await message.reply(`❌ Erro fatal durante a reestruturação: ${err.message}`);
    }
  }
});

// Coloque o TOKEN do seu bot no arquivo .env
client.login(process.env.TOKEN);
