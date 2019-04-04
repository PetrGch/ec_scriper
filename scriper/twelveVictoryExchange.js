import cheerio from "cheerio";
import request from "request-promise";
import {telegramLogger} from "../server/bot/telegramServerBot";

const options = {
  uri: 'http://twelvevictory.com/exchange2.php',
  transform: function (body) {
    return cheerio.load(body);
  }
};

export function twelveVictoryExchange() {
  return request(options)
    .then(($) => {
      let currencyType = null;

      const currencyListByType = [];
      $(".rate-currency > table > tbody > tr").each(function () {
        const currencyItem = {
          currencyType,
          currencyAmountFrom: null,
          currencyAmountTo: null
        };
        const allTd = $(this).children('td');
        const foundCurrencyType = allTd.eq(0).find("tr td").eq(0).find("strong").text().trim();

        if (!!foundCurrencyType) {
          currencyType = foundCurrencyType;
          currencyItem.currencyType = foundCurrencyType;
        }

        if (currencyType) {
          const buyPrice = allTd.eq(1).text().trim();
          const sellPrice = allTd.eq(2).text().trim();

          if (!!buyPrice && !!sellPrice) {
            const currencyAmount = allTd.eq(0).find("td").eq(1).find("span").text().trim() || 1;

            currencyItem.currencyAmount = currencyAmount;
            currencyItem.buyPrice = allTd.eq(1).text().trim();
            currencyItem.sellPrice = allTd.eq(2).text().trim();


            if (/\d+[-]\d+/.test(currencyAmount)) {
              const splitValues = currencyAmount.split('-');
              const firstValue = splitValues[0] ? parseInt(splitValues[0].trim()) : null;
              const lastValue = splitValues[1] ? parseInt(splitValues[1].trim()) : null;

              if (firstValue <= lastValue) {
                currencyItem.currencyAmountFrom = firstValue;
                currencyItem.currencyAmountTo = lastValue;
              } else {
                currencyItem.currencyAmountFrom = lastValue;
                currencyItem.currencyAmountTo = firstValue;
              }
            } else {
              currencyItem.currencyAmountFrom = parseInt(currencyAmount);
            }

            currencyListByType.push(currencyItem);
          }
        }
      });

      const result = currencyListByType.reduce((currencyItemAcc, currencyItem) => {
        const foundExchangeCurrencies = currencyItemAcc.exchange_currencies.find((currency) =>
          currency.currency_type === currencyItem.currencyType);

        if (foundExchangeCurrencies && foundExchangeCurrencies.exchange_currency_amounts) {
          foundExchangeCurrencies.exchange_currency_amounts.push({
            currency_amount: currencyItem.currencyAmount,
            buy_price: currencyItem.buyPrice,
            sell_price: currencyItem.sellPrice,
            currency_amount_from: currencyItem.currencyAmountFrom,
            currency_amount_to: currencyItem.currencyAmountTo,
          })
        } else {
          currencyItemAcc.exchange_currencies.push({
            currency_type: currencyItem.currencyType,
            exchange_currency_amounts: [{
              currency_amount: currencyItem.currencyAmount,
              buy_price: currencyItem.buyPrice,
              sell_price: currencyItem.sellPrice,
              currency_amount_from: currencyItem.currencyAmountFrom,
              currency_amount_to: currencyItem.currencyAmountTo
            }]
          })
        }

        return currencyItemAcc
      }, {
        branch_name: "Head Office (Pradipat1)",
        exchange_currencies: []
      });

      return [result]
    })
    .catch(function (err) {
      telegramLogger(err.message);
    });
}
