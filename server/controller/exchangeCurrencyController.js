import express from 'express';

import models from '../model'
import {updateCurrenciesAmount} from "../service/exchangeCurrencyService";

const exchangeCurrencyController = express.Router({});

exchangeCurrencyController.get('/', (req, res) => {
  models.ExchangeCompany.findAll()
    .then(currency => {
      console.log(JSON.stringify(currency));
      res.sendStatus(200);
    })
    .catch(ex => res.send(ex));
});


exchangeCurrencyController.post('/', (req, res) => {
  const newExCurrency = req.body;

  models.ExchangeCurrency.create({
    currency_name: newExCurrency.currency_name,
    currency_type: newExCurrency.currency_type,
    exchange_company_id: 1
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(ex => res.send(ex));
});

exchangeCurrencyController.put('/', (req, res) => {
  const branchesPayload = req.body;
  updateCurrenciesAmount(branchesPayload)
    .then((companies) => {
      res.json(companies)
    }, (ex) => {
      throw new Error(ex);
    })
    .catch((ex) => {
      res.send(ex);
    })
});

export default exchangeCurrencyController;