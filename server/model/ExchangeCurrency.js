'use strict';

module.exports = function(sequelize, DataTypes) {
  const ExchangeCurrency = sequelize.define('exchange_currency', {
    currency_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency_type: {
      type: DataTypes.ENUM,
      values: ['USD', 'EUR', 'GBP'],
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
};