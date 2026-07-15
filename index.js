/**
 * BOT DE DISCORD AUTO-CONFIGURÁVEL - AURA BOTS STUDIO
 * Versão: discord.js v14
 * 
 * 📌 REQUISITOS:
 * - Instalar a dependência: npm install discord.js
 * - Ativar as 3 "Privileged Gateway Intents" no Discord Developer Portal (Bot tab).
 * - Substituir o token na última linha pelo Token real do seu Bot.
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

// Configuração estruturada completa pré-carregada para a Aura Bots Studio
const CONFIG = {
  storeName: "Aura Bots Studio",
  accentColor: "#a855f7",
  roles: [
    { id: 'role-founder', name: '👑 Dono / Fundador', color: '#e74c3c', hoist: true, mentionable: true },
    { id: 'role-developer', name: '💻 Developer / Programador', color: '#a855f7', hoist: true, mentionable: true },
    { id: 'role-staff', name: '🛡️ Administrador / Staff', color: '#3498db', hoist: true, mentionable: true },
    { id: 'role-parceiro', name: '🤝 Parceiro / Influencer', color: '#e67e22', hoist: true, mentionable: true },
    { id: 'role-vip', name: '⭐ Cliente VIP Premium', color: '#f1c40f', hoist: true, mentionable: true },
    { id: 'role-cliente', name: '🛒 Cliente Verificado', color: '#2ecc71', hoist: true, mentionable: false },
    { id: 'role-membro', name: '👥 Membro da Comunidade', color: '#95a5a6', hoist: false, mentionable: false }
  ],
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
          description: 'Arquivos gratuitos, bots de teste e presentes exclusivos.',
          embedTitle: '🎁 Brindes e Conteúdos Gratuitos!',
          embedDescription: 'Agradecemos sua participação em nossa comunidade! Divirta-se com códigos-fontes livres de testes, guias de configuração rápidos e templates de servidores prontos disponibilizados periodicamente aqui.'
        },
        {
          id: 'chan-eventos-aura',
          name: '└─🎉・eventos',
          type: 0,
          description: 'Eventos de programação, hackathons e sorteios.',
          embedTitle: '🎉 Sorteios e Eventos da Aura',
          embedDescription: 'Quer ganhar licenças de bots, assinaturas gratuitas de hospedagem ou assessoria profissional para seu servidor? Não perca os sorteios e eventos interativos realizados neste canal!'
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
          embedDescription: 'Oferecemos soluções completas com excelente custo-benefício:\n\n🤖 **Bots Customizados (A partir de R$ 30,00)**\nDesenvolvemos qualquer sistema: Vendas automáticas, Moderação, Ticket, Economia, RPG e integrações API.\n\n⚙️ **Bot Mensal (Apenas R$ 15,00/mês)**\nTenha o seu bot ativo 24/7 hospedado em nossa VPS premium. Sem travamentos, com suporte e atualizações inclusas!\n\n💻 **Criação de Servidor Completo (A partir de R$ 20,00)**\nConfiguramos seu servidor com categorias organizadas, emojis de alta qualidade, cargos estruturados, permissões blindadas e bots essenciais configurados!'
        },
        {
          id: 'chan-promocoes-aura',
          name: '├─🔥・promoções',
          type: 0,
          description: 'Combos irresistíveis para turbinar seu servidor.',
          embedTitle: '🔥 Combos e Promoções Imperdíveis!',
          embedDescription: 'Quer economizar mais? Confira nossos pacotes especiais:\n\n🔥 **Combo Start (Apenas R$ 40,00)**\nCriação de Servidor Completo + 1 Bot Customizado (com 1 mês de hospedagem gratuita).\n\n⚡ **Combo Enterprise (Apenas R$ 75,00)**\nCriação de Servidor Completo + 2 Bots Customizados com funções avançadas de gerenciamento de vendas e tickets.'
        },
        {
          id: 'chan-vip-aura',
          name: '├─⭐・vip',
          type: 0,
          description: 'Planos VIP e benefícios para apoiadores da Aura Bots Studio.',
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
      name: '🎫 ・SUPORTE',
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
          embedDescription: 'Nossos desenvolvedores e equipe de suporte atendem nos seguintes períodos:\n\n📅 **Segunda a Sábado**: 09:00 às 22:00\n📅 **Domingos e Feriados**: Atendimento em escala de plantão.\n\n_Mesmo fora do horário comercial você pode abrir o seu ticket, daremos retorno assim que o primeiro desenvolvedor estiver online!_'
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
          embedDescription: 'Confira nossos bots em ação ou faça download de manuais de comando, painéis de controle web de teste e scripts complementares para integrar ao seu bot!',
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
  console.log(`✅ Bot online com sucesso como ${client.user.tag}!`);
  console.log('📌 Vá para o seu servidor Discord e digite !criar para rodar a automação.');
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
            reason: 'Automação Aura Bots Studio'
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

      // 4. Criar as categorias e canais com try-catch encapsulados por nível
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

              // PRIVAR CANAL: Negar para @everyone
              permissionOverwrites.push({
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
              });

              // Determinar cargos permitidos de forma inteligente e premium
              let allowedRolesToAssign = [];

              if (chan.allowedRoles && chan.allowedRoles.length > 0) {
                allowedRolesToAssign = [...chan.allowedRoles];
              } else {
                const chanId = (chan.id || '').toLowerCase();
                const chanName = (chan.name || '').toLowerCase();
                
                if (chanId.includes('vip') || chanName.includes('vip')) {
                  allowedRolesToAssign = ['role-vip', 'role-staff', 'role-designer', 'role-developer', 'role-founder'];
                } else if (chanId.includes('policia') || chanId.includes('faccao') || chanId.includes('mc') || chanName.includes('farda') || chanName.includes('moto')) {
                  allowedRolesToAssign = ['role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-designer', 'role-developer', 'role-founder'];
                } else if (chanId.includes('tutorial') || chanId.includes('instalar') || chanName.includes('como-instalar') || chanName.includes('tutorial')) {
                  allowedRolesToAssign = ['role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-designer', 'role-developer', 'role-founder'];
                } else {
                  allowedRolesToAssign = ['role-membro', 'role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-designer', 'role-developer', 'role-founder'];
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
              const adminRoles = ['role-founder', 'role-designer', 'role-developer', 'role-staff'];
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
                    .setFooter({ text: CONFIG.storeName || 'Aura Bots Studio' })
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
