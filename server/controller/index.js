import express from 'express';

import exchangeCompanyController from "./exchangeCompanyController";
import exchangeCurrencyController from "./exchangeCurrencyController";
import exchangeCurrencyAmountController from "./exchangeCurrencyAmountController";
import exchangeCompanyDetailController from "./exchangeCompanyDetailController";
import exchangeCompanyWorkingTimeController from "./exchangeCompanyWorkingTimeController";
import centralBankController from "./centralBankController";
import exchangeCompanyBranchController from "./exchangeCompanyBranchController";
import exchangeCompanyScraper from "./exchangeCompanyScraper";

const controller = express.Router({});

controller.use('/exCompany', exchangeCompanyController);
controller.use('/exCompanyBranch', exchangeCompanyBranchController);
controller.use('/exCompanyDetail', exchangeCompanyDetailController);
controller.use('/exCompanyWorkingTime', exchangeCompanyWorkingTimeController);
controller.use('/exCurrency', exchangeCurrencyController);
controller.use('/exCurrencyAmount', exchangeCurrencyAmountController);
controller.use('/exCompanyScraper', exchangeCompanyScraper);
controller.use('/centralBank', centralBankController);

export default controller;