export function defineExchangeCompanyDetail(sequelize, DataTypes) {
  return sequelize.define('exchange_company_detail', {
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'exchange_company_detail'
  });
};
