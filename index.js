/**
 * ======================================================================
 * 🤖 BOT AUTO-CONFIGURADOR DE SERVIDORES - AURA BOTS STUDIO
 * Versão: discord.js v14
 * 
 * 🔒 BLINDAGEM TOTAL: Canais totalmente privados por padrão.
 * 🧹 LIMPEZA COMPLETA: Apaga TODOS os canais e cargos antigos.
 * ======================================================================
 * 
 * 📌 COMO INSTALAR E RODAR:
 * 1. Crie uma pasta vazia no seu computador e abra o terminal/prompt.
 * 2. Rode: npm install discord.js dotenv
 * 3. Crie um arquivo chamado "index.js" e cole este código completo dentro dele.
 * 4. Ative as "Privileged Gateway Intents" no painel de desenvolvedor do Discord (aba Bot):
 *    - Message Content Intent (OBRIGATÓRIO para ler o comando "!criar")
 *    - Server Members Intent (Recomendado para manipulação de cargos)
 * 5. Coloque o Token do seu bot no final do arquivo ou configure uma variável de ambiente TOKEN.
 * 6. Rode o bot usando: node index.js
 * 7. Digite "!criar" no canal do seu servidor Discord para rodar a automação completa.
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

// Configurações Globais da Loja
const CONFIG_LOJA = {
  storeName: "Aura Bots Studio",
  accentColor: "#a855f7", // Cor Violeta Aura
  guildId: "", // Deixe em branco para aceitar em qualquer servidor com permissão de administrador
  
  // Cargos customizados a serem criados automaticamente
  roles: [
    { id: 'role-founder', name: '👑 Dono / Fundador', color: '#e74c3c', hoist: true, mentionable: true },
    { id: 'role-developer', name: '💻 Developer / Programador', color: '#a855f7', hoist: true, mentionable: true },
    { id: 'role-staff', name: '🛡️ Administrador / Staff', color: '#3498db', hoist: true, mentionable: true },
    { id: 'role-parceiro', name: '🤝 Parceiro / Influencer', color: '#e67e22', hoist: true, mentionable: true },
    { id: 'role-vip', name: '⭐ Cliente VIP Premium', color: '#f1c40f', hoist: true, mentionable: true },
    { id: 'role-cliente', name: '🛒 Cliente Verificado', color: '#2ecc71', hoist: true, mentionable: false },
    { id: 'role-membro', name: '👥 Membro da Comunidade', color: '#95a5a6', hoist: false, mentionable: false }
  ],
  
  // Estrutura de categorias, canais e mensagens em embeds
  categories: [
    {
      name: '╔══ 📌 INFO & COMUNIDADE ══╗',
      channels: [
        {
          id: 'chan-boas-vindas-aura',
          name: '├─👋・boas-vindas',
          type: 0,
          description: 'Recepção e introdução ao Aura Bots Studio.',
          embedTitle: '👋 Bem-vindo ao Aura Bots Studio!',
          embedDescription: 'Seja muito bem-vindo ao melhor centro de desenvolvimento de Bots do Discord e Servidores prontos!\n\nAqui você encontrará soluções completas, servidores otimizados, bots dedicados com suporte ativo e hospedagem premium VPS.\n\n📌 **Como começar?**\n📖 Consulte as nossas regras no canal de regras.\n📢 Fique de olho nas novidades em anúncios.\n🛒 Dê uma olhada no nosso catálogo de serviços.'
        },
        {
          id: 'chan-anuncios-aura',
          name: '├─📢・anúncios',
          type: 0,
          description: 'Novidades importantes e comunicados oficiais.',
          embedTitle: '📢 Novidades e Comunicados Oficiais',
          embedDescription: 'Fique por dentro de todos os novos lançamentos de bots, cupons especiais, atualizações de APIs e novidades de desenvolvimento da Aura Bots Studio.'
        },
        {
          id: 'chan-regras-aura',
          name: '├─📖・regras',
          type: 0,
          description: 'Normas de convivência da comunidade.',
          embedTitle: '📖 Regulamento & Diretrizes da Comunidade',
          embedDescription: 'Para garantir um ambiente saudável e profissional, pedimos que todos sigam nossas regras simples:\n\n1️⃣ **Respeito Mútuo**: Sem insultos ou preconceitos.\n2️⃣ **Divulgação proibida**: Não anuncie serviços ou outros bots sem autorização.\n3️⃣ **Sem Spam/Flood**: Utilize os canais adequados para interagir.\n4️⃣ **Atendimento oficial**: Dúvidas técnicas e compras devem ser tratadas estritamente em seu Ticket individual.'
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
          description: 'Tabela de preços oficial e catálogo de serviços.',
          embedTitle: '🤖 Catálogo de Bots & Criação de Servidores',
          embedDescription: 'Oferecemos soluções completas com excelente custo-benefício:\n\n🤖 **Bots Customizados (A partir de R$ 30,00)**\nDesenvolvemos qualquer sistema: Vendas automáticas, Moderação, Ticket, Economia, RPG e integrações API.\n\n⚙️ **Bot Mensal (Apenas R$ 15,00/mês)**\nTenha o seu bot ativo 24/7 hospedado em nossa VPS premium. Sem travamentos, com suporte e atualizações inclusas!\n\n💻 **Criação de Servidor Completo (Apenas R$ 40,00)**\nConfiguramos seu servidor com categorias organizadas, emojis de alta qualidade, cargos estruturados, permissões blindadas e bots essenciais configurados!'
        },
        {
          id: 'chan-promocoes-aura',
          name: '├─🔥・promoções',
          type: 0,
          description: 'Combos promocionais imperdíveis.',
          embedTitle: '🔥 Combos e Promoções Imperdíveis!',
          embedDescription: 'Quer economizar mais? Confira nossos pacotes especiais:\n\n🔥 **Combo Start (Apenas R$ 55,00)**\nCriação de Servidor Completo + 1 Bot Customizado (com 1 mês de hospedagem gratuita).\n\n⚡ **Combo Enterprise (Apenas R$ 85,00)**\nCriação de Servidor Completo + 2 Bots Customizados com funções avançadas de gerenciamento de vendas e tickets.'
        },
        {
          id: 'chan-vip-aura',
          name: '├─⭐・vip',
          type: 0,
          description: 'Planos VIP e apoiadores premium.',
          embedTitle: '💎 Seja um Membro VIP Aura Premium',
          embedDescription: 'Ao assinar nosso plano VIP, você apoia o desenvolvimento de novos bots e adquire vantagens exclusivas:\n\n✔️ Isenção de taxa de configuração em novos projetos.\n✔️ Desconto permanente de 20% nas mensalidades dos seus bots.\n✔️ Acesso a comandos de bot experimentais exclusivos.\n✔️ Cargo VIP de destaque e suporte prioritário no chat.',
          allowedRoles: ['role-vip', 'role-staff', 'role-developer', 'role-founder']
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
          description: 'Abertura de chat de suporte privado.',
          embedTitle: '🎟️ Central de Atendimento & Orçamentos',
          embedDescription: 'Precisa de suporte com seu bot, quer renovar uma mensalidade ou solicitar um orçamento de servidor customizado?\n\nClique no botão abaixo correspondente à sua necessidade para iniciarmos um chat privado com nossa equipe de suporte!'
        }
      ]
    },
    {
      name: '🎙️ ・CANAIS DE VOZ',
      channels: [
        { id: 'chan-geral-voice', name: '├─🔊 Geral 01', type: 2 },
        { id: 'chan-reuniao-voice', name: '└─💼 Reunião Privada', type: 2, allowedRoles: ['role-staff', 'role-developer', 'role-founder'] }
      ]
    }
  ]
};

const PREFIX = '!';

client.once('ready', () => {
  console.log('====================================================');
  console.log(`🤖 ${client.user.tag} iniciado com sucesso!`);
  console.log('====================================================');
  console.log('📌 DIGITE "!criar" no servidor para rodar a automação.');
  console.log('====================================================');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'criar') {
    // 1. Verificação rígida de permissão administrativa
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Apenas membros com permissão de **Administrador** podem executar este comando!');
    }

    const guild = message.guild;

    // Validar se está rodando na guilda correta caso configurado
    if (CONFIG_LOJA.guildId && guild.id !== CONFIG_LOJA.guildId) {
      return message.reply('❌ Este bot não está configurado para operar neste servidor.');
    }

    console.log(`Iniciando reestruturação completa: ${guild.name}`);
    
    let progressMsg;
    try {
      progressMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🧹 Reestruturação Iniciada')
            .setDescription('🧹 **Etapa 1/4:** Limpando canais antigos...\nAguarde alguns instantes.')
            .setColor(0xf39c12)
            .setTimestamp()
        ]
      });
    } catch (e) {
      console.log('Erro ao enviar progresso inicial:', e.message);
    }

    try {
      // ETAPA 1: Limpeza completa de canais (Exceto o canal atual do comando)
      const channels = await guild.channels.fetch();
      let deletedChansCount = 0;
      for (const [id, channel] of channels) {
        if (id === message.channel.id) continue;
        if (channel.deletable) {
          try {
            await channel.delete('Reestruturação e blindagem Aura');
            deletedChansCount++;
            await new Promise(resolve => setTimeout(resolve, 150)); // Evitar limite de requisições (rate limits)
          } catch (e) {
            console.log(`Não foi possível deletar canal: ${channel.name}`);
          }
        }
      }

      // ETAPA 2: Limpeza completa de cargos customizados antigos
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🧹 Reestruturação em Andamento')
                .setDescription('🧹 **Etapa 2/4:** Apagando todos os cargos antigos do servidor...\nAguarde a conclusão.')
                .setColor(0xe74c3c)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const roles = await guild.roles.fetch();
      let deletedRolesCount = 0;
      for (const [id, role] of roles) {
        const isEveryone = role.id === guild.id;
        const isBotRole = role.name === client.user.username;
        const isManaged = role.managed;
        const isDeletable = role.deletable;

        // Deletar se não for everyone, cargo do próprio bot, ou gerenciado externamente
        if (!isEveryone && !isManaged && isDeletable && !isBotRole) {
          try {
            await role.delete('Restruturação de cargos Aura');
            deletedRolesCount++;
            await new Promise(resolve => setTimeout(resolve, 150));
          } catch (e) {
            console.log(`Não foi possível deletar cargo: ${role.name}`);
          }
        }
      }

      // ETAPA 3: Criação de novos cargos customizados
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🛡️ Criando Cargos Premium')
                .setDescription('⚙️ **Etapa 3/4:** Criando a nova hierarquia de cargos e configurando as cores da loja...\nAguarde.')
                .setColor(0x3498db)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const roleIdMapping = {};
      for (const r of CONFIG_LOJA.roles) {
        try {
          const colorHex = r.color.replace('#', '');
          const newRole = await guild.roles.create({
            name: r.name,
            color: parseInt(colorHex, 16) || 0,
            hoist: r.hoist,
            mentionable: r.mentionable,
            reason: 'Configuração Automática Aura'
          });
          roleIdMapping[r.id] = newRole.id;
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`Erro ao criar cargo ${r.name}:`, e.message);
        }
      }

      // ETAPA 4: Criar Categorias, Canais e aplicar Blindagem
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('📂 Criando Estrutura Blindada')
                .setDescription('🔒 **Etapa 4/4:** Criando categorias e canais privados (bloqueado para quem não tem cargo) e postando os embeds do catálogo...\nAguarde.')
                .setColor(0x9b59b6)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const embedColor = parseInt(CONFIG_LOJA.accentColor.replace('#', ''), 16) || 0xa855f7;

      for (const cat of CONFIG_LOJA.categories) {
        try {
          const category = await guild.channels.create({
            name: cat.name,
            type: ChannelType.GuildCategory
          });
          await new Promise(resolve => setTimeout(resolve, 200));

          for (const chan of cat.channels) {
            try {
              const cleanChanName = chan.type === 2 ? chan.name : chan.name.toLowerCase().replace(/\s+/g, '-');
              
              const permissionOverwrites = [];

              // 🛡️ BLINDAGEM DE CANAL: Negar permissão de visualização para o @everyone (visitantes)
              permissionOverwrites.push({
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
              });

              // Descobrir quais cargos têm permissão para ler esse canal
              let allowedRolesToAssign = [];
              if (chan.allowedRoles && chan.allowedRoles.length > 0) {
                allowedRolesToAssign = [...chan.allowedRoles];
              } else {
                const chanId = (chan.id || '').toLowerCase();
                const chanName = (chan.name || '').toLowerCase();
                
                if (chanId.includes('vip') || chanName.includes('vip')) {
                  allowedRolesToAssign = ['role-vip', 'role-staff', 'role-developer', 'role-founder'];
                } else if (chanId.includes('staff') || chanId.includes('painel') || chanId.includes('logs') || chanId.includes('config') || chanName.includes('staff') || chanName.includes('moderacao')) {
                  allowedRolesToAssign = ['role-staff', 'role-developer', 'role-founder'];
                } else {
                  allowedRolesToAssign = ['role-membro', 'role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-developer', 'role-founder'];
                }
              }

              // Adicionar permissão de visualização para cargos válidos
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

              // Garantir cargos de diretoria visualizando sempre tudo
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

              // Criar o canal na categoria com a blindagem ativa
              const createdChannel = await guild.channels.create({
                name: cleanChanName,
                type: chan.type === 2 ? ChannelType.GuildVoice : ChannelType.GuildText,
                parent: category.id,
                topic: chan.description || '',
                permissionOverwrites: permissionOverwrites
              });

              await new Promise(resolve => setTimeout(resolve, 200));

              // Enviar embed configurado caso seja canal de texto com embed definido
              if (chan.type === 0 && (chan.embedTitle || chan.embedDescription)) {
                try {
                  const embed = new EmbedBuilder()
                    .setTitle(chan.embedTitle)
                    .setDescription(chan.embedDescription)
                    .setColor(embedColor)
                    .setFooter({ text: CONFIG_LOJA.storeName, iconURL: guild.iconURL() })
                    .setTimestamp();

                  await createdChannel.send({ embeds: [embed] });
                } catch (embedErr) {
                  console.error(`Erro ao enviar embed no canal ${cleanChanName}:`, embedErr.message);
                }
              }
            } catch (chanErr) {
              console.error(`Erro ao criar canal ${chan.name}:`, chanErr.message);
            }
          }
        } catch (catErr) {
          console.error(`Erro ao criar categoria ${cat.name}:`, catErr.message);
        }
      }

      // Enviar mensagem de sucesso final
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🎉 Servidor Estruturado e Blindado!')
                .setDescription(`👑 Toda a estrutura de categorias, canais, permissões privadas de cargos e embeds automáticos da **${CONFIG_LOJA.storeName}** foram configurados com sucesso!\n\n🔒 **Canais Blindados:** O cargo @everyone foi removido da visualização. Apenas membros que receberem cargos conseguirão acessar os canais.\n\n🧹 **Limpeza Completa:** Todos os cargos e canais antigos foram apagados de forma limpa.`)
                .setColor(0x2ecc71)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

    } catch (err) {
      console.error('Erro no setup:', err.message);
    }
  }
});

// TOKEN do seu Bot Discord (Mantenha seguro)
client.login(process.env.TOKEN);

client.login(TOKEN).catch(err => {
  console.error('❌ Falha ao logar o bot no Discord. Verifique o TOKEN!');
});
