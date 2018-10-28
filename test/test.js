const puppeteer = require('puppeteer');
const fs = require('fs');

async function some() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const selector = '.country-name';
  const wait = page.waitForFunction(selector => !!document.querySelector(selector), {}, selector);
  await page.setDefaultNavigationTimeout(120000);
  await page.goto('https://www.superrichthailand.com/#!/en/exchange');
  await wait;

  const selectorOption = await page.evaluate(() => {
    let items = document.querySelectorAll('.selectLocationRate option');
    return [...items].map(item => ({
      title: item.innerHTML,
      value: item.value
    }));
  });

  const results = await parseBySelectorOption(page, selectorOption);
  await browser.close();

  return results;
}

async function parseBySelectorOption(page, selectorOption) {
  const bufferOfOptionIndex = [];
  const results = [];

  for (let option of selectorOption) {
    if (!bufferOfOptionIndex.includes(option.value)) {
      bufferOfOptionIndex.push(option.value);
      const result = {
        branch_name: option.title
      };
      await page.select('.selectLocationRate', option.value);
      // await page.screenshot({path: `example_${option.value}.png`, fullPage: true});
      result.exchange_currencies = await parseOption(page);
      results.push(result);
    }
  }

  return results;
}

async function parseOption(page) {
  const currencies = await page.evaluate(() => {
    let items = document.querySelectorAll('#table-rate tbody');

    return items ? [...items]
      .map(item => {
        const currencyType = item.querySelector('.country span');
        const rate = {};
        if (currencyType) {
          rate.currency_type = currencyType.innerHTML;

          const currencyValue = item.querySelectorAll('tr');
          [...currencyValue].forEach(item => {
            if (!rate.exchange_currency_amounts) {
              rate.exchange_currency_amounts = [];
            }

            const currencyAmount = item.querySelector('span[ng-bind*="denom"]');
            const currencyBuy = item.querySelector('span[ng-bind*="cBuying"]');
            const currencySell = item.querySelector('span[ng-bind*="cSelling"]');

            rate.exchange_currency_amounts.push({
              currency_amount: currencyAmount.innerHTML,
              sell_price: currencySell.innerHTML,
              buy_price: currencyBuy.innerHTML
            });
          });

          return rate;
        }
      })
      .filter(item => !!item) : [];
  });

  return currencies.map(currency => {
    const amounts = currency.exchange_currency_amounts.map(amount => {
      const currencyAmountRange = transfromValueToCurrencyFrom(amount.currency_amount.trim());
      return Object.assign({}, amount, {
        currency_amount_from: currencyAmountRange.from,
        currency_amount_to: currencyAmountRange.to,
      })
    });

    return Object.assign({}, currency, { exchange_currency_amounts: amounts })
  });
}

function transfromValueToCurrencyFrom(value) {
  const number = /^[0-9]*/m;
  const numberWithDash = /[0-9]+\s{0,4}[-]\s{0,4}[0-9]+/m;

  const result = {
    from: 1,
    to: null
  };

  if (number.test(value) && !numberWithDash.test(value)) {
    result.from = value;
    return result;
  }

  if (numberWithDash.test(value)) {
    const splitedValues = value.split('-');
    const filrstValue = splitedValues[0].trim().match(number)[0];
    const lastValue = splitedValues[1].trim().match(number)[0];

    if (filrstValue <= lastValue) {
      result.from = filrstValue;
      result.to = lastValue;
      return result;
    }
    result.from = lastValue;
    result.to = filrstValue;

    return result;
  }

  return result
}

some()
  .then((data) => {
    const json = JSON.stringify(data);
    fs.writeFile('./test.json', json)
      // .then(() => {console.log('File was saved successfully!')});
  })
  .catch((ex) => {
    console.log(ex);
  });