import request from 'request-promise';
import cheerio from 'cheerio';
import {telegramLogger} from "../server/bot/telegramServerBot";

const options = {
  uri: 'https://www.bot.or.th/English/Statistics/FinancialMarkets/ExchangeRate/_layouts/Application/ExchangeRate/ExchangeRate.aspx',
  transform: function (body) {
    return cheerio.load(body);
  }
};

export function centralBankOfThailand() {
  return request(options)
    .then(($) => {
      const response = {
        branch_name: "Central Bank Of Thailand",
        exchange_currencies: []
      };

      $(".table-foreignexchange2 .bg-gray").each(function() {
        const exchange_currency = {exchange_currency_amounts: []};
        const allTd = $(this).children('td');

        if (allTd && allTd.length !== 0) {
          exchange_currency["currency_type"] = allTd.eq(2).text().trim();
          if (allTd.length === 6) {
            exchange_currency.exchange_currency_amounts.push({
              currency_amount_from: "1",
              currency_amount_to: null,
              currency_amount: "1",
              buy_price: allTd.eq(3).text().trim(),
              sell_price: allTd.eq(5).text().trim()
            })
          }
          if (allTd.length === 5) {
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
          response.exchange_currencies.push(exchange_currency);
        }
      });

      return [response];
    })
    .catch(function (err) {
      telegramLogger(err.message);
    });
}