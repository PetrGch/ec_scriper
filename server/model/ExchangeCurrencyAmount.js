'use strict';

module.exports = function(sequelize, DataTypes) {
  const ExchangeCurrencyAmount = sequelize.define('exchange_currency_amount', {
    currency_amount: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    sell_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    buy_price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'exchange_currency_amount'
  });

  ExchangeCurrencyAmount.associate = function (models) {
    ExchangeCurrencyAmount.belongsTo(models.ExchangeCurrency);
  };

  return ExchangeCurrencyAmount;
};