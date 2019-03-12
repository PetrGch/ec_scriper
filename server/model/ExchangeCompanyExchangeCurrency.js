export function defineExchangeCompanyExchangeCurrency(sequelize, DataTypes) {
  return sequelize.define('companyCurrency', {
    link_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    underscored: true,
    tableName: 'company_currency'
  })
}
