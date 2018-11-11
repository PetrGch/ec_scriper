import uuid from "uuid/v4";

import models from "../model";
import {createManyCurrencies} from "./exchangeCurrencyService";

export function getAllExchangeCompanies() {
  return models.ExchangeCompany.findAll({
    include: [
      {
        model: models.ExchangeCurrency,
        attributes: ['id', 'currency_name', 'currency_type', 'created_at', 'updated_at'],
        include: [
          {
            model: models.ExchangeCurrencyAmount,
            attributes: ['id', 'currency_amount', 'currency_amount_from', 'currency_amount_to', 'sell_price', 'buy_price'],
          }
        ]
      },
      {
        model: models.ExchangeCompanyDetail,
        attributes: ['phone', 'website', 'email'],
      },
      {
        model: models.ExchangeCompanyWorkingTime,
        attributes: [
          'mn_from', 'mn_to', 'tu_from', 'tu_to', 'we_from', 'we_to',
          'th_from', 'th_to', 'fr_from', 'fr_to', 'st_from', 'st_to', 'sn_from', 'sn_to']
      },
    ]
  });
}

export function postExchangeCompany(companyPayload) {
  return models.ExchangeCompany.create({
    uuid: uuid(),
    branch_name: companyPayload.branch_name,
    company_name: companyPayload.company_name,
    lat: companyPayload.lat,
    lng: companyPayload.lng,
    is_central_bank: companyPayload.is_central_bank
  }).then(company => {
    return createManyCurrencies(company.id, companyPayload.exchange_currencies);
  });
}

export function findCompanyById(id) {
  return models.ExchangeCompany.findOne({
    where: {id: id},
    include: [
      {
        model: models.ExchangeCurrency,
        attributes: ['id', 'currency_name', 'currency_type', 'created_at', 'updated_at'],
        include: [
          {
            model: models.ExchangeCurrencyAmount,
            attributes: ['id', 'currency_amount', 'currency_amount_from', 'currency_amount_to', 'sell_price', 'buy_price'],
          }
        ]
      },
      {
        model: models.ExchangeCompanyDetail,
        attributes: ['phone', 'website', 'email'],
      },
      {
        model: models.ExchangeCompanyWorkingTime,
        attributes: [
          'mn_from', 'mn_to', 'tu_from', 'tu_to', 'we_from', 'we_to',
          'th_from', 'th_to', 'fr_from', 'fr_to', 'st_from', 'st_to', 'sn_from', 'sn_to']
      },
    ]
  });
}

export function isCompanyExist(id) {
  return models.ExchangeCompany.findOne({
    where: {id: id},
  });
}

export function findCompanyByBranchName(branchName) {
  return models.ExchangeCompany.findOne({
    where: {branch_name: `${branchName}`},
    include: [
      {
        model: models.ExchangeCurrency,
        attributes: ['id', 'currency_name', 'currency_type', 'created_at', 'updated_at'],
        include: [
          {
            model: models.ExchangeCurrencyAmount,
            attributes: ['id', 'currency_amount', 'currency_amount_from', 'currency_amount_to', 'sell_price', 'buy_price'],
          }
        ]
      },
      {
        model: models.ExchangeCompanyDetail,
        attributes: ['phone', 'website', 'email'],
      },
      {
        model: models.ExchangeCompanyWorkingTime,
        attributes: [
          'mn_from', 'mn_to', 'tu_from', 'tu_to', 'we_from', 'we_to',
          'th_from', 'th_to', 'fr_from', 'fr_to', 'st_from', 'st_to', 'sn_from', 'sn_to']
      },
    ]
  });
}

export function findCompanyByName(companyName) {
  return models.ExchangeCompany.findAll({
    where: {company_name: `${companyName}`},
    include: [
      {
        model: models.ExchangeCurrency,
        attributes: ['id', 'currency_name', 'currency_type', 'created_at', 'updated_at'],
        include: [
          {
            model: models.ExchangeCurrencyAmount,
            attributes: ['id', 'currency_amount', 'currency_amount_from', 'currency_amount_to', 'sell_price', 'buy_price'],
          }
        ]
      },
      {
        model: models.ExchangeCompanyDetail,
        attributes: ['phone', 'website', 'email'],
      },
      {
        model: models.ExchangeCompanyWorkingTime,
        attributes: [
          'mn_from', 'mn_to', 'tu_from', 'tu_to', 'we_from', 'we_to',
          'th_from', 'th_to', 'fr_from', 'fr_to', 'st_from', 'st_to', 'sn_from', 'sn_to']
      },
    ]
  });
}

export function updateCompany(company, companyPayload) {
  return company.update({
    branch_name: companyPayload.branch_name || company.branch_name,
    company_name: companyPayload.company_name || company.company_name,
    lat: companyPayload.lat || company.lat,
    lng: companyPayload.lng || company.lng,
    is_central_bank: companyPayload.is_central_bank || company.is_central_bank,
  }).catch(ex => console.error(ex));
}
