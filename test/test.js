import request from 'request-promise';
import cheerio from 'cheerio';
const puppeteer = require('puppeteer');

const options = {
  uri: 'http://www.siamexchange.co.th/',
  transform: function (body) {
    return cheerio.load(body);
  }
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://excurrate.com');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();

function scraper_2() {
  return request(options)
    .then(($) => {
      const response = {
        branch_name: "Siam Exchange",
        exchange_currencies: []
      };

      const currencyTypesList = [];

      $(".tblrate tbody tr").each(function () {
        const allTd = $(this).children('td');

        if (allTd && allTd.length !== 0) {
          const exchangeCurrency = {exchange_currency_amounts: []};
          const currencyTypeAndAmount = allTd.eq(0).text().trim();
          const currencyType = currencyTypeAndAmount.match(/^\w+/)[0];
          const foundCurrencyAmount = currencyTypeAndAmount.match(/\d+(-)?(\d+)?/);
          const currencyAmount = foundCurrencyAmount ? foundCurrencyAmount[0] : "1";
          const buyPrice = allTd.eq(2).text().trim();
          const sellPrice = allTd.eq(3).text().trim();

          let currencyAmountFrom = null;
          let currencyAmountTo = null;

          if (currencyType && currencyAmount) {
            exchangeCurrency["currency_type"] = currencyType;

            if (/\d+[-]\d+/.test(currencyAmount)) {
              const splitValues = currencyAmount.split('-');
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
              currencyAmountFrom = parseInt(currencyAmount);
            }

            exchangeCurrency.exchange_currency_amounts.push({
              currency_amount: currencyAmount,
              currency_amount_from: currencyAmountFrom,
              currency_amount_to: currencyAmountTo,
              buy_price: buyPrice,
              sell_price: sellPrice
            });

            if (exchangeCurrency.exchange_currency_amounts.length !== 0) {
              if (!currencyTypesList.includes(exchangeCurrency.currency_type)) {
                response.exchange_currencies.push(exchangeCurrency);
                currencyTypesList.push(exchangeCurrency.currency_type);
              } else {
                response.exchange_currencies.forEach(currency => {
                  if (currency.currency_type === exchangeCurrency.currency_type) {
                    currency.exchange_currency_amounts = currency.exchange_currency_amounts.concat(exchangeCurrency.exchange_currency_amounts);
                  }
                });
              }
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

// scraper_2().then((response) => {
//   fs.writeFile('student-3.json', JSON.stringify(response), (err) => {
//     if (err) throw err;
//     console.log('Data written to file');
//   });
// }, (ex) => {
//   console.log(ex);
// });
