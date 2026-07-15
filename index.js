/**
 * BOT DE DISCORD AUTO-CONFIGURÁVEL - VERSÃO PREMIUM DELUXE
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

const PREFIX = '!';

// Configurações e Dados da Loja Premium Deluxe
const CONFIG = {
  storeName: "Aura Bots Studio - Luxury FiveM",
  accentColor: "#f39c12", // Cor Alaranjada Premium
  roles: [
    { id: "role-founder", name: "👑 Proprietário", color: "#f1c40f", hoist: true, mentionable: true },
    { id: "role-staff", name: "🛡️ Equipe / Staff", color: "#e74c3c", hoist: true, mentionable: true },
    { id: "role-designer", name: "📐 Designer / Modelador", color: "#3498db", hoist: true, mentionable: true },
    { id: "role-vip", name: "⭐ VIP Premium Deluxe", color: "#9b59b6", hoist: true, mentionable: true },
    { id: "role-client", name: "🛍️ Cliente Verificado", color: "#2ecc71", hoist: false, mentionable: false }
  ],
  categories: [
    {
      name: "📌 INFORMAÇÕES & COMUNIDADE",
      channels: [
        {
          name: "📢-anuncios-loja",
          type: 0,
          description: "Avisos importantes, atualizações e novidades da loja.",
          embedTitle: "📢 Novidades e Avisos da Loja",
          embedDescription: "Bem-vindo ao canal oficial de anúncios da nossa loja! Fique atento aqui para não perder nenhuma atualização de roupas, novidades de mods e lançamentos incríveis para o seu servidor FiveM!"
        },
        {
          name: "🛒-como-comprar",
          type: 0,
          description: "Instruções detalhadas de como realizar sua compra.",
          embedTitle: "🛒 Como Adquirir Nossas Roupas",
          embedDescription: "Para comprar nossas roupas:\n\n1️⃣ Navegue pelas categorias de **🛍️ LOJA & PRODUTOS**.\n2️⃣ Escolha o pack, peça de roupa ou coleção que deseja.\n3️⃣ Vá até a categoria **📞 ATENDIMENTO & SUPORTE** e entre no canal **📩-abrir-ticket**.\n4️⃣ Clique no botão de abrir ticket para iniciar o seu atendimento privado.\n5️⃣ Informe o nome dos itens desejados para nossa equipe finalizar a venda e realizar o envio imediato!"
        },
        {
          name: "💳-valores-e-precos",
          type: 0,
          description: "Preços das roupas e métodos de pagamento.",
          embedTitle: "💳 Métodos de Pagamento e Valores",
          embedDescription: "Trabalhamos com os melhores preços do mercado para roupas FiveM Otimizadas (Low-Poly).\n\n🔹 **Pix** (Desconto especial!)\n🔹 **Cartão de Crédito** (Até 12x via Mercado Pago)\n🔹 **Boleto Bancário**\n\n_Consulte os preços detalhados de cada pack nos canais abaixo ou abra um ticket para orçamentos personalizados._"
        },
        {
          name: "🎉-sorteios",
          type: 0,
          description: "Sorteios de packs e cupons.",
          embedTitle: "🎉 Sorteios da Loja",
          embedDescription: "Participe dos nossos sorteios exclusivos! Sorteamos regularmente pacotes de roupas premium, cupons de desconto e assinaturas VIP para a nossa comunidade."
        },
        {
          name: "🏆-depoimentos",
          type: 0,
          description: "Avaliações de clientes satisfeitos.",
          embedTitle: "🏆 O que dizem nossos clientes",
          embedDescription: "Sua satisfação é a nossa prioridade número um! Veja o feedback de clientes que já compraram nossas roupas e otimizaram seus servidores FiveM."
        }
      ]
    },
    {
      name: "🛍️ LOJA & PRODUTOS",
      channels: [
        {
          name: "📦-packs-promocionais",
          type: 0,
          description: "Combos de roupas com preços imperdíveis.",
          embedTitle: "📦 Packs de Roupas Promocionais",
          embedDescription: "Adquira pacotes completos de roupas masculinas + femininas prontas para colocar no seu servidor (com script resource.cfg incluído)! Economize até 40% comprando nossos combos!"
        },
        {
          name: "👕-masculino-premium",
          type: 0,
          description: "Roupas masculinas de marcas de luxo.",
          embedTitle: "👕 Estilo & Luxo Masculino",
          embedDescription: "Camisas Polo, Jaquetas corta-vento de marcas famosas, calças táticas, moletons estilosos e as últimas novidades da moda urbana."
        },
        {
          name: "👗-feminino-premium",
          type: 0,
          description: "Roupas femininas de alta costura.",
          embedTitle: "👗 Moda Luxo Feminina",
          embedDescription: "Modas de balada, biquínis, saias curtas, shorts jeans rasgados de grife e blusas estilosas para as moradoras mais elegantes do seu servidor."
        },
        {
          name: "🎒-acessorios",
          type: 0,
          description: "Óculos, correntes, relógios e mochilas.",
          embedTitle: "🎒 Acessórios & Joias Exclusivas",
          embedDescription: "Os detalhes fazem a diferença! Adicione relógios Rolex funcionais, óculos escuros de grife, correntes de ouro com pingentes customizados e bonés de marcas renomadas."
        },
        {
          name: "Sneakers-calcados",
          type: 0,
          description: "Tênis Jordan, Yeezy, sapatilhas e botas.",
          embedTitle: "👟 Tênis & Calçados Realistas",
          embedDescription: "Ande com estilo! Tênis Jordan, Yeezy, Nike Shox, sapatos sociais e botas perfeitamente mapeados em texturas de alta definição."
        }
      ]
    },
    {
      name: "⭐ ÁREA EXCLUSIVA VIP",
      channels: [
        {
          name: "💎-beneficios-vip",
          type: 0,
          description: "Vantagens em assinar os planos VIP.",
          embedTitle: "💎 Benefícios Exclusivos do Plano VIP",
          embedDescription: "Assine nossos planos VIP mensais ou vitalícios e receba:\n\n✅ 30% de desconto em qualquer peça avulsa do catálogo.\n✅ Acesso ao canal exclusivo de lançamentos antecipados.\n✅ Suporte prioritário na fila de atendimento do ticket.\n✅ Cargo destacado em roxo no servidor do Discord.",
          allowedRoles: ["role-vip"]
        },
        {
          name: "👑-packs-exclusivos-vip",
          type: 0,
          description: "Acesso a roupas exclusivas do plano VIP.",
          embedTitle: "👑 Lançamentos e Packs Exclusivos VIP",
          embedDescription: "Canal restrito com os arquivos de download direto de packs promocionais e roupas de alta qualidade exclusivas para os membros ativos do VIP!",
          allowedRoles: ["role-vip"]
        }
      ]
    },
    {
      name: "👔 ROUPAS DE CORPORAÇÕES",
      channels: [
        {
          name: "🚓-fardas-policia-e-samu",
          type: 0,
          description: "Uniformes militares, policiais e médicos.",
          embedTitle: "🚓 Fardamentos Militares e Médicos",
          embedDescription: "Fornecemos fardamentos completos, coletes táticos realistas e roupas médicas/SAMU perfeitamente otimizados e prontos para colocar na sua pasta de mods."
        },
        {
          name: "🕶️-roupas-faccoes",
          type: 0,
          description: "Skins para gangues, máfias e cartéis.",
          embedTitle: "🕶️ Vestuário de Facções & Gangues",
          embedDescription: "Roupas esportivas combinando, bandanas, casacos acolchoados e camisas estampadas para unificar o estilo da sua facção ou gangue urbana."
        },
        {
          name: "🏍️-motoclubes",
          type: 0,
          description: "Coletes de couro e casacos pesados de moto.",
          embedTitle: "🏍️ Coletes de Couro de Moto Clubes",
          embedDescription: "Estilo estradeiro autêntico! Coletes de couro personalizáveis, casacos pesados e calças de couro de alta resistência para motoclubes."
        }
      ]
    },
    {
      name: "🛠️ INSTALAÇÃO & AJUDA",
      channels: [
        {
          name: "📥-como-instalar",
          type: 0,
          description: "Tutoriais em texto e vídeo de instalação.",
          embedTitle: "📥 Como Instalar em seu Servidor FiveM",
          embedDescription: "Todos os nossos produtos são entregues no formato pronto para o seu servidor:\n\n**Como recurso Add-on (Pronto):**\n1️⃣ Extraia o arquivo baixado.\n2️⃣ Coloque a pasta na sua diretiva `resources/`.\n3️⃣ Adicione `ensure nome_da_pasta` no seu `server.cfg`.\n4️⃣ Inicie o servidor e aproveite!\n\n_Para substituir roupas padrão (Replace), consulte o tutorial fixado._"
        },
        {
          name: "❓-faq-duvidas",
          type: 0,
          description: "Dúvidas frequentes respondidas.",
          embedTitle: "❓ Dúvidas Frequentes",
          embedDescription: "**1. As roupas causam crash no servidor?**\nNão! Todas as nossas texturas e malhas são compactadas e otimizadas (Low-Poly), mantendo o tamanho abaixo do limite crítico do FiveM.\n\n**2. Posso testar as roupas antes de comprar?**\nSim! Solicite no seu ticket a entrada no nosso servidor de testes oficial.\n\n**3. Vocês fazem roupas personalizadas com minha marca?**\nSim! Entre em contato via ticket para orçamentos de roupas com o logotipo do seu servidor ou marca real."
        }
      ]
    },
    {
      name: "📞 ATENDIMENTO & SUPORTE",
      channels: [
        {
          name: "📩-abrir-ticket",
          type: 0,
          description: "Abra um ticket de suporte privado.",
          embedTitle: "📩 Central de Suporte e Vendas",
          embedDescription: "Para comprar ou receber suas roupas, clique no botão para abrir um ticket de atendimento. Nossa equipe responderá o mais rápido possível!"
        },
        {
          name: "🤝-parcerias",
          type: 0,
          description: "Requisitos para parcerias com streamers.",
          embedTitle: "🤝 Programa de Parcerias",
          embedDescription: "É streamer, criador de conteúdo de FiveM ou dono de cidade grande? Faça uma parceria conosco e ganhe roupas exclusivas em troca de divulgação! Consulte os requisitos abrindo um ticket."
        },
        {
          name: "🔊 Sala de Espera #1",
          type: 2,
          description: "Aguarde atendimento em voz."
        },
        {
          name: "🔊 Sala de Espera #2",
          type: 2,
          description: "Aguarde atendimento em voz."
        }
      ]
    }
  ]
};

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
            await new Promise(resolve => setTimeout(resolve, 150)); // Evitar limite de taxa (Rate Limit)
          } catch (e) {
            console.log(`Erro ao deletar canal ${channel.name}: ${e.message}`);
          }
        }
      }
      console.log(`🧹 Limpeza de canais concluída! Total deletados: ${deletedChansCount}`);

      // 2. Deletar todos os cargos customizados deletáveis (exceto bots e everyone)
      const roles = await guild.roles.fetch();
      let deletedRolesCount = 0;
      for (const [id, role] of roles) {
        if (role.id !== guild.id && !role.managed && role.deletable && role.name !== client.user.username) {
          try {
            await role.delete();
            deletedRolesCount++;
            console.log(`Deletado cargo: ${role.name}`);
            await new Promise(resolve => setTimeout(resolve, 150)); // Evitar limite de taxa (Rate Limit)
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

      // 4. Criar as categorias e canais estruturados
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

              // Configurar permissões de canal privado se houver restrição
              if (chan.allowedRoles && chan.allowedRoles.length > 0) {
                // Negar visualização para everyone (público geral)
                permissionOverwrites.push({
                  id: guild.id,
                  deny: [PermissionsBitField.Flags.ViewChannel]
                });

                // Permitir para os cargos permitidos configurados
                for (const tempRoleId of chan.allowedRoles) {
                  const realRoleId = roleIdMapping[tempRoleId];
                  if (realRoleId) {
                    permissionOverwrites.push({
                      id: realRoleId,
                      allow: [PermissionsBitField.Flags.ViewChannel]
                    });
                  }
                }

                // Garantir permissão de visualização para administradores padrão (Proprietário e Staff)
                const defaultPrivilegedTempIds = ['role-founder', 'role-staff'];
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

              // Postar o embed de vendas automático se for canal de texto
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

      // Atualizar mensagem de progresso final
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
                .setDescription(`Ocorreu um erro geral durante a execução do setup:\n\`\`\`${error.message}\`\`\`\nConsulte o terminal para mais detalhes.`)
                .setColor(0xe74c3c)
                .setTimestamp()
            ]
          });
        } catch (e) {}
      }
    }
  }
});

// INSIRA O TOKEN DO SEU BOT DISCORD ABAIXO:

client.login(process.env.TOKEN);
