/**
 * ======================================================================
 * 🤖 BOT AUTO-CONFIGURADOR DE SERVIDORES - PREMIUM (v14)
 * 
 * 🔒 BLINDAGEM TOTAL: Canais totalmente privados por padrão.
 * 🧹 LIMPEZA COMPLETA: Apaga TODOS os canais e cargos antigos.
 * ======================================================================
 * 
 * 📌 COMO INSTALAR E RODAR:
 * 1. Crie uma pasta vazia no seu computador.
 * 2. Abra o terminal nessa pasta e rode: npm install discord.js dotenv
 * 3. Crie um arquivo chamado "index.js" e cole este código dentro dele.
 * 4. Ative as 3 "Privileged Gateway Intents" no painel de desenvolvedor do Discord (Bot):
 *    - Presence Intent
 *    - Server Members Intent (Para gerenciar cargos)
 *    - Message Content Intent (OBRIGATÓRIO para ler o comando "!criar")
 * 5. Configure o TOKEN do seu bot no final do arquivo ou no arquivo .env
 * 6. Inicie o bot no terminal: node index.js
 * 7. Digite "!criar" em qualquer canal do servidor para iniciar a mágica!
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

// Configurações dinâmicas que você edita na interface do App
const CONFIG_LOJA = {
  storeName: "Sua Loja", // Substituído automaticamente pelo nome configurado no painel
  accentColor: "#a855f7",
  guildId: "", // Cole o ID do servidor aqui caso queira travar em um único servidor
  roles: [], // Seus cargos definidos
  categories: [] // Suas categorias e canais
};

const PREFIX = '!';

client.once('ready', () => {
  console.log('====================================================');
  console.log(`🤖 ${client.user.tag} iniciado com sucesso!`);
  console.log('====================================================');
  console.log('👉 INSTRUÇÕES:');
  console.log('1. Entre no seu servidor Discord.');
  console.log('2. Coloque o cargo do Bot no topo absoluto da lista (hierarquia máxima).');
  console.log('3. Digite "!criar" em qualquer canal para rodar a automação.');
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

    console.log(`Iniciando limpeza e montagem do servidor: ${guild.name} (${guild.id})`);
    
    let progressMsg;
    try {
      progressMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🧹 Reestruturação Iniciada')
            .setDescription('🧹 **Etapa 1/4:** Iniciando limpeza completa de canais antigos...\nAguarde um momento.')
            .setColor(0xf39c12)
            .setFooter({ text: CONFIG_LOJA.storeName })
            .setTimestamp()
        ]
      });
    } catch (e) {
      console.log('Erro ao enviar aviso inicial: ', e);
    }

    try {
      // ETAPA 1: Limpar canais antigos (EXCETO o canal onde foi digitado o comando)
      const channels = await guild.channels.fetch();
      let deletedChansCount = 0;
      for (const [id, channel] of channels) {
        if (id === message.channel.id) continue;
        if (channel.deletable) {
          try {
            await channel.delete('Reestruturação Aura');
            deletedChansCount++;
            await new Promise(resolve => setTimeout(resolve, 150)); // Pausa anti-rate-limit
          } catch (e) {
            console.log(`Não foi possível deletar o canal/categoria ${channel.name}: ${e.message}`);
          }
        }
      }

      // ETAPA 2: Limpeza completa e segura de cargos antigos
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
      
      // Ordenar do menor ao maior para deletar sem quebra de hierarquia
      const rolesToDelete = Array.from(roles.values())
        .sort((a, b) => a.position - b.position);

      for (const role of rolesToDelete) {
        const isEveryone = role.id === guild.id;
        const isManaged = role.managed;
        const isSelfBotRole = role.tags?.botId === client.user.id;

        if (!isEveryone && !isManaged && !isSelfBotRole) {
          try {
            await role.delete('Hierarquia limpa');
            deletedRolesCount++;
            await new Promise(resolve => setTimeout(resolve, 150));
          } catch (e) {
            failedRoles.push(role.name);
            console.log(`Não foi possível deletar o cargo ${role.name}: ${e.message}`);
          }
        }
      }

      // ETAPA 3: Criar cargos configurados
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
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`Erro ao criar o cargo ${r.name}: `, e.message);
        }
      }

      // ETAPA 4: Criar Categorias, Canais e aplicar Blindagem de Permissões
      const totalCategories = CONFIG_LOJA.categories.length;
      const totalChannels = CONFIG_LOJA.categories.reduce((acc, c) => acc + (c.channels ? c.channels.length : 0), 0);
      let createdCategoriesCount = 0;
      let createdChannelsCount = 0;

      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('📂 Criando Estrutura Blindada')
                .setDescription(`🔒 **Etapa 4/4:** Preparando criação de canais com **permissões blindadas**...\n\n📁 **Categorias:** 0 de ${totalCategories} criadas\n💬 **Canais:** 0 de ${totalChannels} criados\n\n_Iniciando em instantes..._`)
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
          const category = await guild.channels.create({
            name: cat.name,
            type: ChannelType.GuildCategory
          });
          createdCategoriesCount++;

          if (progressMsg) {
            try {
              await progressMsg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setTitle('📂 Criando Estrutura Blindada')
                    .setDescription(`🔒 **Etapa 4/4:** Criando categorias e canais...\n\n📁 **Categorias:** ${createdCategoriesCount} de ${totalCategories} criadas\n💬 **Canais:** ${createdChannelsCount} de ${totalChannels} criados\n\n*Criando categoria:* **${cat.name}**\n\n_Aguarde, configurando canais desta categoria..._`)
                    .setColor(0x9b59b6)
                    .setFooter({ text: CONFIG_LOJA.storeName })
                    .setTimestamp()
                ]
              });
            } catch (e) {}
          }

          await new Promise(resolve => setTimeout(resolve, 350));

          for (const chan of cat.channels) {
            try {
              const rawChanName = chan.name || 'canal-sem-nome';
              const cleanChanName = chan.type === 2 ? rawChanName : rawChanName.toLowerCase().replace(/\s+/g, '-');

              const permissionOverwrites = [];

              // Negar visualização total para o cargo @everyone (visitantes)
              permissionOverwrites.push({
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
              });

              // Determinar quem pode ver este canal
              let allowedRolesToAssign = [];
              if (chan.allowedRoles && chan.allowedRoles.length > 0) {
                allowedRolesToAssign = [...chan.allowedRoles];
              } else {
                const chanName = (chan.name || '').toLowerCase();
                if (chanName.includes('vip')) {
                  allowedRolesToAssign = ['role-vip', 'role-staff', 'role-developer', 'role-founder'];
                } else if (chanName.includes('staff') || chanName.includes('painel') || chanName.includes('logs') || chanName.includes('moderacao')) {
                  allowedRolesToAssign = ['role-staff', 'role-developer', 'role-founder'];
                } else if (chanName.includes('download')) {
                  allowedRolesToAssign = ['role-cliente', 'role-vip', 'role-staff', 'role-developer', 'role-founder'];
                } else {
                  allowedRolesToAssign = ['role-membro', 'role-cliente', 'role-vip', 'role-parceiro', 'role-staff', 'role-developer', 'role-founder'];
                }
              }

              // Aplicar permissões
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

              // Staff sempre vê tudo
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

              // Criar o canal
              const createdChannel = await guild.channels.create({
                name: cleanChanName,
                type: chan.type === 2 ? ChannelType.GuildVoice : ChannelType.GuildText,
                parent: category.id,
                topic: chan.description || '',
                permissionOverwrites: permissionOverwrites
              });

              createdChannelsCount++;

              if (progressMsg) {
                try {
                  await progressMsg.edit({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle('📂 Criando Estrutura Blindada')
                        .setDescription(`🔒 **Etapa 4/4:** Criando categorias e canais...\n\n📁 **Categorias:** ${createdCategoriesCount} de ${totalCategories} criadas\n💬 **Canais:** ${createdChannelsCount} de ${totalChannels} criados\n\n*Criado com sucesso:* **${cleanChanName}**\n\n_Aguarde... Configurando permissões de privacidade._`)
                        .setColor(0x9b59b6)
                        .setFooter({ text: CONFIG_LOJA.storeName })
                        .setTimestamp()
                    ]
                  });
                } catch (e) {}
              }

              await new Promise(resolve => setTimeout(resolve, 350));

              // Se for canal de texto e possuir embed configurado, postar o embed
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

      // Conclusão com Sucesso Absoluto
      if (progressMsg) {
        try {
          let descFinal = `👑 Toda a estrutura de categorias, canais de texto/voz, permissões privadas de cargos e mensagens automáticas da **${CONFIG_LOJA.storeName}** foram configurados com sucesso!\n\n🔒 **Canais Blindados:** O cargo @everyone foi removido da visualização dos canais. Apenas membros autorizados conseguirão acessar!\n\n🧹 **Limpeza Completa:** Todos os canais antigos foram deletados.`;
          
          if (failedRoles.length > 0) {
            descFinal += `\n\n⚠️ **Aviso de Cargos Antigos:** Alguns cargos não puderam ser deletados automaticamente porque o cargo do seu Bot está abaixo deles na lista (hierarquia do Discord):\n` + failedRoles.map(r => `• ${r}`).join('\n') + `\n\n👉 **Como resolver:** Vá em **Configurações do Servidor > Cargos**, arraste o cargo do seu Bot para o topo absoluto da lista e digite \`!criar\` novamente para limpar tudo perfeitamente!`;
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

      console.log('✅ REESTRUTURAÇÃO CONCLUÍDA COM SUCESSO!');

    } catch (err) {
      console.error('Erro geral no setup: ', err);
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('❌ Falha Crítica no Setup')
                .setDescription(`Ocorreu um erro ao configurar o servidor:\n\`\`\`\n${err.message}\n\`\`\`\nConsulte o console para detalhes.`)
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

client.login(TOKEN).catch(err => {
  console.error('❌ Falha ao logar o bot no Discord. Verifique se o TOKEN é válido!');
  console.error(err);
});
