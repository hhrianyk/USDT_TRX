const axios = require('axios');
const TronWeb = require('tronweb');

// Дані для підключення
const fullNode = "https://api.trongrid.io"; // Основна мережа TRON
const privateKey = "5917c677f8e00c1af41d678bfc3330509ad16bd4cb93c9b1e4d4da9ce7295976"; // НЕ ЗЛИВАЙТЕ ЦЕ У PUBLIC!
const contractAddress = "TRuTN85cq6hzH3rYsrEe8wtekuir87UwtH"; // Деployed smart contract

const tronWeb = new TronWeb(fullNode, fullNode, fullNode, privateKey);

// Функція оновлення ціни
async function updatePrice() {
    try {
        // Отримання ціни TRX в USD з CoinGecko
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd");
        const trxPrice = response.data.tron.usd * 10**18; // Перетворюємо у 18 decimal

        console.log(`Оновлена ціна TRX: ${trxPrice}`);

        // Взаємодія з контрактом TRON для оновлення ціни
        const contract = await tronWeb.contract().at(contractAddress);
        const transaction = await contract.updateTokenPrice(trxPrice).send({feeLimit: 1e9});

        console.log(`Ціна оновлена у смарт-контракті: Транзакція - ${transaction}`);

    } catch (error) {
        console.error("Помилка оновлення ціни:", error);
    }
}

// Оновлення ціни кожні 5 хвилин
setInterval(updatePrice, 5 * 60 * 1000);
updatePrice();
