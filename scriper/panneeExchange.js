import request from 'request-promise';
import cheerio from 'cheerio';
import fs from 'fs';

const options = {
  uri: 'http://www.pannee-exchange.com/',
  transform: function (body) {
    return cheerio.load(body);
  }
};

export function panneeExchange() {
  return request(options)
    .then(($) => {
      const response = {
        branch_name: "Pannee Exchange",
        exchange_currencies: []
      };

      $(".table tr").each(function () {
        const allTd = $(this).children('td');

        if (allTd && allTd.length !== 0 && !$(this).hasClass("head-title-box")) {
          const exchangeCurrency = {exchange_currency_amounts: []};
          exchangeCurrency["currency_type"] = allTd.eq(3).text().trim();
          const currencyAmount = allTd.eq(4).children('li');
          const buyPrices = allTd.eq(5).children('li');
          const sellPrices = allTd.eq(6).children('li');

          if (currencyAmount && currencyAmount.length !== 0) {
            $(currencyAmount).each(function(index) {
              const amountText = $(this).text().trim();
              const buyPriceText = buyPrices[index] ? $(buyPrices[index]).text().trim() : null;
              const sellPriceText = sellPrices[index] ? $(sellPrices[index]).text().trim() : null;

              let currencyAmountFrom = null;
              let currencyAmountTo = null;

              if (/\d+/.test(amountText)) {
                if (/\d+[-]\d+/.test(amountText)) {
                  const parsedAmount = amountText.match(/\d+[-]\d+/)[0];
                  const splitValues = parsedAmount.split('-');
                  const firstValue = splitValues[0] ? parseInt(splitValues[0].trim()) : null;
                  const lastValue = splitValues[1] ? parseInt(splitValues[1].trim()) : null;

                  if (firstValue <= lastValue) {
                    currencyAmountFrom = firstValue;
                    currencyAmountTo = lastValue;
                  } else {
                    currencyAmountFrom = lastValue;
                    currencyAmountTo = firstValue;
                  }
                } else {
                  currencyAmountFrom = parseInt(amountText);
                }
              }

              exchangeCurrency.exchange_currency_amounts.push({
                currency_amount: amountText !== "-" ? amountText : 1,
                currency_amount_from: currencyAmountFrom,
                currency_amount_to: currencyAmountTo,
                buy_price: buyPriceText,
                sell_price: sellPriceText
              })
            })
          }

          response.exchange_currencies.push(exchangeCurrency);
        }
      });

      return [response];
    })
    .catch(function (err) {
      console.log(err);
    });
}
