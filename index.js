// ====================================================================
//                 🐺 SCRIPT ÚNICO — HUNTERS BOT DISCORD 🐺
// ====================================================================
// Versão: 1.0.0 (Discord.js v14)
// Este script já possui todos os dados de fabricação integrados!
// ====================================================================

const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// Configurações Globais
const PREFIX = '!';
const KIT_COST = 3760; // 1x Taser (700) + 1x AK-47 (2700) + 3x Box 5.56 (360) = 3,760 Aços

// Banco de Dados Integrado
const itensDb = {
  "ak47": { "name": "AK-47", "steel": 2700, "value": 35000, "category": "Armas" },
  "awp": { "name": "AWP", "steel": 3000, "value": 65000, "category": "Armas" },
  "m16": { "name": "M16", "steel": 2700, "value": 35000, "category": "Armas" },
  "sawedoff": { "name": "Sawed-Off Shotgun", "steel": 1200, "value": 20000, "category": "Armas" },
  "glock17": { "name": "Glock 17", "steel": 120, "value": 5000, "category": "Armas" },
  "tec9": { "name": "TEC-9", "steel": 900, "value": 15000, "category": "Armas" },
  "taser": { "name": "Taser", "steel": 700, "value": 10000, "category": "Armas" },
  "box_pistola": { "name": "Box M. Pistola", "steel": 40, "value": 2000, "category": "Caixas de Munição" },
  "box_sub": { "name": "Box M. Sub", "steel": 80, "value": 3000, "category": "Caixas de Munição" },
  "box_escopeta": { "name": "Box M. Escopeta", "steel": 100, "value": 4000, "category": "Caixas de Munição" },
  "box_556": { "name": "Box M. 5.56", "steel": 120, "value": 5000, "category": "Caixas de Munição" },
  "box_308": { "name": "Box M. .308", "steel": 200, "value": 5000, "category": "Caixas de Munição" },
  "silenciador": { "name": "Silenciador", "steel": 20, "value": 2000, "category": "Acessórios" },
  "carregador_est": { "name": "Carregador Est.", "steel": 25, "value": 3000, "category": "Acessórios" },
  "grip": { "name": "Grip", "steel": 30, "value": 3000, "category": "Acessórios" },
  "lanterna": { "name": "Lanterna", "steel": 30, "value": 2000, "category": "Acessórios" }
};

