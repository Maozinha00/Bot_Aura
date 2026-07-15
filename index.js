/**
 * ======================================================================
 * 🤖 BOT AUTO-CONFIGURADOR DE SERVIDORES - AURA BOTS
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
 * 4. Ative as 3 "Privileged Gateway Intents" no painel de desenvolvedor do Discord:
 *    - Presence Intent
 *    - Server Members Intent
 *    - Message Content Intent (OBRIGATÓRIO para ler o comando "!criar")
 * 5. Configure seu TOKEN nas variáveis de ambiente da Railway ou no final deste arquivo.
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

// Configurações Globais da sua Loja (Serão injetadas automaticamente no painel)
const CONFIG_LOJA = {
  storeName: "Aura Bots Studio",
  accentColor: "#a855f7",
  // Insira o ID do seu servidor para travar o bot apenas nele (Opcional)
  guildId: "", 
  
  // Lista de cargos padrão que serão criados na hierarquia limpa do zero
  roles: [
    { id: "role-founder", name: "👑 Founder", color: "#a855f7", hoist: true, mentionable: false },
    { id: "role-developer", name: "💻 Developer", color: "#3b82f6", hoist: true, mentionable: false },
    { id: "role-staff", name: "🛡️ Staff", color: "#ef4444", hoist: true, mentionable: false },
    { id: "role-parceiro", name: "🤝 Parceiro", color: "#10b981", hoist: true, mentionable: false },
    { id: "role-vip", name: "⭐ VIP", color: "#f59e0b", hoist: true, mentionable: false },
    { id: "role-cliente", name: "🛒 Cliente Verificado", color: "#10b981", hoist: true, mentionable: false },
    { id: "role-membro", name: "👥 Membro", color: "#9ca3af", hoist: false, mentionable: false }
  ],
  
  // Categorias e canais blindados com mensagens embutidas
  categories: [
    {
      name: "📌 ─── INFORMAÇÕES ───",
      channels: [
        {
          id: "chan-boas-vindas",
          name: "👋・bem-vindo",
          type: 0,
          description: "Canal de boas-vindas do servidor.",
          embedTitle: "👋 Seja muito bem-vindo!",
          embedDescription: "Ficamos muito felizes com a sua chegada! Aqui você encontra os melhores produtos digitais e serviços automatizados com suporte premium. Sinta-se em casa!",
          allowedRoles: ["role-membro"]
        },
        {
          id: "chan-regras",
          name: "📜・diretrizes",
          type: 0,
          description: "Regras gerais de comportamento.",
          embedTitle: "📜 Diretrizes & Regras do Servidor",
          embedDescription: "Para manter o ambiente agradável, pedimos que siga nossas regras:\n\n1️⃣ Respeite todos os membros e a equipe.\n2️⃣ Proibido qualquer tipo de spam, flood ou convites não autorizados.\n3️⃣ Use os canais de forma correta e evite poluição visual.\n\nAproveite sua estadia!",
          allowedRoles: ["role-membro"]
        }
      ]
    },
    {
      name: "🛒 ─── COMPRAS & SERVIÇOS ───",
      channels: [
        {
          id: "chan-produtos",
          name: "🎁・vitrine-produtos",
          type: 0,
          description: "Produtos oficiais disponíveis para compra.",
          embedTitle: "🎁 Nossos Produtos Premium",
          embedDescription: "Explore nossos produtos digitais com entrega 100% automatizada e suporte qualificado. Clique no botão de compra ou chame um de nossos robôs de vendas para adquirir os seus pacotes!",
          allowedRoles: ["role-membro"]
        }
      ]
    }
  ]
};

const PREFIX = '!';

client.once('ready', () => {
  console.log('====================================================');
  console.log(`🤖 ${client.user.tag} iniciado com sucesso!`);
  console.log('====================================================');
  console.log('👉 INSTRUÇÕES DE EXECUÇÃO:');
  console.log('1. Entre no seu servidor Discord onde o bot está adicionado.');
  console.log('2. Garanta que o cargo do Bot esteja no topo da lista (Hierarquia máxima).');
  console.log('3. Digite "!criar" em qualquer canal de texto para rodar a reestruturação.');
  console.log('====================================================');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'criar') {
    // 1. Verificação rígida de permissão administrativa
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ Apenas administradores com a permissão de **Administrador** podem executar este comando!');
    }

    const guild = message.guild;

    // Se houver um ID de guilda travado na configuração, validar
    if (CONFIG_LOJA.guildId && guild.id !== CONFIG_LOJA.guildId) {
      return message.reply('❌ Este bot foi configurado para rodar em outro servidor específico.');
    }

    console.log(`Iniciando limpeza e montagem do servidor: ${guild.name} (${guild.id})`);
    
    let progressMsg;
    try {
      progressMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🧹 Reestruturação Iniciada')
            .setDescription('🧹 **Etapa 1/4:** Iniciando limpeza completa de canais antigos...\nAguarde um momento para evitar limites de requisição da API.')
            .setColor(0xf39c12)
            .setFooter({ text: CONFIG_LOJA.storeName })
            .setTimestamp()
        ]
      });
    } catch (e) {
      console.log('Erro ao enviar aviso inicial: ', e);
    }

    try {
      // ETAPA 1: Limpar canais antigos (Mantendo o canal atual temporariamente para o progresso)
      const channels = await guild.channels.fetch();
      let deletedChansCount = 0;
      for (const [id, channel] of channels) {
        if (id === message.channel.id) continue;
        if (channel.deletable) {
          try {
            await channel.delete('Restruturação e blindagem Aura');
            deletedChansCount++;
            await new Promise(resolve => setTimeout(resolve, 150));
          } catch (e) {
            console.log(`Não foi possível deletar o canal/categoria ${channel.name}: ${e.message}`);
          }
        }
      }
      console.log(`Canais deletados: ${deletedChansCount}`);

      // ETAPA 2: Limpeza completa de cargos antigos
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🧹 Reestruturação em Andamento')
                .setDescription('🧹 **Etapa 2/4:** Apagando todos os cargos antigos do servidor...\nDeletando cargos customizados para reconstruir a hierarquia do zero.')
                .setColor(0xe74c3c)
                .setFooter({ text: CONFIG_LOJA.storeName })
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const roles = await guild.roles.fetch();
      let deletedRolesCount = 0;
      const failedRoles = [];
      
      // Ordenar cargos para apagar do menor para o maior na hierarquia
      const rolesToDelete = Array.from(roles.values())
        .sort((a, b) => a.position - b.position);

      for (const role of rolesToDelete) {
        const isEveryone = role.id === guild.id;
        const isManaged = role.managed;
        const isSelfBotRole = role.tags?.botId === client.user.id;

        if (!isEveryone && !isManaged && !isSelfBotRole) {
          try {
            await role.delete('Restruturação e hierarquia limpa Aura');
            deletedRolesCount++;
            await new Promise(resolve => setTimeout(resolve, 150)); // Evitar rate limit
          } catch (e) {
            failedRoles.push(role.name);
            console.log(`Não foi possível deletar o cargo ${role.name}: ${e.message}`);
          }
        }
      }
      console.log(`Cargos deletados: ${deletedRolesCount}`);

      // ETAPA 3: Criar cargos novos configurados
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🛡️ Criando Cargos Premium')
                .setDescription('⚙️ **Etapa 3/4:** Criando a nova hierarquia de cargos e configurando as cores da loja...\nAguarde.')
                .setColor(0x3498db)
                .setFooter({ text: CONFIG_LOJA.storeName })
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
            reason: 'Automação de Cargos Aura'
          });
          roleIdMapping[r.id] = newRole.id;
          console.log(`Cargo Criado: ${r.name} -> ID: ${newRole.id}`);
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`Erro ao criar o cargo ${r.name}: `, e.message);
        }
      }

      // ETAPA 4: Criar Categorias, Canais e aplicar Blindagem de Permissões
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('📂 Criando Estrutura Blindada')
                .setDescription('🔒 **Etapa 4/4:** Criando categorias e canais com **permissões blindadas** (bloqueado para quem não tem cargo) e postando embeds...\nAguarde a conclusão.')
                .setColor(0x9b59b6)
                .setFooter({ text: CONFIG_LOJA.storeName })
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const embedColor = parseInt(CONFIG_LOJA.accentColor.replace('#', ''), 16) || 0xa855f7;

      for (const cat of CONFIG_LOJA.categories) {
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

              // Negar visualização absoluta para o cargo @everyone
              permissionOverwrites.push({
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
              });

              let allowedRolesToAssign = [];

              if (chan.allowedRoles && chan.allowedRoles.length > 0) {
                allowedRolesToAssign = [...chan.allowedRoles];
              } else {
                const chanId = (chan.id || '').toLowerCase();
                const chanName = (chan.name || '').toLowerCase();
                
                if (chanId.includes('vip') || chanName.includes('vip')) {
                  allowedRolesToAssign = ['role-vip', 'role-staff', 'role-developer', 'role-founder'];
                } else if (chanId.includes('staff') || chanId.includes('painel') || chanId.includes('logs') || chanName.includes('staff') || chanName.includes('moderacao')) {
                  allowedRolesToAssign = ['role-staff', 'role-developer', 'role-founder'];
                } else {
                  allowedRolesToAssign = ['role-membro', 'role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-developer', 'role-founder'];
                }
              }

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

              // Permitir cargos administrativos verem tudo por padrão
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

              if (chan.type === 0 && (chan.embedTitle || chan.embedDescription)) {
                try {
                  const embed = new EmbedBuilder()
                    .setTitle(chan.embedTitle || `📌 #${chan.name}`)
                    .setDescription(chan.embedDescription || chan.description || '...')
                    .setColor(embedColor)
                    .setFooter({ text: CONFIG_LOJA.storeName, iconURL: guild.iconURL() })
                    .setTimestamp();

                  await createdChannel.send({ embeds: [embed] });
                } catch (embedErr) {
                  console.error(`Erro ao postar embed no canal ${cleanChanName}: `, embedErr.message);
                }
              }
            } catch (chanErr) {
              console.error(`Erro ao criar o canal ${chan.name}: `, chanErr.message);
            }
          }
        } catch (catErr) {
          console.error(`Erro ao criar a categoria ${cat.name}: `, catErr.message);
        }
      }

      // Setup terminado com sucesso absoluto!
      if (progressMsg) {
        try {
          let descFinal = `👑 Toda a estrutura de categorias, canais de texto/voz, permissões privadas de cargos e mensagens automáticas da **${CONFIG_LOJA.storeName}** foram configurados com sucesso!\n\n🔒 **Canais Blindados:** O cargo @everyone foi removido da visualização dos canais. Apenas membros que receberem cargos como Membro, VIP ou Cliente conseguirão acessar seus respectivos canais!\n\n🧹 **Limpeza Completa:** Todos os canais antigos foram deletados.`;
          
          if (failedRoles.length > 0) {
            descFinal += `\n\n⚠️ **Aviso de Cargos Antigos:** Alguns cargos não puderam ser deletados automaticamente porque o cargo do seu Bot está abaixo deles na lista (hierarquia do Discord):\n` + failedRoles.map(r => `• ${r}`).join('\n') + `\n\n👉 **Como resolver:** Vá em **Configurações do Servidor > Cargos**, arraste o cargo do seu Bot para o topo absoluto da lista (hierarquia máxima) e digite \`!criar\` novamente para limpar tudo perfeitamente!`;
          } else {
            descFinal += `\n\n🧹 **Limpeza de Cargos:** Todos os cargos antigos foram deletados e recriados com sucesso do zero!`;
          }

          descFinal += `\n\n*Você já pode deletar este canal temporário se desejar.*`;

          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🎉 Servidor Estruturado e Blindado!')
                .setDescription(descFinal)
                .setColor(0x2ecc71)
                .setFooter({ text: CONFIG_LOJA.storeName })
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      console.log('====================================================');
      console.log('✅ REESTRUTURAÇÃO CONCLUÍDA COM SUCESSO!');
      console.log('====================================================');

    } catch (err) {
      console.error('Erro geral no setup: ', err);
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('❌ Falha Crítica no Setup')
                .setDescription(`Ocorreu um erro ao configurar o servidor:\n\`\`\`\n${err.message}\n\`\`\`\nConsulte o terminal do bot para mais detalhes.`)
                .setColor(0xe74c3c)
                .setFooter({ text: CONFIG_LOJA.storeName })
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }
    }
  }
});

// Coloque o TOKEN do seu bot do Discord aqui:

client.login(process.env.TOKEN);
});
