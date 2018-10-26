import models from "../model";
import {getFixedNumber} from "../util/converter";

export function createManyCurrenciesAmount(currencyId, currenciesAmount) {
  if (currenciesAmount && currenciesAmount.length !== 0) {
    const mappedCurrency = currenciesAmount.map(amount => {
      return {
        currency_amount: amount.currency_amount || 1,
        sell_price: amount.sell_price,
        buy_price: amount.buy_price,
        exchange_currency_id: currencyId
      }
    });

    return models.ExchangeCurrencyAmount.bulkCreate(mappedCurrency);
  }

  return null;
}

export function deleteManyCurrenciesAmount(amounts) {
  const amountsId = amounts.map(amount => amount.id);
  return models.ExchangeCurrencyAmount.destroy({
    where: { id: amountsId }
  });
}

export function findManyCurrenciesAmount(amounts) {
  const amountsId = amounts.map(amount => amount.id);
  return models.ExchangeCurrencyAmount.findAll({
    where: { id: amountsId }
  })
}

export async function updateManyCurrencyAmount(oldCurrency, newCurrency) {
  const filteredAmounts = filterAmounts(oldCurrency, newCurrency);

  if (filteredAmounts.delete.length !== 0) {
    await deleteManyCurrenciesAmount(filteredAmounts.delete);
  }

  if (filteredAmounts.create.length !== 0) {
    await createManyCurrenciesAmount(oldCurrency.id, filteredAmounts.create);
  }

  if (filteredAmounts.update.length !== 0) {
    await updateAllAmounts(filteredAmounts.update);
  }


  return Promise.resolve();
  // return findManyCurrenciesAmount(oldCurrency.exchange_currency_amounts)
  //   .then((foundCurrency) => {
  //     filterAmounts()
  //   }, (ex) => ex);
}

function filterAmounts(foundCurrency, payloadCurrency) {
  let forUpdate = [];
  let forDelete = [];
  let forCreate = [];

  if (foundCurrency.exchange_currency_amounts && foundCurrency.exchange_currency_amounts.length === 0) {
    if (payloadCurrency.exchange_currency_amounts && payloadCurrency.exchange_currency_amounts.length !== 0) {
      forCreate = forCreate.concat(payloadCurrency.exchange_currency_amounts);
    }
  } else if (payloadCurrency.exchange_currency_amounts && payloadCurrency.exchange_currency_amounts.length === 0) {
    if (foundCurrency.exchange_currency_amounts && foundCurrency.exchange_currency_amounts.length !== 0) {
      forDelete = forDelete.concat(foundCurrency.exchange_currency_amounts);
    }
  } else if (payloadCurrency.exchange_currency_amounts && payloadCurrency.exchange_currency_amounts.length !== 0) {
    forCreate = payloadCurrency.exchange_currency_amounts.slice();
    forDelete = foundCurrency.exchange_currency_amounts.slice();

    payloadCurrency.exchange_currency_amounts.forEach(amountInPayload => {
      if (foundCurrency.exchange_currency_amounts && foundCurrency.exchange_currency_amounts.length !== 0) {

        foundCurrency.exchange_currency_amounts.forEach(amount => {
          if (amount.currency_amount === amountInPayload.currency_amount) {
            const createIndex = forCreate.indexOf(amountInPayload);
            const deleteIndex = forDelete.indexOf(amount);

            forUpdate.push({newAmount: amountInPayload, oldAmount: amount});
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

async function updateAllAmounts(amounts) {
  await amounts.forEach(async ({newAmount, oldAmount}) => {
    console.log(getFixedNumber(newAmount.sell_price, 3) !== getFixedNumber(oldAmount.sell_price, 3))
    if ((getFixedNumber(newAmount.sell_price, 3) !== getFixedNumber(oldAmount.sell_price, 3))
      || (getFixedNumber(newAmount.buy_price, 3) !== getFixedNumber(oldAmount.buy_price, 3))) {
      await models.ExchangeCurrencyAmount.update(
        {
          sell_price: newAmount.sell_price || oldAmount.sell_price,
          buy_price: newAmount.buy_price || oldAmount.buy_price
        },
        { where: { id: oldAmount.id } }
      )
    }
  })
}