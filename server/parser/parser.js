const puppeteer = require('puppeteer');

async function some() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const selector = '.country-name';
  const wait = page.waitForFunction(selector => !!document.querySelector(selector), {}, selector);
  await page.setDefaultNavigationTimeout(120000);
  await page.goto('https://www.superrichthailand.com/#!/en/exchange');
  await wait;

  await page.click('.selectLocationRate');
  await page.select('.selectLocationRate', '3');
  await page.screenshot({path: 'example.png', fullPage: true});
  await browser.close();

}

some().catch((ex) => {console.log(ex);});