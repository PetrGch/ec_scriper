export function defineCentralBankDetail(sequelize, DataTypes) {
  const CentralBankDetail = sequelize.define('central_bank_detail', {
    period: {
      type: DataTypes.STRING,
      allowNull: false
    },
    buy_price: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sell_price: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'central_bank_detail',
    classMethods: {
      associate: function (models) {}
    }
  });

  CentralBankDetail.associate = function (models) {
    CentralBankDetail.belongsTo(models.CentralBank);
  };

  return CentralBankDetail;
}
