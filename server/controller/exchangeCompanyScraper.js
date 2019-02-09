import express from 'express';

import {updateCurrenciesAmount} from "../service/exchangeCurrencyService";
import {panneeExchange} from "../../scriper/panneeExchange";
import {centralBankOfThailand} from "../../scriper/centralBankOfThailand";
import {siaMoneyExchange} from "../../scriper/SIAMoneyExchange";
import {siamExchange} from "../../scriper/siamExchange";
import {superRichThailand} from "../../scriper/superRichThailand";
import {scrapersConfig} from "../../scriper/scrapersConfig";
import {scraperCompanySingleton} from "../service/exchangeCompanyScraperService";

const exchangeCompanyScraper = express.Router({});

// run scraper
exchangeCompanyScraper.get('/run', (req, res) => {
  Promise.all([centralBankOfThailand(), superRichThailand(), siaMoneyExchange(), panneeExchange(), siamExchange()])
    .then(responses => {
      const filteredResponses = responses.filter(response => response && Array.isArray(response));
      const concatedResponses = filteredResponses.reduce((responseAcc, response) => {
        return responseAcc.concat(response);
      }, []);

      updateCurrenciesAmount(concatedResponses)
        .then(() => {
          res.sendStatus(200);
        }, (ex) => {
          throw new Error(ex);
        })
        .catch((ex) => {
          res.send(ex);
        })
    }, () => {
      res.sendStatus(500)
    });
});

exchangeCompanyScraper.get("/branch/:name", (req, res) => {
  const branchName = req.params.name;

  if (branchName) {
    let foundBranch = scrapersConfig.find((scraper) => scraper.name === branchName);

    if (foundBranch) {
      foundBranch.scrape()
        .then((responses) => {
          return updateCurrenciesAmount(responses)
            .then(() => {
              res.status(200).send(`Company ${branchName} was update successfully`)
            }, () => {
              res.status(500).send(`Update problem with company: ${branchName}`);
            })
        }, () => {
          res.status(500).send(`Scrape problem with company: ${branchName}`);
        });
    } else {
      res.status(500).send(`Company with branch name ${branchName} doesn't exist!`);
    }
  } else {
    res.status(500).send("Parameter 'name' is required");
  }
});

exchangeCompanyScraper.get("/scheduler/run", (req, res) => {
  const interval = req.query.interval;

  res.send(scraperCompanySingleton.run(interval));
});

exchangeCompanyScraper.get("/scheduler/stop", (req, res) => {
  res.send(scraperCompanySingleton.stop());
});

exchangeCompanyScraper.get("/scheduler/restart", (req, res) => {
  const interval = req.query.interval;

  res.send(scraperCompanySingleton.restart(interval));
});

exchangeCompanyScraper.get("/scheduler/statistic", (req, res) => {
  res.send(scraperCompanySingleton.statistic());
});

export default exchangeCompanyScraper;