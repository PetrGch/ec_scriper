import uuid from "uuid/v4";

import models from "../model";
import {createManyCurrencies, findAllCurrenciesByLinkName} from "./exchangeCurrencyService";

function getCurrencyQuery(whereParams) {
  const currencyQuery = {
    model: models.ExchangeCurrency,
    attributes: ['id', 'currency_type'],
    through: {
      attributes: ['id', 'link_name'],
    },
    include: [
      {
        model: models.ExchangeCurrencyAmount,
        attributes: [
          'id', 'currency_amount', 'currency_amount_from', 'currency_amount_to',
          'sell_price', 'buy_price', 'sell_trend', 'buy_trend', 'updated_at'
        ]
      }
    ]
  };

  return whereParams
    ? Object.assign({}, currencyQuery, { where: whereParams })
    : currencyQuery;

}

function getCompanyDetailQuery() {
  return {
    model: models.ExchangeCompanyDetail,
    attributes: ['phone', 'website', 'email'],
  }
}

function getCompanyWorkingTimeQuery() {
  return {
    model: models.ExchangeCompanyWorkingTime,
    attributes: [
      'mn_from', 'mn_to', 'tu_from', 'tu_to', 'we_from', 'we_to',
      'th_from', 'th_to', 'fr_from', 'fr_to', 'st_from', 'st_to', 'sn_from', 'sn_to']
  }
}

function getAllCompaniesQuery(whereParams) {
  return {
    include: [
      getCurrencyQuery(whereParams),
      getCompanyDetailQuery(),
      getCompanyWorkingTimeQuery()
    ]
  }
}

export function getAllExchangeCompanies(currencyType) {
  return models.ExchangeCompany.findAll(getAllCompaniesQuery(currencyType));
}

export function postExchangeCompany(companyPayload) {
  return models.ExchangeCompany.create({
    uuid: uuid(),
    branch_name: companyPayload.branch_name,
    company_name: companyPayload.company_name,
    lat: companyPayload.lat,
    lng: companyPayload.lng,
    is_central_bank: companyPayload.is_central_bank,
    address: companyPayload.address,
    google_map_url: companyPayload.google_map_url,
    office_type: companyPayload.office_type,
    link_currency_by: companyPayload.link_currency_by
  }).then(async (company) => {
    const foundCurrencies = await findAllCurrenciesByLinkName(company.link_currency_by);

    if (foundCurrencies && !!foundCurrencies.length) {
      company.addCurrencies(foundCurrencies, { through: { link_name: company.link_currency_by }});
    } else {
      return createManyCurrencies(company, companyPayload.exchange_currencies);
    }
  });
}

export function findCompanyById(id) {
  return models.ExchangeCompany.findOne({
    where: {id: id},
    include: [
      getCurrencyQuery(),
      getCompanyDetailQuery(),
      getCompanyWorkingTimeQuery()
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
      getCurrencyQuery(),
      getCompanyDetailQuery(),
      getCompanyWorkingTimeQuery()
    ]
  });
}

export function findCompanyByName(companyName) {
  return models.ExchangeCompany.findAll({
    where: { company_name: `${companyName}` },
    include: [
      getCurrencyQuery(),
      getCompanyDetailQuery(),
      getCompanyWorkingTimeQuery()
    ]
  });
}

export function updateCompany(company, companyPayload, isCurrencyNeedToBeUpdated = false) {
  return company.update({
    branch_name: companyPayload.branch_name || company.branch_name,
    company_name: companyPayload.company_name || company.company_name,
    lat: companyPayload.lat || company.lat,
    lng: companyPayload.lng || company.lng,
    is_central_bank: companyPayload.is_central_bank || company.is_central_bank,
    address: companyPayload.address || company.address,
    google_map_url: companyPayload.google_map_url || company.google_map_url,
    office_type: companyPayload.office_type || company.office_type,
    link_currency_by: companyPayload.link_currency_by || company.link_currency_by
  })
    .then(async (company) => {
      if (isCurrencyNeedToBeUpdated) {
        const foundCurrencies = await findAllCurrenciesByLinkName(company.link_currency_by);

        if (foundCurrencies && !!foundCurrencies.length) {
          company.addCurrencies(foundCurrencies, { through: { link_name: company.link_currency_by }});
        }
      }
    })
    .catch(ex => console.error(ex));
}

export function deleteCompanyById(company) {
  return company.destroy();
}
