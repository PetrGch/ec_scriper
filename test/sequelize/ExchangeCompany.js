'use strict';

module.exports = function(sequelize, DataTypes) {
  const ExhcangeCompany = sequelize.define('ExchangeCompany', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isCentralBank: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        // Place.hasMany(models.Comment);
      }
    }
  });

  return ExhcangeCompany;
};