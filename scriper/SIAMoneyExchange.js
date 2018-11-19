import request from "request-promise";
import cheerio from "cheerio";

const options = {
  uri: 'http://www.sia-moneyexchange.com/en/rate.php',
  transform: function (body) {
    return cheerio.load(body);
  }
};

export function siaMoneyExchange() {
  return request(options)
    .then(($) => {
      const response = {
        branch_name: "SIA Money Exchange",
        exchange_currencies: []
      };
      const currencyTypes = [];

      $("#content tbody tr").each(function () {
        const regExpForNumber = /\d/ig;
        if ($(this).hasClass("list-over") || $(this).hasClass("list-none")) {
          const exchange_currency = {exchange_currency_amounts: []};
          const allTd = $(this).children('td');

          if (allTd && allTd.length !== 0) {
            let currencyAmount = null;
            const currencyType = allTd.eq(2).text().trim();

            if (regExpForNumber.test(currencyType)) {
              const currencyTypeString = currencyType.match(/\w+/)[0];
              exchange_currency["currency_type"] = currencyTypeString;
              currencyAmount = currencyType.match(/\d+(-)?(\d+)?/)[0];
            } else {
              exchange_currency["currency_type"] = currencyType.slice(0, 3);
            }

            if (currencyAmount) {
              const splitValues = currencyAmount.split('-');
              const firstValue = splitValues[0] ? splitValues[0].trim() : null;
              const lastValue = splitValues[1] ? splitValues[1].trim() : null;


              if (firstValue && lastValue) {
                if (+firstValue <= +lastValue) {
                  exchange_currency.exchange_currency_amounts.push({
                    currency_amount_from: firstValue,
                    currency_amount_to: lastValue,
                    currency_amount: currencyAmount,
                    buy_price: allTd.eq(3).text().trim(),
                    sell_price: allTd.eq(4).text().trim()
                  })
                } else {
                  exchange_currency.exchange_currency_amounts.push({
                    currency_amount_from: lastValue,
                    currency_amount_to: firstValue,
                    currency_amount: currencyAmount,
                    buy_price: allTd.eq(3).text().trim(),
                    sell_price: allTd.eq(4).text().trim()
                  })
                }
              } else if (firstValue && !lastValue) {
                exchange_currency.exchange_currency_amounts.push({
                  currency_amount_from: firstValue,
                  currency_amount_to: null,
                  currency_amount: currencyAmount,
                  buy_price: allTd.eq(3).text().trim(),
                  sell_price: allTd.eq(4).text().trim()
                })
              }
            } else {
              exchange_currency.exchange_currency_amounts.push({
                currency_amount_from: "1",
                currency_amount_to: null,
                currency_amount: "1",
                buy_price: allTd.eq(3).text().trim(),
                sell_price: allTd.eq(4).text().trim()
              })
            }
          }

          if (exchange_currency.exchange_currency_amounts.length !== 0) {
            if (!currencyTypes.includes(exchange_currency.currency_type)) {
              response.exchange_currencies.push(exchange_currency);
              currencyTypes.push(exchange_currency.currency_type);
            } else {
              response.exchange_currencies.forEach(currency => {
                if (currency.currency_type === exchange_currency.currency_type) {
                  currency.exchange_currency_amounts = currency.exchange_currency_amounts.concat(exchange_currency.exchange_currency_amounts);
                }
              });
            }
          }
        }
      });

      return [response];
    })
    .catch(function (err) {
      console.log(err);
    });
}