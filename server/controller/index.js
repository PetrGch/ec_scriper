import express from 'express';

import exchangeCompanyController from "./exchangeCompanyController";
import exchangeCurrencyController from "./exchangeCurrencyController";
import exchangeCurrencyAmountController from "./exchangeCurrencyAmountController";

const controller = express.Router({});

controller.use('/exCompany', exchangeCompanyController);
controller.use('/exCurrency', exchangeCurrencyController);
controller.use('/exCurrencyAmount', exchangeCurrencyAmountController);

export default controller;