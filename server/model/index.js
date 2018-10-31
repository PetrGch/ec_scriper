import {defineExchangeCurrency} from "./ExchangeCurrency";
import {defineExchangeCompany} from "./ExchangeCompany";
import {defineExchangeCurrencyAmount} from "./ExchangeCurrencyAmount";
import properties from "../properties";

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  properties.DATABASE_NAME,
  properties.DATABASE_USER_NAME,
  properties.DATABASE_PASSWORD,
  {
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

Object.keys(models).forEach(function (modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
