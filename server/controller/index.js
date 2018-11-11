import express from 'express';

import exchangeCompanyController from "./exchangeCompanyController";
import exchangeCurrencyController from "./exchangeCurrencyController";
import exchangeCurrencyAmountController from "./exchangeCurrencyAmountController";
import exchangeCompanyDetailController from "./exchangeCompanyDetailController";
import exchangeCompanyWorkingTimeController from "./exchangeCompanyWorkingTimeController";

const controller = express.Router({});

controller.use('/exCompany', exchangeCompanyController);
controller.use('/exCompanyDetail', exchangeCompanyDetailController);
controller.use('/exCompanyWorkingTime', exchangeCompanyWorkingTimeController);
controller.use('/exCurrency', exchangeCurrencyController);
controller.use('/exCurrencyAmount', exchangeCurrencyAmountController);

export default controller;