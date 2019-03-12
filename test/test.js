import request from "request-promise";
import fs from "fs";
import cheerio from "cheerio";
import {telegramLogger} from "../server/bot/telegramServerBot";
import {twelveVictoryExchange} from "../scriper/twelveVictoryExchange";
import {superRichThailand} from "../scriper/superRichThailand";
const puppeteer = require('puppeteer');

const options = {
  uri: 'http://twelvevictory.com/exchange2.php',
  transform: function (body) {
    return cheerio.load(body);
  }
};
//
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   console.log("here");
//
//   const selector = '.main1';
//   const wait = page.waitForFunction(selector => !!document.querySelector(selector), {}, selector);
//   // await page.setDefaultNavigationTimeout(1200000);
//   await page.goto('http://twelvevictory.com/exchange2.php');
//
//   await wait;
//
//   console.log("here");
//   await page.screenshot({path: 'example_2.png'});
//   await browser.close();
// })();

superRichThailand().then((response) => {
  fs.writeFile('result.json', JSON.stringify(response), (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
}, (ex) => {
  console.log(ex);
});
