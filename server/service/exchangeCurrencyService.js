import models from "../model";
import {
  createManyCurrenciesAmount,
  deleteManyCurrenciesAmount,
  updateManyCurrencyAmount
} from "./exchangeCurrencyAmountService";
import {findCompanyByBranchName} from "./exchangeCompanyService";

export function createManyCurrencies(companyId, currencies) {
  if (currencies && currencies.length !== 0) {
    return Promise.all(currencies.map(currency => {
      return models.ExchangeCurrency.create({
        currency_name: currency.currency_name,
        currency_type: currency.currency_type,
        exchange_company_id: companyId
      })
        .then(currencyAmount => {
          return createManyCurrenciesAmount(currencyAmount.id, currency.exchange_currency_amounts);
        });
    }));
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
  await currencies.forEach(async ({oldCurrency, newCurrency}) => {
    if (oldCurrency.exchange_currency_amounts && Array.isArray(oldCurrency.exchange_currency_amounts)) {
      await updateManyCurrencyAmount(oldCurrency, newCurrency)
        .then(() => {
          if (newCurrency.currency_name && oldCurrency.currency_name !== newCurrency.currency_name) {
            models.ExchangeCurrency.update(
              { currency_name: newCurrency.currency_name },
              { where: { id: oldCurrency.id } })
          }
        });
    } else {
      if (newCurrency.currency_name && oldCurrency.currency_name !== newCurrency.currency_name) {
        await models.ExchangeCurrency.update(
          { currency_name: newCurrency.currency_name },
          { where: { id: oldCurrency.id } })
      }
    }
  });

  return null;
}

export function updateCurrenciesAmount(branchesPayload) {
  return findAllCurrenciesByBranchName(branchesPayload);
}

async function findAllCurrenciesByBranchName(branchesPayload) {
  if (branchesPayload && branchesPayload.length !== 0) {
    for (let branch of branchesPayload) {
      console.log(branch)
      console.log(branch.branch_name)
      const foundBranch = await findCompanyByBranchName(branch.branch_name);
      console.log(JSON.stringify(foundBranch))
      if (foundBranch !== null) {
        const filteredCurrencies = filterCurrencies(foundBranch, branch);
        if (filteredCurrencies.delete.length !== 0) {
          await deleteManyCurrencies(filteredCurrencies.delete);
        }

        if (filteredCurrencies.create.length !== 0) {
          await createManyCurrencies(foundBranch.id, filteredCurrencies.create);
        }

        if (filteredCurrencies.update.length !== 0) {
          await updateManyCurrencies(filteredCurrencies.update);
        }
      }
    }
  }
}

function filterCurrencies(foundBranch = [], branchPayload = []) {
  const forUpdate = [];
  let forDelete = [];
  let forCreate = [];

  if (foundBranch.exchange_currencies && foundBranch.exchange_currencies.length === 0) {
    if (branchPayload.exchange_currencies && branchPayload.exchange_currencies.length !== 0) {
      forCreate = forCreate.concat(branchPayload.exchange_currencies);
    }
  } else if (branchPayload.exchange_currencies && branchPayload.exchange_currencies.length === 0) {
    if (foundBranch.exchange_currencies && foundBranch.exchange_currencies.length !== 0) {
      forDelete = forDelete.concat(foundBranch.exchange_currencies);
    }
  } else if (branchPayload.exchange_currencies && branchPayload.exchange_currencies.length !== 0) {
    forCreate = branchPayload.exchange_currencies.slice();
    forDelete = foundBranch.exchange_currencies.slice();

    branchPayload.exchange_currencies.forEach(currencyInPayload => {
      if (foundBranch.exchange_currencies && foundBranch.exchange_currencies.length !== 0) {

        foundBranch.exchange_currencies.forEach(currency => {
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
