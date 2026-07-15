/**
 * ======================================================================
 * 🤖 BOT AUTO-CONFIGURADOR DE SERVIDORES - AURA BOTS STUDIO
 * Versão: discord.js v14
 * 
 * 🔒 BLINDAGEM TOTAL: Canais totalmente privados por padrão.
 * 🧹 LIMPEZA COMPLETA: Apaga TODOS os canais e cargos antigos antes de criar.
 * ======================================================================
 * 
 * 📌 COMO INSTALAR E RODAR:
 * 1. Crie uma pasta vazia no seu computador.
 * 2. Abra o terminal nessa pasta e digite: npm install discord.js dotenv
 * 3. Crie um arquivo chamado "index.js" e cole este código completo dentro dele.
 * 4. Ative as 3 "Privileged Gateway Intents" no painel de desenvolvedor do Discord (aba Bot):
 *    - Presence Intent
 *    - Server Members Intent
 *    - Message Content Intent (OBRIGATÓRIO para ler o comando "!criar")
 * 5. Coloque o Token do seu bot abaixo na variável BOT_TOKEN ou em um arquivo .env.
 * 6. Rode o bot usando: node index.js
 * 7. Digite "!criar" em qualquer canal de texto no seu Discord.
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
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Chaves de Configuração
const BOT_TOKEN = process.env.TOKEN || 'COLE_SEU_TOKEN_AQUI'; 
const GUILD_ID = 'COLE_ID_DO_SEU_SERVIDOR_AQUI'; // Insira o ID do seu servidor aqui

// Configurações estruturadas da Aura Bots Studio
const CONFIG = {
  storeName: "Aura Bots Studio",
  accentColor: "#a855f7", // Cor Aura Violeta
  
  // Tabela de Cargos a serem recriados do zero
  roles: [
    { id: 'role-founder', name: '👑 Dono / Fundador', color: 0xe74c3c, hoist: true, mentionable: true },
    { id: 'role-developer', name: '💻 Developer / Programador', color: 0xa855f7, hoist: true, mentionable: true },
    { id: 'role-staff', name: '🛡️ Administrador / Staff', color: 0x3498db, hoist: true, mentionable: true },
    { id: 'role-parceiro', name: '🤝 Parceiro / Influencer', color: 0xe67e22, hoist: true, mentionable: true },
    { id: 'role-vip', name: '⭐ Cliente VIP Premium', color: 0xf1c40f, hoist: true, mentionable: true },
    { id: 'role-cliente', name: '🛒 Cliente Verificado', color: 0x2ecc71, hoist: true, mentionable: false },
    { id: 'role-membro', name: '👥 Membro da Comunidade', color: 0x95a5a6, hoist: false, mentionable: false }
  ],

  // Estrutura completa de Categorias e Canais com embeds
  categories: [
    {
      name: '╔══ 📌 INFO & COMUNIDADE ══╗',
      channels: [
        {
          id: 'chan-boas-vindas-aura',
          name: '├─👋・boas-vindas',
          type: 0,
          description: 'Seja muito bem-vindo à Aura Bots Studio!',
          embedTitle: '👋 Bem-vindo ao Aura Bots Studio!',
          embedDescription: 'Seja muito bem-vindo ao melhor centro de desenvolvimento de Bots do Discord e Servidores prontos!\n\nAqui você encontrará soluções completas, servidores otimizados, bots dedicados com suporte ativo e hospedagem premium VPS.\n\n📌 **Como começar?**\n📖 Consulte as nossas regras no canal de regras.\n📢 Fique de olho nas novidades em anúncios.\n🛒 Dê uma olhada no nosso catálogo de serviços.'
        },
        {
          id: 'chan-anuncios-aura',
          name: '├─📢・anúncios',
          type: 0,
          description: 'Avisos importantes, atualizações e novidades.',
          embedTitle: '📢 Novidades e Comunicados Oficiais',
          embedDescription: 'Fique por dentro de todos os novos lançamentos de bots, cupons especiais, atualizações de APIs e novidades de desenvolvimento da Aura Bots Studio.'
        },
        {
          id: 'chan-regras-aura',
          name: '├─📖・regras',
          type: 0,
          description: 'Diretrizes de convivência do nosso servidor.',
          embedTitle: '📖 Regulamento & Diretrizes da Comunidade',
          embedDescription: 'Para garantir um ambiente saudável e profissional, pedimos que todos sigam nossas regras simples:\n\n1️⃣ **Respeito Mútuo**: Sem insultos ou preconceitos.\n2️⃣ **Divulgação proibida**: Não anuncie serviços ou outros bots sem autorização.\n3️⃣ **Sem Spam/Flood**: Utilize os canais adequados para interagir.\n4️⃣ **Atendimento oficial**: Dúvidas técnicas e compras devem ser tratadas estritamente em seu Ticket individual.'
        },
        {
          id: 'chan-cargos-aura',
          name: '├─🎭・cargos',
          type: 0,
          description: 'Auto-atribuição de cargos da comunidade.',
          embedTitle: '🎭 Reaja para Selecionar Seus Cargos',
          embedDescription: 'Escolha suas áreas de interesse para receber notificações personalizadas:\n\n💻 **Desenvolvedor**: Ative para receber novidades de programação e tutoriais.\n🛒 **Notificar Compras**: Receba alertas sobre novos bots no catálogo.'
        },
        {
          id: 'chan-presentes-aura',
          name: '├─🎁・brindes-e-presentes',
          type: 0,
          description: 'Brindes e presentes exclusivos para membros.',
          embedTitle: '🎁 Brindes e Conteúdos Gratuitos!',
          embedDescription: 'Agradecemos sua participação em nossa comunidade! Divirta-se com códigos-fontes de testes livre, guias de configuração rápidos e templates de servidores prontos disponibilizados periodicamente aqui.'
        },
        {
          id: 'chan-eventos-aura',
          name: '└─🎉・eventos',
          type: 0,
          description: 'Eventos de programação, hackathons e sorteios.',
          embedTitle: '🎉 Sorteios e Eventos da Aura',
          embedDescription: 'Quer ganhar licenças de bots, assinaturas de hospedagem ou assessoria profissional para seu servidor? Não perca os sorteios e eventos realizados neste canal!'
        }
      ]
    },
    {
      name: '🛒 ・LOJA',
      channels: [
        {
          id: 'chan-catalogo-aura',
          name: '├─💎・catálogo',
          type: 0,
          description: 'Preços e catálogo detalhado de Bots e Servidores.',
          embedTitle: '🤖 Catálogo de Bots & Criação de Servidores',
          embedDescription: 'Oferecemos soluções completas com excelente custo-benefício:\n\n🤖 **Bots Customizados (A partir de R$ 30,00)**\nDesenvolvemos qualquer sistema: Vendas automáticas, Moderação, Ticket, Economia, RPG e integrações API.\n\n⚙️ **Bot Mensal (Apenas R$ 15,00/mês)**\nTenha o seu bot ativo 24/7 hospedado em nossa VPS premium. Sem travamentos, com suporte e atualizações inclusas!\n\n💻 **Criação de Servidor Completo (Apenas R$ 40,00)**\nConfiguramos seu servidor com categorias organizadas, emojis de alta qualidade, cargos estruturados, permissões blindadas e bots essenciais configurados!'
        },
        {
          id: 'chan-promocoes-aura',
          name: '├─🔥・promoções',
          type: 0,
          description: 'Combos irresistíveis para turbinar seu servidor.',
          embedTitle: '🔥 Combos e Promoções Imperdíveis!',
          embedDescription: 'Quer economizar mais? Confira nossos pacotes especiais:\n\n🔥 **Combo Start (Apenas R$ 55,00)**\nCriação de Servidor Completo + 1 Bot Customizado (com 1 mês de hospedagem gratuita).\n\n⚡ **Combo Enterprise (Apenas R$ 85,00)**\nCriação de Servidor Completo + 2 Bots Customizados com funções avançadas de gerenciamento de vendas e tickets.'
        },
        {
          id: 'chan-vip-aura',
          name: '├─⭐・vip',
          type: 0,
          description: 'Planos VIP e benefícios para apoiadores.',
          embedTitle: '💎 Seja um Membro VIP Aura Premium',
          embedDescription: 'Ao assinar nosso plano VIP, você apoia o desenvolvimento de novos bots e adquire vantagens exclusivas:\n\n✔️ Isenção de taxa de configuração em novos projetos.\n✔️ Desconto permanente de 20% nas mensalidades dos seus bots.\n✔️ Acesso a comandos de bot experimentais exclusivos.\n✔️ Cargo VIP de destaque e suporte prioritário no chat.',
          allowedRoles: ['role-vip', 'role-staff', 'role-developer', 'role-founder']
        },
        {
          id: 'chan-compras-aura',
          name: '├─🛍️・compras',
          type: 0,
          description: 'Instruções para realizar sua compra com segurança.',
          embedTitle: '🛍️ Passo a Passo para Comprar seu Bot/Servidor',
          embedDescription: 'Comprar conosco é simples e seguro:\n\n1️⃣ Escolha o serviço desejado nos canais **💎・catálogo** ou **🔥・promoções**.\n2️⃣ Entre no canal **🎫・abrir-ticket** e selecione o botão adequado.\n3️⃣ Um canal privado de atendimento será aberto imediatamente com a nossa equipe.\n4️⃣ Detalhe as especificações do seu bot ou servidor para darmos início ao desenvolvimento!'
        },
        {
          id: 'chan-pagamentos-aura',
          name: '└─💳・pagamentos',
          type: 0,
          description: 'Métodos de pagamento seguros.',
          embedTitle: '💳 Métodos de Pagamento e Facilidades',
          embedDescription: 'Garantimos facilidade para você adquirir seus bots:\n\n🔹 **Pix**: Envio e início imediato do desenvolvimento (Recomendado).\n🔹 **Mercado Pago & Cartão de Crédito**: Parcele suas compras com total segurança.\n🔹 **Saldo / Boleto**.'
        }
      ]
    },
    {
      name: '🎫 ・SUPORRE',
      channels: [
        {
          id: 'chan-abrir-ticket-aura',
          name: '├─🎟️・abrir-ticket',
          type: 0,
          description: 'Abra um ticket para tirar dúvidas ou fazer pedidos.',
          embedTitle: '🎟️ Central de Atendimento & Orçamentos',
          embedDescription: 'Precisa de suporte com seu bot, quer renovar uma mensalidade ou solicitar um orçamento de servidor customizado?\n\nClique no botão abaixo correspondente à sua necessidade para iniciarmos um chat privado com nossa equipe de suporte!'
        },
        {
          id: 'chan-atendimento-aura',
          name: '├─📨・atendimento',
          type: 0,
          description: 'Informações de horários de suporte e SLAs.',
          embedTitle: '📨 Horários de Atendimento da Aura Bots Studio',
          embedDescription: 'Nossos desenvolvedores e equipe de suporte atendem nos seguintes períodos:\n\n📅 **Segunda a Sábado: 09:00 às 22:00**\n\n_Mesmo fora do horário comercial você pode abrir o seu ticket, daremos retorno assim que o primeiro desenvolvedor estiver online!_'
        },
        {
          id: 'chan-faq-aura',
          name: '├─❓・faq',
          type: 0,
          description: 'Perguntas frequentes respondidas de forma simples.',
          embedTitle: '❓ FAQ - Dúvidas Frequentes',
          embedDescription: '**1. Como funciona a mensalidade do bot?**\nA mensalidade cobre os custos de hospedagem do bot em nossa VPS 24/7 de alta velocidade e atualizações automáticas contra bugs das APIs do Discord.\n\n**2. Vocês entregam o código-fonte do bot?**\nPor padrão, o bot é hospedado por nós para sua comodidade. Caso queira o código-fonte completo (.js/.ts), consulte as taxas de compra de licença no ticket.\n\n**3. O bot tem garantia de uptime?**\nSim! Nossos servidores contam com 99.9% de uptime garantido. Qualquer instabilidade é resolvida de imediato pela nossa equipe.'
        },
        {
          id: 'chan-downloads-aura',
          name: '└─📂・downloads',
          type: 0,
          description: 'Acesso a arquivos e portfólio de projetos.',
          embedTitle: '📂 Portfólio & Downloads de Manuais',
          embedDescription: 'Confira nossos bots em ação ou faça download de manuais de comando, painéis de controle de teste e scripts complementares para integrar ao seu bot!',
          allowedRoles: ['role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-developer', 'role-founder']
        }
      ]
    },
    {
      name: '👑 ・COMUNIDADE',
      channels: [
        {
          id: 'chan-chat-aura',
          name: '├─💬・chat',
          type: 0,
          description: 'Bate-papo geral para todos os membros.',
          embedTitle: '💬 Chat Geral da Comunidade',
          embedDescription: 'Sinta-se em casa! Use este espaço para debater sobre desenvolvimento de bots, novas tecnologias, trocar ideias ou bater um papo descontraído com outros membros.'
        },
        {
          id: 'chan-prints-aura',
          name: '├─📸・prints',
          type: 0,
          description: 'Compartilhe capturas de tela e painéis de controle dos bots.',
          embedTitle: '📸 Mostre seu Servidor! (Prints)',
          embedDescription: 'Poste fotos dos painéis dos bots, prints de servidores que você montou usando nossa assessoria ou o sucesso dos sistemas da Aura Bots!'
        },
        {
          id: 'chan-clips-aura',
          name: '├─🎥・clips',
          type: 0,
          description: 'Publique vídeos curtos e gravações do bot em ação.',
          embedTitle: '🎥 Clipes, Vídeos & Demonstrações',
          embedDescription: 'Mande vídeos demonstrativos do bot executando comandos, tocando músicas, ou tutoriais de uso que você achou interessante.'
        },
        {
          id: 'chan-memes-aura',
          name: '├─😂・memes',
          type: 0,
          description: 'Humor e memes do mundo da programação.',
          embedTitle: '😂 Programação & Humor Nerd',
          embedDescription: 'Canal destinado a compartilhar memes sobre bugs, programadores, clientes engenhosos, e o mundo tech em geral!'
        },
        {
          id: 'chan-musica-text-aura',
          name: '├─🎵・música',
          type: 0,
          description: 'Comandos do bot de rádio e música do servidor.',
          embedTitle: '🎵 Comandos do Bot de Música',
          embedDescription: 'Deseja ouvir uma rádio ou música nas salas de voz? Digite os comandos de reprodução aqui para interagir com o bot musical.'
        },
        {
          id: 'chan-comandos-aura',
          name: '└─🤖・comandos',
          type: 0,
          description: 'Use os comandos públicos do bot aqui.',
          embedTitle: '🤖 Comandos de Interação e Diversão',
          embedDescription: 'Aqui você pode interagir com os bots públicos da Aura Bots Studio: consulte seu nível de XP, use comandos de diversão, economia fictícia e muito mais!'
        }
      ]
    },
    {
      name: '🎙️ ・VOZ',
      channels: [
        {
          id: 'chan-geral-1-aura',
          name: '├─🔊 Geral 01',
          type: 2,
          description: 'Canal de voz aberto para conversas casuais.'
        },
        {
          id: 'chan-geral-2-aura',
          name: '├─🔊 Geral 02',
          type: 2,
          description: 'Canal de voz aberto para conversas casuais.'
        },
        {
          id: 'chan-gaming-aura',
          name: '├─🎮 Gaming',
          type: 2,
          description: 'Conecte-se com outros programadores para jogar.'
        },
        {
          id: 'chan-reuniao-aura',
          name: '├─💼 Reunião',
          type: 2,
          description: 'Canal restrito para reuniões internas da staff.',
          allowedRoles: ['role-staff', 'role-developer', 'role-founder']
        },
        {
          id: 'chan-musica-voice-aura',
          name: '└─🎵 Música',
          type: 2,
          description: 'Canal de voz para ouvir som com bots de rádio.'
        }
      ]
    },
    {
      name: '🛠️ ・STAFF',
      channels: [
        {
          id: 'chan-logs-aura',
          name: '├─📋・logs',
          type: 0,
          description: 'Logs administrativos do bot e do servidor.',
          embedTitle: '📋 Central de Logs & Histórico',
          embedDescription: 'Canal privado para monitoramento em tempo real de ações administrativas: edições de cargos, bans/kicks, novos clientes e relatórios automáticos.',
          allowedRoles: ['role-staff', 'role-developer', 'role-founder']
        },
        {
          id: 'chan-painel-aura',
          name: '├─📊・painel',
          type: 0,
          description: 'Painel administrativo de estatísticas e financeiro.',
          embedTitle: '📊 Métricas, Faturamento e Metas',
          embedDescription: 'Acompanhamento de novos pedidos de bots, faturamento mensal das assinaturas e metas alcançadas pela Aura Bots Studio.',
          allowedRoles: ['role-staff', 'role-developer', 'role-founder']
        },
        {
          id: 'chan-config-aura',
          name: '├─⚙️・config',
          type: 0,
          description: 'Ajustes, credenciais de desenvolvimento e webhook.',
          embedTitle: '⚙️ Configurações & Webhooks Técnicos',
          embedDescription: 'Canal para disparar deploys dos bots de clientes, atualizar tokens de testes e configurar redirecionamentos Webhook.',
          allowedRoles: ['role-staff', 'role-developer', 'role-founder']
        },
        {
          id: 'chan-relatorios-aura',
          name: '├─📑・relatórios',
          type: 0,
          description: 'Relatórios automáticos de vendas e status das VPS.',
          embedTitle: '📑 Relatórios de VPS e Desempenho dos Bots',
          embedDescription: 'Relatório diário informando uso de CPU/RAM de cada bot alocado em nossa VPS, para monitorar a saúde das aplicações.',
          allowedRoles: ['role-staff', 'role-developer', 'role-founder']
        },
        {
          id: 'chan-moderacao-aura',
          name: '└─👮・moderação',
          type: 0,
          description: 'Coordenação de punições e banimentos.',
          embedTitle: '👮 Manual e Conduta de Moderação',
          embedDescription: 'Orientações oficiais de moderação. Siga a tabela de avisos e punições em caso de infração de regras no servidor principal.',
          allowedRoles: ['role-staff', 'role-developer', 'role-founder']
        }
      ]
    }
  ]
};

const PREFIX = '!';

client.once('ready', () => {
  console.log('====================================================');
  console.log(`🤖 Bot iniciado com sucesso como ${client.user.tag}!`);
  console.log('====================================================');
  console.log('👉 DIGITE "!criar" em qualquer canal para iniciar.');
  console.log('====================================================');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'criar') {
    // 1. Verificar permissão de Administrador
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Apenas administradores do servidor podem executar este comando.');
    }

    const guild = message.guild;
    
    // Se o GUILD_ID foi configurado, impedir execução fora dele
    if (GUILD_ID && GUILD_ID !== 'COLE_ID_DO_SEU_SERVIDOR_AQUI' && guild.id !== GUILD_ID) {
      return message.reply('❌ Este bot não está configurado para operar neste servidor.');
    }

    console.log(`Iniciando reestruturação no servidor ${guild.name} (${guild.id})`);
    
    let progressMsg;
    try {
      progressMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🧹 Iniciando Limpeza & Reestruturação')
            .setDescription('🧹 **Etapa 1/4:** Apagando canais antigos...\nAguarde um momento para evitar limites de requisição do Discord.')
            .setColor(0xf39c12)
            .setFooter({ text: CONFIG.storeName })
            .setTimestamp()
        ]
      });
    } catch (e) {
      console.log('Erro ao enviar mensagem inicial:', e.message);
    }

    try {
      // ETAPA 1: Apagar canais existentes (EXCETO o canal onde o comando foi enviado)
      const channels = await guild.channels.fetch();
      let deletedChansCount = 0;
      for (const [id, channel] of channels) {
        if (id === message.channel.id) continue; // Mantém o canal ativo para enviar progresso
        if (channel.deletable) {
          try {
            await channel.delete('Reestruturação Aura Bots');
            deletedChansCount++;
            await new Promise(resolve => setTimeout(resolve, 150)); // Delay para evitar rate limit
          } catch (e) {
            console.log(`Não foi possível apagar o canal ${channel.name}: ${e.message}`);
          }
        }
      }
      console.log(`Canais limpos: ${deletedChansCount}`);

      // ETAPA 2: Apagar cargos antigos customizados deletáveis (Zerar hierarquia antiga)
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🧹 Apagando Cargos Antigos')
                .setDescription('🧹 **Etapa 2/4:** Apagando todos os cargos antigos do servidor...\nAguarde.')
                .setColor(0xe74c3c)
                .setFooter({ text: CONFIG.storeName })
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const roles = await guild.roles.fetch();
      let deletedRolesCount = 0;
      for (const [id, role] of roles) {
        const isEveryone = role.id === guild.id;
        const isSelfBotRole = role.tags?.botId === client.user.id;
        
        // Deleta qualquer cargo customizado (não gerenciado por outro app, não everyone e não o próprio cargo do bot)
        if (!isEveryone && !role.managed && !isSelfBotRole) {
          try {
            await role.delete('Reset de Cargos Aura Bots');
            deletedRolesCount++;
            console.log(`Cargo "${role.name}" deletado com sucesso!`);
            await new Promise(resolve => setTimeout(resolve, 150)); // Delay para evitar rate limit
          } catch (e) {
            console.log(`⚠️ Não foi possível apagar o cargo "${role.name}": ${e.message}`);
            if (e.message.includes('Missing Permissions') || e.code === 50013) {
              console.log(`   💡 DICA: Mova o cargo do bot para o TOPO absoluto em Configurações -> Cargos.`);
            }
          }
        }
      }
      console.log(`Cargos antigos limpos: ${deletedRolesCount}`);

      // ETAPA 3: Criar novos cargos configurados
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🛡️ Criando Novos Cargos')
                .setDescription('⚙️ **Etapa 3/4:** Criando novos cargos customizados e gerando cores...\nAguarde.')
                .setColor(0x3498db)
                .setFooter({ text: CONFIG.storeName })
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const roleIdMapping = {};
      for (const r of CONFIG.roles) {
        try {
          const newRole = await guild.roles.create({
            name: r.name,
            color: r.color,
            hoist: r.hoist,
            mentionable: r.mentionable,
            reason: 'Automação de Criação Aura'
          });
          roleIdMapping[r.id] = newRole.id;
          console.log(`Cargo Criado: ${r.name}`);
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`Erro ao criar cargo ${r.name}:`, e.message);
        }
      }

      // ETAPA 4: Criar Categorias, Canais e aplicar Blindagem de Permissões
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🔒 Criando Canais Blindados')
                .setDescription('🔒 **Etapa 4/4:** Montando categorias com **canais privados por padrão** e postando os embeds...\nAguarde a conclusão.')
                .setColor(0x9b59b6)
                .setFooter({ text: CONFIG.storeName })
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const embedColor = parseInt(CONFIG.accentColor.replace('#', ''), 16) || 0xa855f7;

      for (const cat of CONFIG.categories) {
        try {
          const category = await guild.channels.create({
            name: cat.name,
            type: ChannelType.GuildCategory
          });
          await new Promise(resolve => setTimeout(resolve, 250));

          for (const chan of cat.channels) {
            try {
              // Estilização do nome do canal (minúsculas para canais de texto)
              const cleanChanName = chan.type === 2 ? chan.name : chan.name.toLowerCase().replace(/\s+/g, '-');
              
              const permissionOverwrites = [];

              // 🛡️ BLINDAGEM: Retirar visualização de canais para o cargo @everyone
              permissionOverwrites.push({
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
              });

              // Definir quais cargos do mapeamento têm direito a ver este canal
              let allowedRolesToAssign = [];

              if (chan.allowedRoles && chan.allowedRoles.length > 0) {
                allowedRolesToAssign = [...chan.allowedRoles];
              } else {
                const chanId = (chan.id || '').toLowerCase();
                const chanName = (chan.name || '').toLowerCase();
                
                if (chanId.includes('vip') || chanName.includes('vip')) {
                  allowedRolesToAssign = ['role-vip', 'role-staff', 'role-developer', 'role-founder'];
                } else if (chanId.includes('staff') || chanId.includes('painel') || chanId.includes('logs') || chanId.includes('config') || chanId.includes('relatori') || chanName.includes('staff') || chanName.includes('moderacao')) {
                  allowedRolesToAssign = ['role-staff', 'role-developer', 'role-founder'];
                } else if (chanId.includes('download') || chanName.includes('download')) {
                  allowedRolesToAssign = ['role-cliente', 'role-vip', 'role-staff', 'role-developer', 'role-founder'];
                } else {
                  // Canais públicos gerais para toda a comunidade cadastrada
                  allowedRolesToAssign = ['role-membro', 'role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-developer', 'role-founder'];
                }
              }

              // Aplicar permissões nos Overwrites
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

              // Garantir cargos de Staff sempre visualizando tudo
              const adminRoles = ['role-founder', 'role-developer', 'role-staff'];
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

              const createdChannel = await guild.channels.create({
                name: cleanChanName,
                type: chan.type === 2 ? ChannelType.GuildVoice : ChannelType.GuildText,
                parent: category.id,
                topic: chan.description || '',
                permissionOverwrites: permissionOverwrites
              });

              await new Promise(resolve => setTimeout(resolve, 200));

              // Postar as mensagens estilizadas de embed
              if (chan.type === 0 && (chan.embedTitle || chan.embedDescription)) {
                try {
                  const embed = new EmbedBuilder()
                    .setTitle(chan.embedTitle || `📌 #${chan.name}`)
                    .setDescription(chan.embedDescription || chan.description || '...')
                    .setColor(embedColor)
                    .setFooter({ text: CONFIG.storeName, iconURL: guild.iconURL() })
                    .setTimestamp();

                  await createdChannel.send({ embeds: [embed] });
                } catch (embedErr) {
                  console.error(`Erro ao postar embed em ${cleanChanName}:`, embedErr.message);
                }
              }

            } catch (chanErr) {
              console.error(`Erro ao criar o canal ${chan.name}:`, chanErr.message);
            }
          }
        } catch (catErr) {
          console.error(`Erro ao criar a categoria ${cat.name}:`, catErr.message);
        }
      }

      // Sucesso total
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🎉 Servidor Estruturado e Blindado!')
                .setDescription(`👑 Toda a estrutura de categorias, canais de texto/voz, permissões privadas e mensagens automáticas da **${CONFIG.storeName}** foram configurados com sucesso!\n\n🔒 **Blindagem Ativa:** O cargo @everyone foi proibido de ver os canais. Apenas membros que receberem cargos como Membro, VIP ou Cliente conseguirão acessar seus canais!\n\n🧹 **Cargos Limpos:** Todos os cargos e canais antigos customizados foram deletados e recriados do zero.\n\n*Você já pode apagar este canal de comando se desejar.*`)
                .setColor(0x2ecc71)
                .setFooter({ text: CONFIG.storeName })
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      console.log('✅ REESTRUTURAÇÃO COMPLETA CONCLUÍDA COM SUCESSO!');

    } catch (err) {
      console.error('Erro geral na execução:', err);
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('❌ Falha no Setup')
                .setDescription(`Ocorreu um erro geral durante a execução do setup:\n\`\`\`${err.message}\`\`\`\nConsulte o terminal do bot para mais detalhes.`)
                .setColor(0xe74c3c)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }
    }
  }
});

// Coloque o Token do seu Bot Discord abaixo (ou defina a variável de ambiente TOKEN)
require("dotenv").config();

client.login(process.env.TOKEN);
;

