import {defineExchangeCurrency} from "./ExchangeCurrency";
import {defineExchangeCompany} from "./ExchangeCompany";
import {defineExchangeCurrencyAmount} from "./ExchangeCurrencyAmount";

const Sequelize = require('sequelize');
const sequelize = new Sequelize('currency_exchange_test', 'root', '((Gtnh))123123', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 30000
  },
});

const models = {
  ExchangeCompany: defineExchangeCompany(sequelize, Sequelize.DataTypes),
  ExchangeCurrency: defineExchangeCurrency(sequelize, Sequelize.DataTypes),
  ExchangeCurrencyAmount: defineExchangeCurrencyAmount(sequelize, Sequelize.DataTypes)
};

Object.keys(models).forEach(function(modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
