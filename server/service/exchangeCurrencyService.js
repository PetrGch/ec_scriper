import models from "../model";
import {
  createManyCurrenciesAmount,
  deleteManyCurrenciesAmount,
  updateManyCurrencyAmount
} from "./exchangeCurrencyAmountService";
import {findCompanyByBranchName} from "./exchangeCompanyService";

export async function getAllCurrencyType() {
  return await models.ExchangeCurrency.findAll()
    .then((currencies) => {
      return currencies ?
        currencies.reduce((currencyAcc, currency) => {
          if (!currencyAcc.includes(currency.currency_type)) {
            currencyAcc.push(currency.currency_type);
          }

          return currencyAcc;
        }, ["EUR", "USD", "GBP"])
        : []
    })
}

export function findAllCurrenciesByLinkName(linkName) {
  return models.ExchangeCompany.findOne({
    where: {
      link_currency_by: linkName
    },
    include: [{
      model: models.ExchangeCurrency,
      through: {
        where: {
          link_name: linkName
        }
      }
    }]
  }).then((company) => {
    if (company && company.currencies) {
      return company.currencies
    }

    return null;
  });
}

export function createManyCurrencies(company, currencies) {
  if (currencies && currencies.length !== 0) {
    return Promise.all(currencies
      .filter(currency => !!currency.currency_type)
      .map(currency => {
        return models.ExchangeCurrency.create({
          currency_type: currency.currency_type
        })
          .then(createdCurrency => {
            company.addCurrency(createdCurrency, { through: { link_name: company.link_currency_by }});

            return createManyCurrenciesAmount(createdCurrency.id, currency.exchange_currency_amounts);
          });
      }))
  }

  return null;
}

export async function deleteManyCurrencies(currencies) {
  await currencies.forEach(async currency => {
    if (currency.exchange_currency_amounts && currency.exchange_currency_amounts.length !== 0) {
      await deleteManyCurrenciesAmount(currency.exchange_currency_amounts)
        .then(() => {
          models.ExchangeCurrency.destroy({
            where: { id: currency.id }
          })
      });
    } else {
      await models.ExchangeCurrency.destroy({
        where: { id: currency.id }
      })
    }
  });

  return null;
}

export async function updateManyCurrencies(currencies) {
  await currencies.forEach(async ({ oldCurrency, newCurrency }) => {
    if (oldCurrency.exchange_currency_amounts && Array.isArray(oldCurrency.exchange_currency_amounts)) {
      await updateManyCurrencyAmount(oldCurrency, newCurrency);
    }
  });

  return null;
}

export function updateCurrenciesAmount(branchesPayload) {
  return findAllCurrenciesByBranchName(branchesPayload);
}

async function findAllCurrenciesByBranchName(branchesPayload) {
  if (branchesPayload && branchesPayload.length !== 0) {
    branchesPayload.forEach(async branch => {
      const foundBranch = await findCompanyByBranchName(branch.branch_name);
      const filteredCurrencies = filterCurrencies(foundBranch, branch);

      if (foundBranch !== null && filteredCurrencies !== null) {
        if (filteredCurrencies.delete.length !== 0) {
          await deleteManyCurrencies(filteredCurrencies.delete);
        }

        if (filteredCurrencies.update.length !== 0) {
          await updateManyCurrencies(filteredCurrencies.update);
        }

        if (filteredCurrencies.create.length !== 0) {
          await createManyCurrencies(foundBranch, filteredCurrencies.create);
        }
      }
    });
  }
}

function filterCurrencies(foundBranch = [], branchPayload = []) {
  const forUpdate = [];
  let forDelete = [];
  let forCreate = [];

  if (branchPayload.length === 0) {
    return null;
  }

  if (foundBranch.currencies && foundBranch.currencies.length === 0) {
    if (branchPayload.exchange_currencies && branchPayload.exchange_currencies.length !== 0) {
      forCreate = forCreate.concat(branchPayload.exchange_currencies);
    }
  } else if (branchPayload.exchange_currencies && branchPayload.exchange_currencies.length === 0) {
    if (foundBranch.currencies && foundBranch.currencies.length !== 0) {
      forDelete = forDelete.concat(foundBranch.currencies);
    }
  } else if (branchPayload.exchange_currencies && branchPayload.exchange_currencies.length !== 0) {
    forCreate = branchPayload.exchange_currencies.slice();
    forDelete = foundBranch.currencies.slice();

    branchPayload.exchange_currencies.forEach(currencyInPayload => {
      if (foundBranch.currencies && foundBranch.currencies.length !== 0) {
        foundBranch.currencies.forEach(currency => {
          if (currency.currency_type === currencyInPayload.currency_type) {
            const createIndex = forCreate.indexOf(currencyInPayload);
            const deleteIndex = forDelete.indexOf(currency);

            forUpdate.push({newCurrency: currencyInPayload, oldCurrency: currency});
            forCreate.splice(createIndex, 1);
            forDelete.splice(deleteIndex, 1);
          }
        })
      }
    })
  }

  return {
    update: forUpdate,
    delete: forDelete,
    create: forCreate
  };
}
