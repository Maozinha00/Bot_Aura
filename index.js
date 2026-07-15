/**
 * BOT DE DISCORD AUTO-CONFIGURÁVEL - AUTOMATION SETUP
 * Versão: discord.js v14
 * 
 * 📌 INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Crie uma pasta vazia no seu computador e abra o terminal nela.
 * 2. Digite: npm init -y
 * 3. Instale a biblioteca do Discord: npm install discord.js
 * 4. Crie um arquivo chamado index.js e cole todo este código dentro dele.
 * 5. Substitua o token na última linha pelo Token real do seu Bot.
 * 6. Inicialize o bot rodando: node index.js
 * 7. No seu servidor Discord, digite o comando: !criar
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

// A interface web gera esta configuração dinamicamente com base no seu design de canais e cargos
const CONFIG = {
  "storeName": "Sua Loja",
  "accentColor": "#f59e0b",
  "roles": [
    { "id": "role-founder", "name": "👑 Fundador", "color": "#f59e0b", "hoist": true, "mentionable": false },
    { "id": "role-staff", "name": "🛡️ Staff", "color": "#10b981", "hoist": true, "mentionable": false },
    { "id": "role-vip", "name": "⭐ Cliente VIP", "color": "#3b82f6", "hoist": false, "mentionable": false }
  ],
  "categories": [
    {
      "name": "📌 INFORMAÇÕES",
      "channels": [
        { "name": "📢-anuncios", "type": 0, "description": "Avisos importantes da loja", "embedTitle": "📢 Anúncios Oficiais", "embedDescription": "Fique por dentro de todas as novidades e atualizações!" },
        { "name": "📜-regras", "type": 0, "description": "Regras do servidor", "embedTitle": "📜 Diretrizes do Servidor", "embedDescription": "Evite punições lendo atentamente as nossas regras." }
      ]
    },
    {
      "name": "🛒 PRODUTOS",
      "channels": [
        { "name": "💎-ofertas", "type": 0, "description": "Melhores produtos", "embedTitle": "💎 Ofertas Exclusivas", "embedDescription": "Confira as nossas promoções ativas." }
      ]
    },
    {
      "name": "📞 SUPORTE",
      "channels": [
        { "name": "🎫-abrir-ticket", "type": 0, "description": "Atendimento", "embedTitle": "🎫 Central de Suporte", "embedDescription": "Precisa de ajuda? Abra um ticket de atendimento!" },
        { "name": "🔊-suporte-voice", "type": 2, "description": "Canal de Voz para Suporte" }
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
    // Apenas administradores do servidor podem executar o comando
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
            .setDescription('🧹 **Etapa 1:** Realizando limpeza completa do servidor (canais e cargos antigos)...\\nAguarde um momento, isso pode levar alguns segundos devido aos limites de taxa.')
            .setColor(0xf39c12)
            .setTimestamp()
        ]
      });
    } catch (e) {
      console.log('Erro ao enviar mensagem de progresso inicial: ', e);
    }

    try {
      // 1. Deletar todos os canais e categorias existentes deletáveis (EXCETO o canal de comando)
      const channels = await guild.channels.fetch();
      let deletedChansCount = 0;
      for (const [id, channel] of channels) {
        if (id === message.channel.id) continue; // Mantém o canal atual vivo para feedback
        if (channel.deletable) {
          try {
            await channel.delete();
            deletedChansCount++;
            console.log(`Deletado canal/categoria: ${channel.name}`);
            await new Promise(resolve => setTimeout(resolve, 150)); // Delay para limites de taxa
          } catch (e) {
            console.log(`Erro ao deletar canal ${channel.name}: ${e.message}`);
          }
        }
      }
      console.log(`🧹 Limpeza de canais concluída! Total deletados: ${deletedChansCount}`);

      // 2. Deletar todos os cargos customizados antigos e deletáveis
      const roles = await guild.roles.fetch();
      let deletedRolesCount = 0;
      for (const [id, role] of roles) {
        if (role.id !== guild.id && !role.managed && role.deletable && role.name !== client.user.username) {
          try {
            await role.delete();
            deletedRolesCount++;
            console.log(`Deletado cargo: ${role.name}`);
            await new Promise(resolve => setTimeout(resolve, 150));
          } catch (e) {
            console.log(`Erro ao deletar cargo ${role.name}: ${e.message}`);
          }
        }
      }
      console.log(`🧹 Limpeza de cargos concluída! Total deletados: ${deletedRolesCount}`);

      // Atualizar status para Etapa 2
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('⚙️ Progresso do Setup')
                .setDescription('🎨 **Etapa 2:** Criando novos cargos customizados e configurando hierarquia...\\nAguarde um momento.')
                .setColor(0x3498db)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      // 3. Criar os novos cargos configurados
      const roleIdMapping = {};
      for (const r of CONFIG.roles) {
        try {
          const colorHex = r.color.replace('#', '');
          const newRole = await guild.roles.create({
            name: r.name,
            color: parseInt(colorHex, 16) || 0,
            hoist: r.hoist,
            mentionable: r.mentionable,
            reason: 'Automação Loja Discord'
          });
          roleIdMapping[r.id] = newRole.id;
          console.log(`Cargo Criado: ${r.name}`);
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`Erro ao criar cargo ${r.name}: `, e);
        }
      }

      // Atualizar status para Etapa 3
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('⚙️ Progresso do Setup')
                .setDescription('📂 **Etapa 3:** Criando categorias, canais de texto/voz e definindo permissões privadas...\\nAguarde um momento.')
                .setColor(0x9b59b6)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      const embedColor = parseInt(CONFIG.accentColor.replace('#', ''), 16) || 0x3498db;

      // 4. Criar categorias e canais
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

              // Tratar canais privados por cargo
              if (chan.allowedRoles && chan.allowedRoles.length > 0) {
                // Negar View para everyone
                permissionOverwrites.push({
                  id: guild.id,
                  deny: [PermissionsBitField.Flags.ViewChannel]
                });

                // Permitir cargos permitidos
                for (const tempRoleId of chan.allowedRoles) {
                  const realRoleId = roleIdMapping[tempRoleId];
                  if (realRoleId) {
                    permissionOverwrites.push({
                      id: realRoleId,
                      allow: [PermissionsBitField.Flags.ViewChannel]
                    });
                  }
                }

                // Dar privilégio padrão para Staffs e Fundadores
                const defaultPrivilegedTempIds = ['role-founder', 'role-designer', 'role-staff'];
                for (const privId of defaultPrivilegedTempIds) {
                  const realPrivRoleId = roleIdMapping[privId];
                  if (realPrivRoleId && !chan.allowedRoles.includes(privId)) {
                    permissionOverwrites.push({
                      id: realPrivRoleId,
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

              // Se for canal de texto, publica o embed rico configurado
              if (chan.type === 0 && (chan.embedTitle || chan.embedDescription)) {
                try {
                  const embed = new EmbedBuilder()
                    .setTitle(chan.embedTitle || `📌 #${chan.name}`)
                    .setDescription(chan.embedDescription || chan.description || '...')
                    .setColor(embedColor)
                    .setFooter({ text: `Powered by ${CONFIG.storeName} • Auto Setup` })
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

      // Enviar mensagem de finalização bem sucedida!
      if (progressMsg) {
        try {
          await progressMsg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle('🎉 Setup Concluído com Sucesso!')
                .setDescription(`👑 Toda a estrutura de categorias, canais de texto/voz, permissões privadas, cargos e mensagens de embeds automáticas da loja **${CONFIG.storeName}** foram configurados com sucesso!\n\n*Você já pode deletar este canal temporário se desejar.*`)
                .setColor(0x2ecc71)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }

      console.log('✅ Automação de criação concluída com sucesso!');
    } catch (error) {
      console.error('Erro geral no setup: ', error);
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

client.login(process.env.TOKEN);
