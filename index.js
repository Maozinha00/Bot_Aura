const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';
const KIT_COST = 3760; // 1x Taser (700) + 1x AK-47 (2700) + 3x Box 5.56 (360) = 3760 Aços
const itensDb = require('./dados/itens.json');

client.on('ready', () => {
  console.log(`🐺 Bot HUNTERS online como ${client.user.tag}!`);
  client.user.setActivity('Calculadora Hunters | !ajuda', { type: 2 });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // COMANDO !ajuda
  if (command === 'ajuda' || command === 'help') {
    const helpEmbed = new EmbedBuilder()
      .setTitle('🐺 CENTRAL DE AJUDA — HUNTERS BOT')
      .setColor('#8B5CF6')
      .setDescription('Use os comandos abaixo para gerenciar a produção e vendas do Clã HUNTERS:')
      .addFields(
        { name: '🎁 !kit [aço]', value: 'Calcula quantos Kits da Meta podem ser fabricados.', inline: false },
        { name: '🛒 !venda [item] [qtd] [desconto]', value: 'Gera relatório de vendas com divisão 70/30 (Clã/Membro). Ex: `!venda AK-47 5` ou `!venda AK-47 5 d`', inline: false },
        { name: '🛠️ !producao [aço]', value: 'Mostra armas fabricáveis com X aço.', inline: false },
        { name: '📢 !estoque [aço_total]', value: 'Exibe o status do baú atual com a divisão 60% Clã / 40% Vendas.', inline: false }
      );

    return message.reply({ embeds: [helpEmbed] });
  }

  // COMANDO !kit
  if (command === 'kit') {
    const aco = parseInt(args[0]);
    if (isNaN(aco) || aco < 0) return message.reply('❌ Use: `!kit [aço]`');

    const kitsCount = Math.floor(aco / KIT_COST);
    const leftover = aco % KIT_COST;

    const embed = new EmbedBuilder()
      .setTitle('🎁 CALCULADORA DE KIT — HUNTERS')
      .setColor('#8B5CF6')
      .addFields(
        { name: '✅ Você consegue fabricar:', value: `**${kitsCount} Kit(s) da Meta**`, inline: true },
        { name: '📦 Sobra:', value: `${leftover.toLocaleString('pt-BR')} Aços`, inline: true }
      );

    return message.reply({ embeds: [embed] });
  }

  // COMANDO !venda
  if (command === 'venda') {
    if (args.length < 2) return message.reply('❌ Use: `!venda [item] [qtd] [d (desconto optional)]`');

    let qty = parseInt(args[args.length - 1]);
    let applyDiscount = false;

    if (args[args.length - 1].toLowerCase() === 'd') {
      applyDiscount = true;
      qty = parseInt(args[args.length - 2]);
    }

    if (isNaN(qty) || qty <= 0) qty = 1;
    const lastIdx = applyDiscount ? args.length - 2 : args.length - 1;
    const itemNameSearch = args.slice(0, lastIdx).join(' ').toLowerCase();

    let matchedItem = null;
    for (const [key, val] of Object.entries(itensDb)) {
      if (val.name.toLowerCase().includes(itemNameSearch) || key.toLowerCase() === itemNameSearch) {
        matchedItem = val;
        break;
      }
    }

    if (!matchedItem) return message.reply('❌ Item não encontrado.');

    const unitPrice = applyDiscount ? Math.round(matchedItem.value * 0.85) : matchedItem.value;
    const totalPrice = unitPrice * qty;
    const clanShare = Math.round(totalPrice * 0.70);
    const memberShare = totalPrice - clanShare;

    const embed = new EmbedBuilder()
      .setTitle(`🐺 VENDA HUNTERS — ${matchedItem.name.toUpperCase()}`)
      .setColor('#F472B6')
      .addFields(
        { name: '🔫 Item:', value: matchedItem.name, inline: true },
        { name: '📦 Quantidade:', value: `${qty} un.`, inline: true },
        { name: '💰 Valor Unitário:', value: `R$ ${unitPrice.toLocaleString('pt-BR')}`, inline: true },
        { name: '💰 Valor Total:', value: `**R$ ${totalPrice.toLocaleString('pt-BR')}**`, inline: false },
        { name: '🏦 Caixa Clã (70%):', value: `R$ ${clanShare.toLocaleString('pt-BR')}`, inline: true },
        { name: '💵 Membro (30%):', value: `R$ ${memberShare.toLocaleString('pt-BR')}`, inline: true }
      );

    return message.reply({ embeds: [embed] });
  }

  // COMANDO !estoque
  if (command === 'estoque') {
    const totalAco = parseInt(args[0]) || 50000;
    const clanAco = Math.round(totalAco * 0.60);
    const saleAco = totalAco - clanAco;
    const kitsCount = Math.floor(clanAco / KIT_COST);

    const embed = new EmbedBuilder()
      .setTitle('📢 ESTOQUE ATUALIZADO — HUNTERS')
      .setColor('#3B82F6')
      .addFields(
        { name: '📦 60% → ESTOQUE DO CLÃ', value: `**${clanAco.toLocaleString('pt-BR')} Aços**`, inline: true },
        { name: '💰 40% → PRODUÇÃO PARA VENDA', value: `**${saleAco.toLocaleString('pt-BR')} Aços**`, inline: true },
        { name: '🎁 Kits da Meta Disponíveis:', value: `**${kitsCount} Kits completos**`, inline: false }
      );

    return message.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
