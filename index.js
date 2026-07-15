/**
 * BOT DE DISCORD AUTO-CONFIGURÁVEL - ARSENAL DE ESTILO
 * Versão: discord.js v14
 */

const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  PermissionsBitField, 
  ChannelType 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Configuração completa do "Arsenal de Estilo" (Canais, Cargos, Permissões e Textos)
const CONFIG = {
  "storeName": "Arsenal de Estilo",
  "accentColor": "#eab308",
  "roles": [
    { "id": "role-founder", "name": "👑 Fundador", "color": "#ef4444", "hoist": true, "mentionable": true },
    { "id": "role-designer", "name": "🎨 Designer de Roupas", "color": "#3b82f6", "hoist": true, "mentionable": true },
    { "id": "role-staff", "name": "🛡️ Staff", "color": "#10b981", "hoist": true, "mentionable": true },
    { "id": "role-vip", "name": "⭐ VIP Premium", "color": "#eab308", "hoist": true, "mentionable": false },
    { "id": "role-parceiro", "name": "🤝 Parceiro", "color": "#a855f7", "hoist": false, "mentionable": false },
    { "id": "role-cliente", "name": "🛒 Cliente Verificado", "color": "#14b8a6", "hoist": false, "mentionable": false },
    { "id": "role-membro", "name": "👥 Membro", "color": "#9ca3af", "hoist": false, "mentionable": false }
  ],
  "categories": [
    {
      "name": "📜 ・INÍCIO",
      "channels": [
        {
          "name": "├─👋・boas-vindas",
          "type": 0,
          "description": "Boas-vindas aos novos membros da comunidade.",
          "embedTitle": "👋 Bem-vindo ao Arsenal de Estilo!",
          "embedDescription": "Seja muito bem-vindo ao servidor oficial do **Arsenal de Estilo**! Aqui você encontra as melhores coleções de roupas e calçados otimizados para o seu servidor FiveM (Low-Poly). Fique à vontade e explore nossos canais!",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─📢・anúncios",
          "type": 0,
          "description": "Avisos importantes, atualizações e novidades da loja.",
          "embedTitle": "📢 Novidades e Avisos da Loja",
          "embedDescription": "Fique de olho neste canal para não perder os últimos anúncios, atualizações de packs de roupas masculinas e femininas, e novos lançamentos no nosso catálogo!",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─📜・regras",
          "type": 0,
          "description": "Diretrizes e regras do servidor.",
          "embedTitle": "📜 Diretrizes & Regras do Servidor",
          "embedDescription": "Para manter nossa comunidade saudável e organizada, siga nossas regras fundamentais:\n\n1️⃣ **Respeito Mútuo**: Trate todos os membros e staff com respeito.\n2️⃣ **Sem Spam/Flood**: Evite mensagens repetitivas nos canais comuns.\n3️⃣ **Sem Divulgação**: É proibido divulgar outros servidores ou links não autorizados.\n4️⃣ **Tickets de Vendas**: Use os canais corretos de suporte para realizar compras.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─🎭・cargos",
          "type": 0,
          "description": "Descrição dos cargos e reações.",
          "embedTitle": "🎭 Sistema de Cargos do Servidor",
          "embedDescription": "Conheça os cargos do nosso servidor:\n\n👑 **Fundador/Dono**: Responsável geral pelo projeto.\n🎨 **Designer de Roupas**: Desenvolvedor dos modelos e packs.\n🛡️ **Staff/Admin**: Suporte e moderação.\n⭐ **VIP Premium**: Acesso antecipado e descontos exclusivos.\n🛒 **Cliente Verificado**: Membros que já efetuaram compras.\n👥 **Membro**: Visitantes e entusiastas da nossa comunidade.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─🎁・presentes",
          "type": 0,
          "description": "Brindes e cupons especiais para membros.",
          "embedTitle": "🎁 Brindes & Mimos da Comunidade",
          "embedDescription": "Gostamos de retribuir a preferência dos nossos membros! Periodicamente disponibilizaremos packs gratuitos de roupas de teste ou cupons promocionais especiais aqui.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "└─📅・eventos",
          "type": 0,
          "description": "Cronograma de sorteios e eventos.",
          "embedTitle": "📅 Eventos & Sorteios Ativos",
          "embedDescription": "Fique atento a esta aba! Aqui você saberá sobre sorteios de assinaturas VIP, packs completos e competições de prints estilizados da comunidade.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        }
      ]
    },
    {
      "name": "🛒 ・LOJA",
      "channels": [
        {
          "name": "├─💎・catálogo",
          "type": 0,
          "description": "Catálogo de packs de roupas premium.",
          "embedTitle": "💎 Catálogo Premium de Roupas & Acessórios",
          "embedDescription": "Nossos modelos de roupas são low-poly e totalmente otimizados para evitar crash ou lag no seu servidor FiveM.\n\n👕 Roupas Masculinas (Grifes, Táticas, Jaquetas)\n👗 Roupas Femininas (Crop, Vestidos, Looks Balada)\n🎒 Acessórios (Mochilas, Óculos, Bonés de Grife)\n👟 Calçados (Jordan, Yeezy, Nike Shox)\n\n_Para realizar o seu pedido ou tirar dúvidas, acesse a central de atendimento e abra um ticket._",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─🔥・promoções",
          "type": 0,
          "description": "Combos e pacotes promocionais ativos.",
          "embedTitle": "🔥 Combos & Packs Promocionais",
          "embedDescription": "Aproveite nossos preços especiais em packs agrupados! Economize até 40% levando coleções masculinas e femininas integradas com o script de instalação pronta resource.cfg.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─⭐・vip",
          "type": 0,
          "description": "Benefícios e packs do plano VIP.",
          "embedTitle": "⭐ Vantagens Exclusivas VIP Premium",
          "embedDescription": "Ao assinar nossa categoria VIP Deluxe, você adquire:\n\n✔️ 25% de desconto fixo em todas as peças avulsas.\n✔️ Acesso antecipado de 14 dias a lançamentos.\n✔️ Cargo e cor exclusiva no Discord.\n✔️ Suporte 1-on-1 prioritário na fila de entregas.",
          "allowedRoles": ["role-vip", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─🛍️・compras",
          "type": 0,
          "description": "Instruções de como comprar.",
          "embedTitle": "🛍️ Como Realizar Suas Compras",
          "embedDescription": "Siga este passo a passo simples para adquirir roupas:\n\n1️⃣ Escolha os itens desejados no canal **💎・catálogo** ou **🔥・promoções**.\n2️⃣ Vá em **🎫・abrir-ticket** e clique no botão correspondente para abrir o atendimento.\n3️⃣ Informe os itens selecionados e nossa equipe finalizará o pagamento com envio imediato!",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "└─💳・pagamentos",
          "type": 0,
          "description": "Métodos de pagamento disponíveis.",
          "embedTitle": "💳 Formas de Pagamento Aceitas",
          "embedDescription": "Trabalhamos com os métodos de pagamento mais seguros e rápidos:\n\n🔹 **PIX** (Processamento imediato com desconto exclusivo!)\n🔹 **Cartão de Crédito** (Via Mercado Pago, parcelado em até 12x)\n🔹 **Boleto Bancário** (Sujeito à compensação de 1 a 2 dias úteis)",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        }
      ]
    },
    {
      "name": "🎫 ・SUPORTE",
      "channels": [
        {
          "name": "├─🎟️・abrir-ticket",
          "type": 0,
          "description": "Clique no botão para abrir um ticket.",
          "embedTitle": "🎟️ Central de Atendimento & Compras",
          "embedDescription": "Deseja comprar alguma roupa ou precisa de suporte para instalação?\n\nClique no botão abaixo para abrir o seu ticket privado de atendimento. Nossa equipe e designers estão prontos para ajudar você!",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─📨・atendimento",
          "type": 0,
          "description": "Informações de horários de atendimento.",
          "embedTitle": "📨 Horários de Suporte",
          "embedDescription": "Nossa equipe atende nos seguintes horários:\n\n📅 **Segunda a Sexta**: 10:00 às 22:00\n📅 **Sábados e Domingos**: 13:00 às 20:00\n\n_Mesmo fora do horário, sinta-se à vontade para abrir o ticket e deixar sua mensagem. Responderemos na ordem de chegada!_",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─❓・faq",
          "type": 0,
          "description": "Perguntas frequentes e dúvidas comuns.",
          "embedTitle": "❓ FAQ - Perguntas Frequentes",
          "embedDescription": "**1. As roupas causam crash no servidor?**\nNão! Todas as nossas texturas e malhas são compactadas e otimizadas (Low-Poly), mantendo o tamanho abaixo do limite crítico do FiveM.\n\n**2. Posso testar as roupas antes de comprar?**\nSim! Solicite no seu ticket a entrada no nosso servidor de testes oficial.\n\n**3. Vocês fazem roupas personalizadas com minha marca?**\nSim! Entre em contato via ticket para orçamentos de roupas com o logotipo do seu servidor ou marca real.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "└─📂・downloads",
          "type": 0,
          "description": "Downloads de arquivos e links úteis.",
          "embedTitle": "📂 Área de Downloads e Manuais",
          "embedDescription": "Acesse seus arquivos de forma organizada. Aqui disponibilizamos manuais em PDF, links para downloads dos recursos comprados e atualizações dos pacotes de roupas de grife.",
          "allowedRoles": ["role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        }
      ]
    },
    {
      "name": "👑 ・COMUNIDADE",
      "channels": [
        {
          "name": "├─💬・chat",
          "type": 0,
          "description": "Bate-papo geral da comunidade.",
          "embedTitle": "💬 Chat Geral - Área de Convivência",
          "embedDescription": "Converse sobre o servidor, FiveM, GTA RP, mande prints ou fale sobre moda urbana. Siga as diretrizes de bom convívio!",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─📸・prints",
          "type": 0,
          "description": "Envie fotos do seu personagem usando nossas roupas.",
          "embedTitle": "📸 Galeria de Looks (Prints)",
          "embedDescription": "Mostre o estilo do seu personagem! Envie fotos e capturas de tela usando nossos trajes no servidor de roleplay e receba elogios da comunidade.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─🎥・clips",
          "type": 0,
          "description": "Envie clipes engraçados ou de ação.",
          "embedTitle": "🎥 Clipes & Vídeos de Roleplay",
          "embedDescription": "Mandou bem no RP ou quer compartilhar aquele momento engraçado ou de ação? Publique seus clipes do Twitch, TikTok ou YouTube aqui!",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─😂・memes",
          "type": 0,
          "description": "Canal de humor e memes.",
          "embedTitle": "😂 Humor & Memes de GTA",
          "embedDescription": "Solte a risada! Poste piadas, montagens e memes sobre FiveM e o cotidiano das cidades de roleplay.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─🎵・música",
          "type": 0,
          "description": "Comandos para o bot de música.",
          "embedTitle": "🎵 Comandos de Música",
          "embedDescription": "Quer colocar um som de fundo enquanto joga ou conversa? Use este canal para enviar os comandos do nosso bot de rádio e gerenciar suas playlists de música.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "└─🤖・comandos",
          "type": 0,
          "description": "Interações e comandos gerais de bots.",
          "embedTitle": "🤖 Comandos Gerais de Bots",
          "embedDescription": "Utilize este canal para brincar com os minijogos do bot, verificar seu nível de XP na comunidade ou consultar suas moedas da loja.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        }
      ]
    },
    {
      "name": "🎙️ ・VOZ",
      "channels": [
        {
          "name": "├─🔊 Geral 01",
          "type": 2,
          "description": "Conversa por voz livre.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─🔊 Geral 02",
          "type": 2,
          "description": "Conversa por voz livre.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─🎮 Gaming",
          "type": 2,
          "description": "Jogar conversando.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─💼 Reunião",
          "type": 2,
          "description": "Reuniões e suporte por voz.",
          "allowedRoles": ["role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "└─🎵 Música",
          "type": 2,
          "description": "Sala para ouvir música com bots.",
          "allowedRoles": ["role-membro", "role-cliente", "role-vip", "role-parceiro", "role-staff", "role-designer", "role-founder"]
        }
      ]
    },
    {
      "name": "🛠️ ・STAFF",
      "channels": [
        {
          "name": "├─📋・logs",
          "type": 0,
          "description": "Registros e auditorias do bot.",
          "embedTitle": "📋 Logs de Atividades da Staff",
          "embedDescription": "Canal privado para monitorar eventos do servidor, entradas/saídas de membros, histórico de banimentos, kicks e auditoria geral de moderação.",
          "allowedRoles": ["role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─📊・painel",
          "type": 0,
          "description": "Painel de controle e faturamento.",
          "embedTitle": "📊 Painel Financeiro e de Metas",
          "embedDescription": "Mantenha o controle de faturamento de roupas, assinaturas VIP ativas e status dos servidores em tempo real. Apenas donos e cargos autorizados.",
          "allowedRoles": ["role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─⚙️・config",
          "type": 0,
          "description": "Configurações administrativas e de desenvolvimento.",
          "embedTitle": "⚙️ Configurações Administrativas",
          "embedDescription": "Coordenação técnica de desenvolvimento do bot, integrações Webhook e backups de banco de dados do servidor.",
          "allowedRoles": ["role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "├─📑・relatórios",
          "type": 0,
          "description": "Relatórios periódicos da loja.",
          "embedTitle": "📑 Relatórios de Vendas e Desempenho",
          "embedDescription": "Lista mensal de produtos mais vendidos, feedback dos tickets finalizados e avaliações dos novos packs de roupas.",
          "allowedRoles": ["role-staff", "role-designer", "role-founder"]
        },
        {
          "name": "└─👮・moderação",
          "type": 0,
          "description": "Comunicação interna de regras da Staff.",
          "embedTitle": "👮 Manual Interno de Conduta da Staff",
          "embedDescription": "Instruções de conduta para moderadores e administradores. Aplique as punições corretas de acordo com a gravidade das infrações dos membros do servidor.",
          "allowedRoles": ["role-staff", "role-designer", "role-founder"]
        }
      ]
    }
  ]
};

const PREFIX = '!';

client.once('ready', () => {
  console.log(`\n✅ Bot online com sucesso como ${client.user.tag}!`);
  console.log('📌 Vá para o seu servidor Discord e digite !criar para rodar a automação.\n');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'criar') {
    // Apenas administradores podem rodar este comando
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Apenas membros com a permissão de **Administrador** podem executar este comando!');
    }

    const guild = message.guild;
    console.log(`Iniciando setup no servidor ${guild.name}`);
    
    let progressMsg;
    try {
      progressMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🧹 Iniciando Setup da Loja')
            .setDescription('🧹 **Etapa 1:** Realizando limpeza completa do servidor (canais e cargos antigos)...\nAguarde um momento, isso pode levar alguns segundos devido aos limites de taxa.')
            .setColor(0xf39c12)
            .setTimestamp()
        ]
      });
    } catch (e) {
      console.log('Erro ao enviar mensagem de progresso inicial: ', e);
    }

    try {
      // 1. Deletar todos os canais e categorias existentes deletáveis (EXCETO o canal onde o comando foi enviado)
      const channels = await guild.channels.fetch();
      let deletedChansCount = 0;
      for (const [id, channel] of channels) {
        if (id === message.channel.id) continue; // Manter o canal do comando para não quebrar o bot
        if (channel.deletable) {
          try {
            await channel.delete();
            deletedChansCount++;
            console.log(`Deletado canal/categoria: ${channel.name}`);
            await new Promise(resolve => setTimeout(resolve, 150)); // Evitar limite de taxa
          } catch (e) {
            console.log(`Erro ao deletar canal ${channel.name}: ${e.message}`);
          }
        }
      }
      console.log(`🧹 Limpeza de canais concluída! Total deletados: ${deletedChansCount}`);

      // 2. Deletar todos os cargos customizados deletáveis
      const roles = await guild.roles.fetch();
      let deletedRolesCount = 0;
      for (const [id, role] of roles) {
        if (role.id !== guild.id && !role.managed && role.deletable && role.name !== client.user.username) {
          try {
            await role.delete();
            deletedRolesCount++;
            console.log(`Deletado cargo: ${role.name}`);
            await new Promise(resolve => setTimeout(resolve, 150)); // Evitar limite de taxa
          } catch (e) {
            console.log(`Erro ao deletar cargo ${role.name}: ${e.message}`);
          }
        }
      }
      console.log(`🧹 Limpeza de cargos concluída! Total deletados: ${deletedRolesCount}`);

      // Atualizar mensagem de progresso para Etapa 2
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('⚙️ Progresso do Setup')
                .setDescription('🎨 **Etapa 2:** Criando novos cargos customizados e configurando hierarquia...\nAguarde um momento.')
                .setColor(0x3498db)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      // 3. Criar os novos cargos customizados configurados
      const roleIdMapping = {};
      for (const r of CONFIG.roles) {
        try {
          const colorHex = r.color.replace('#', '');
          const newRole = await guild.roles.create({
            name: r.name,
            color: parseInt(colorHex, 16) || 0,
            hoist: r.hoist,
            mentionable: r.mentionable,
            reason: 'Automação Loja FiveM'
          });
          roleIdMapping[r.id] = newRole.id;
          console.log(`Cargo Criado: ${r.name}`);
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`Erro ao criar cargo ${r.name}: `, e);
        }
      }

      // Atualizar mensagem de progresso para Etapa 3
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('⚙️ Progresso do Setup')
                .setDescription('📂 **Etapa 3:** Criando categorias, canais de texto/voz e definindo permissões privadas...\nAguarde um momento.')
                .setColor(0x9b59b6)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const embedColor = parseInt(CONFIG.accentColor.replace('#', ''), 16) || 0x3498db;

      // 4. Criar as categorias e canais
      for (const cat of CONFIG.categories) {
        try {
          console.log(`Criando categoria: ${cat.name}`);
          const category = await guild.channels.create({
            name: cat.name,
            type: ChannelType.GuildCategory
          });
          await new Promise(resolve => setTimeout(resolve, 200));

          for (const chan of cat.channels) {
            try {
              const cleanChanName = chan.type === 2 ? chan.name : chan.name.toLowerCase().replace(/\s+/g, '-');
              console.log(`Criando canal: ${cleanChanName}`);

              const permissionOverwrites = [];

              // PRIVAR CANAL: Negar para @everyone por padrão
              permissionOverwrites.push({
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
              });

              let allowedRolesToAssign = [];

              if (chan.allowedRoles && chan.allowedRoles.length > 0) {
                allowedRolesToAssign = [...chan.allowedRoles];
              } else {
                const chanNameLower = (chan.name || '').toLowerCase();
                if (chanNameLower.includes('vip')) {
                  allowedRolesToAssign = ['role-vip', 'role-staff', 'role-designer', 'role-founder'];
                } else if (chanNameLower.includes('logs') || chanNameLower.includes('config') || chanNameLower.includes('painel') || chanNameLower.includes('relatório')) {
                  allowedRolesToAssign = ['role-staff', 'role-designer', 'role-founder'];
                } else {
                  allowedRolesToAssign = ['role-membro', 'role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-designer', 'role-founder'];
                }
              }

              // Aplicar permissão ViewChannel para cargos mapeados
              for (const tempRoleId of allowedRolesToAssign) {
                const realRoleId = roleIdMapping[tempRoleId];
                if (realRoleId) {
                  const alreadyAdded = permissionOverwrites.some(o => o.id === realRoleId);
                  if (!alreadyAdded) {
                    permissionOverwrites.push({
                      id: realRoleId,
                      allow: [PermissionsBitField.Flags.ViewChannel]
                    });
                  }
                }
              }

              // Garantir cargos administrativos sempre ativos
              const adminRoles = ['role-founder', 'role-designer', 'role-staff'];
              for (const adminId of adminRoles) {
                const realAdminRoleId = roleIdMapping[adminId];
                if (realAdminRoleId) {
                  const alreadyAdded = permissionOverwrites.some(o => o.id === realAdminRoleId);
                  if (!alreadyAdded) {
                    permissionOverwrites.push({
                      id: realAdminRoleId,
                      allow: [PermissionsBitField.Flags.ViewChannel]
                    });
                  }
                }
              }

              const channel = await guild.channels.create({
                name: cleanChanName,
                type: chan.type === 2 ? ChannelType.GuildVoice : ChannelType.GuildText,
                parent: category.id,
                topic: chan.description || '',
                permissionOverwrites: permissionOverwrites.length > 0 ? permissionOverwrites : undefined
              });
              await new Promise(resolve => setTimeout(resolve, 200));

              // Postar o embed se for de texto e possuir conteúdo
              if (chan.type === 0 && (chan.embedTitle || chan.embedDescription)) {
                try {
                  const embed = new EmbedBuilder()
                    .setTitle(chan.embedTitle || `📌 #${chan.name}`)
                    .setDescription(chan.embedDescription || chan.description || '...')
                    .setColor(embedColor)
                    .setFooter({ text: 'Arsenal de Estilo | Automação' })
                    .setTimestamp();

                  await channel.send({ embeds: [embed] });
                } catch (embedErr) {
                  console.error(`Erro ao postar embed no canal ${cleanChanName}: `, embedErr);
                }
              }
            } catch (chanErr) {
              console.error(`Erro ao criar canal ${chan.name}: `, chanErr);
            }
          }
        } catch (catErr) {
          console.error(`Erro ao criar categoria ${cat.name}: `, catErr);
        }
      }

      // Atualizar mensagem de sucesso final no próprio canal do setup
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🎉 Setup Concluído com Sucesso!')
                .setDescription(`👑 Toda a estrutura de categorias, canais de texto/voz, permissões privadas, cargos e mensagens de embeds automáticas da loja **${CONFIG.storeName}** foram configurados com sucesso!\n\n*Você já pode apagar este canal temporário se desejar.*`)
                .setColor(0x2ecc71)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      console.log('✅ Automação de criação concluída com sucesso!');
    } catch (error) {
      console.error('Erro geral na automação do bot: ', error);
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('❌ Falha no Setup')
                .setDescription(`Ocorreu um erro geral durante a execução do setup:\n\`\`\`${error.message}\`\`\`\nConsulte o console para mais detalhes.`)
                .setColor(0xe74c3c)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }
    }
  }
});

// COLOQUE O TOKEN DO SEU BOT DISCORD ABAIXO:
client.login(process.env.TOKEN);
;
