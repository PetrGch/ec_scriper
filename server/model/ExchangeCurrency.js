import {currencyType} from "./currencyType";

export function defineExchangeCurrency(sequelize, DataTypes) {
  const ExchangeCurrency = sequelize.define('exchange_currency', {
    currency_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency_type: {
      type: DataTypes.ENUM,
      values: [...currencyType],
      allowNull: false
    }
  }, {
    underscored: true,
    tableName: 'exchange_currency'
  });

  ExchangeCurrency.associate = function (models) {
    ExchangeCurrency.belongsTo(models.ExchangeCompany);
    ExchangeCurrency.hasMany(models.ExchangeCurrencyAmount)
  };

  return ExchangeCurrency;
}