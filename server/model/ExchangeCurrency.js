import {currencyType} from "./currencyType";

export function defineExchangeCurrency(sequelize, DataTypes) {
  const ExchangeCurrency = sequelize.define('currency', {
    currency_type: {
      type: DataTypes.ENUM,
      values: [...currencyType],
      allowNull: false
    }
  }, {
    underscored: true,
    tableName: 'currency'
  });

  ExchangeCurrency.doAssociate = function (models) {
    ExchangeCurrency.belongsToMany(models.ExchangeCompany, { through: models.CompanyCurrency });
    ExchangeCurrency.hasMany(models.ExchangeCurrencyAmount);
  };

  return ExchangeCurrency;
}
