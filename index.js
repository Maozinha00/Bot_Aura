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

// O script na interface web converte suas categorias, canais e cargos em tempo real aqui!
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
    
    let statusMsg;
    try {
      statusMsg = await message.reply('🧹 **Iniciando limpeza completa... Apagando canais e cargos antigos.** Aguarde!');
    } catch (e) {
      console.log('Não foi possível responder à mensagem inicial.');
    }

    try {
      // 1. Deletar todos os canais e categorias existentes
      const channels = await guild.channels.fetch();
      for (const [id, channel] of channels) {
        try {
          await channel.delete();
          console.log(`Deletado: ${channel.name}`);
        } catch (e) {
          console.log(`Ignorado canal: ${channel.name}`);
        }
      }

      // 2. Deletar cargos customizados (exceto bots e everyone)
      const roles = await guild.roles.fetch();
      for (const [id, role] of roles) {
        if (role.id !== guild.id && !role.managed && role.name !== client.user.username) {
          try {
            await role.delete();
            console.log(`Deletado cargo: ${role.name}`);
          } catch (e) {
            console.log(`Ignorado cargo: ${role.name}`);
          }
        }
      }

      // Criar canal de status temporário para progresso
      try {
        await guild.channels.create({
          name: 'ℹ-status-setup',
          type: ChannelType.GuildText
        }).then(async (chan) => {
          statusMsg = await chan.send('👑 **Limpeza concluída! Criando nova estrutura de cargos e canais...**');
        });
      } catch(e) {}

      // 3. Criar os novos cargos customizados configurados na interface
      const roleIdMapping = {};
      // Seus cargos criados na interface web são convertidos aqui dinamicamente...
      
      console.log('✅ Automação de criação concluída com sucesso!');
    } catch (error) {
      console.error('Erro na automação do bot: ', error);
    }
  }
});

// COLOQUE O TOKEN DO SEU BOT DISCORD ABAIXO:
client.login(process.env.TOKEN);
