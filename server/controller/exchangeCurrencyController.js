import express from 'express';

import models from '../model'
import {updateCurrenciesAmount} from "../service/exchangeCurrencyService";

const exchangeCurrencyController = express.Router({});

// get all currencies
exchangeCurrencyController.get('/', (req, res) => {
  models.ExchangeCompany.findAll()
    .then(currencies => {
      res.json(currencies);
    })
    .catch(ex => res.send(ex));
});

// create new currency
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

// update currencies
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