'use strict';

export function defineExchangeCompany(sequelize, DataTypes) {
  const ExchangeCompany = sequelize.define('exchange_company', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_central_bank: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'exchange_company',
    classMethods: {
      associate: function (models) {}
    }
  });

  ExchangeCompany.associate = function (models) {
    ExchangeCompany.hasMany(models.ExchangeCurrency);
  };

  return ExchangeCompany;
};