const puppeteer = require('puppeteer');

export async function scraper() {
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
      branch_name: item.innerHTML,
      value: item.value
    }));
  });

  const result = await parseBySelectorOption(page, selectorOption);
  await browser.close();

  return mapBranchesWithSelectorOptions(result, selectorOption);
}

function mapBranchesWithSelectorOptions(branches, selectorOptions) {
  return selectorOptions.map(option => {
    return {
      branch_name: option.branch_name,
      exchange_currencies: branches[option.value] || []
    };
  });
}

async function parseBySelectorOption(page, selectorOption) {
  const bufferOfOptionIndex = [];
  const results = {};

  for (let option of selectorOption) {
    if (!bufferOfOptionIndex.includes(option.value)) {
      bufferOfOptionIndex.push(option.value);

      await page.select('.selectLocationRate', option.value);
      results[option.value] = await parseOption(page);
    }
  }

  return results;
}

async function parseOption(page) {
  return await page.evaluate(() => {
    let items = document.querySelectorAll('#table-rate tbody');

    return [...items]
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
            // amount.currency_amount = currencyAmount.innerHTML;
            // amount.sell_price = currencySell.innerHTML;
            // amount.buy_price = currencyBuy.innerHTML;
            rate.exchange_currency_amounts.push({
              currency_amount: currencyAmount.innerHTML,
              sell_price: currencySell.innerHTML,
              buy_price: currencyBuy.innerHTML
            });
            // rate.exchange_currencies[currencyAmount.innerHTML] = {};
            // rate.exchange_currencies[currencyAmount.innerHTML].currencyBuy = currencyBuy ? currencyBuy.innerHTML : '';
            // rate.exchange_currencies[currencyAmount.innerHTML].currencySell = currencySell ? currencySell.innerHTML : '';
          });

          return rate;
        }
      })
      .filter(item => !!item);
  });
}