client.on('ready', () => {
  console.log('🐺 Bot HUNTERS online como ' + client.user?.tag + '!');
  client.user?.setActivity('Calculadora Hunters | !ajuda', { type: 2 });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // COMANDO: !ajuda
  if (command === 'ajuda' || command === 'help') {
    const helpEmbed = new EmbedBuilder()
      .setTitle('🐺 CENTRAL DE AJUDA — HUNTERS BOT')
      .setColor('#8B5CF6')
      .setDescription('Use os comandos abaixo para calcular produção, metas e gerenciar as vendas do Clã HUNTERS:')
      .addFields(
        { name: '🎁 !kit [aço]', value: 'Calcula quantos Kits da Meta podem ser fabricados com o aço disponível.', inline: false },
        { name: '🛒 !venda [item] [qtd] [desconto]', value: 'Gera o relatório de vendas com divisão 70/30 (Clã/Membro). Ex: \`!venda AK-47 5\` ou com desconto de 15%: \`!venda AK-47 5 d\`', inline: false },
        { name: '🛠️ !producao [aço]', value: 'Mostra todas as armas que podem ser feitas individualmente com X aço.', inline: false },
        { name: '📢 !estoque [aço_total]', value: 'Exibe o status do baú atual com a divisão 60% Estoque do Clã / 40% Produção para Venda.', inline: false }
      )
      .setFooter({ text: 'HUNTERS Organization 🐺' });

    return message.reply({ embeds: [helpEmbed] });
  }

  // COMANDO: !kit
  if (command === 'kit') {
    const aco = parseInt(args[0]);
    if (isNaN(aco) || aco < 0) {
      return message.reply('❌ **Erro de Sintaxe:** Use \`!kit [quantidade de aço]\`. Exemplo: \`!kit 15000\`');
    }

    const kitsCount = Math.floor(aco / KIT_COST);
    const leftover = aco % KIT_COST;

    const embed = new EmbedBuilder()
      .setTitle('🎁 CALCULADORA DE KIT — HUNTERS')
      .setColor('#8B5CF6')
      .setDescription('🛠️ **Aço disponível:** ' + aco.toLocaleString('pt-BR') + '\\n\\n**KIT DA META:**\\n⚡ 1x Taser\\n🔫 1x AK-47\\n📦 3x Box 5.56\\n\\n💎 **Custo Unitário:** ' + KIT_COST.toLocaleString('pt-BR') + ' Aços')
      .addFields(
        { name: '✅ Você consegue fabricar:', value: '**' + kitsCount + ' Kit' + (kitsCount !== 1 ? 's' : '') + ' Completo' + (kitsCount !== 1 ? 's' : '') + '**', inline: true },
        { name: '📦 Sobra:', value: '\`' + leftover.toLocaleString('pt-BR') + ' Aços\`', inline: true }
      )
      .setFooter({ text: 'Hunters Bot 🐺' });

    return message.reply({ embeds: [embed] });
  }

  // COMANDO: !venda
  if (command === 'venda') {
    if (args.length < 2) {
      return message.reply('❌ **Sintaxe Correta:** \`!venda [nome-do-item] [quantidade] [d (opcional)]\`. Exemplo: \`!venda AK-47 10\`');
    }

    let qty = parseInt(args[args.length - 1]);
    let applyDiscount = false;

    if (args[args.length - 1].toLowerCase() === 'd' || args[args.length - 1].toLowerCase() === 'desc') {
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

    if (!matchedItem) {
      return message.reply('❌ **Erro:** Item \`' + itemNameSearch + '\` não encontrado. Exemplo: \`!venda AK-47 10\`.');
    }

    const baseValue = matchedItem.value;
    const unitPrice = applyDiscount ? Math.round(baseValue * 0.85) : baseValue;
    const totalPrice = unitPrice * qty;
    const clanShare = Math.round(totalPrice * 0.70);
    const memberShare = totalPrice - clanShare;

    const embed = new EmbedBuilder()
      .setTitle('🐺 VENDA HUNTERS — ' + matchedItem.name.toUpperCase())
      .setColor('#F472B6')
      .addFields(
        { name: '🔫 Item:', value: matchedItem.name, inline: true },
        { name: '📦 Quantidade:', value: qty + ' unidade(s)', inline: true },
        { name: '💰 Valor Unitário:', value: 'R$ ' + unitPrice.toLocaleString('pt-BR'), inline: true },
        { name: '💰 Valor Total:', value: '**R$ ' + totalPrice.toLocaleString('pt-BR') + '**', inline: false },
        { name: '🏦 Caixa Clã (70%):', value: 'R$ ' + clanShare.toLocaleString('pt-BR'), inline: true },
        { name: '💵 Membro (30%):', value: 'R$ ' + memberShare.toLocaleString('pt-BR'), inline: true }
      )
      .setFooter({ text: applyDiscount ? '⚠️ 15% Desconto Máximo Aplicado!' : 'Hunters Vendas 🐺' });

    return message.reply({ embeds: [embed] });
  }

  // COMANDO: !producao
  if (command === 'producao') {
    const aco = parseInt(args[0]);
    if (isNaN(aco) || aco < 0) {
      return message.reply('❌ **Erro de Sintaxe:** Use \`!producao [aço]\`. Exemplo: \`!producao 20000\`');
    }

    const fields = [];
    for (const [key, item] of Object.entries(itensDb)) {
      if (item.category === 'Armas' || item.category === 'Caixas de Munição') {
        const qty = Math.floor(aco / item.steel);
        if (qty > 0) {
          fields.push({
            name: item.name,
            value: '**' + qty + '** unidade(s)\\n*(Sobram ' + (aco % item.steel).toLocaleString('pt-BR') + ' aços)*',
            inline: true
          });
        }
      }
    }

    const embed = new EmbedBuilder()
      .setTitle('🛠️ PRODUÇÃO COM AÇO — HUNTERS')
      .setColor('#34D399')
      .setDescription('Estoque Analisado: **' + aco.toLocaleString('pt-BR') + ' Aços**\\n\\nPossibilidades individuais de fabricação:')
      .addFields(fields.slice(0, 12))
      .setFooter({ text: 'HUNTERS Armaria Ativa 🐺' });

    return message.reply({ embeds: [embed] });
  }

  // COMANDO: !estoque
  if (command === 'estoque') {
    const totalAco = parseInt(args[0]) || 50000;
    
    const percentClan = 60;
    const percentSale = 40;

    const clanAco = Math.round(totalAco * (percentClan / 100));
    const saleAco = totalAco - clanAco;

    const kitsCount = Math.floor(clanAco / KIT_COST);
    const sobraKits = clanAco % KIT_COST;

    const embed = new EmbedBuilder()
      .setTitle('📢 ESTOQUE ATUALIZADO — HUNTERS')
      .setColor('#3B82F6')
      .setDescription('💎 **Nosso baú alcançou a marca de ' + totalAco.toLocaleString('pt-BR') + ' Aços!**\\nGraças ao esforço de todos, nos mantemos sempre fortes.')
      .addFields(
        { name: '📦 ' + percentClan + '% → ESTOQUE DO CLÃ', value: '**' + clanAco.toLocaleString('pt-BR') + ' Aços**\\nDestinados para Kits e Guerras.', inline: true },
        { name: '💰 ' + percentSale + '% → PRODUÇÃO PARA VENDA', value: '**' + saleAco.toLocaleString('pt-BR') + ' Aços**\\nDestinados para venda de armas.', inline: true },
        { name: '🎁 Kits Disponíveis no Clã:', value: '**' + kitsCount + ' Kits completos da Meta**\\n📦 Sobra: ' + sobraKits.toLocaleString('pt-BR') + ' Aços', inline: false }
      )
      .setFooter({ text: 'HUNTERS 🐺 Sempre Unidos' });

    return message.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
