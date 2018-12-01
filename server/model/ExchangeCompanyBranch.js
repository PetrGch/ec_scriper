const branchType = ['ATM', 'OFFICE'];

export function defineExchangeCompanyBranch(sequelize, DataTypes) {
  return sequelize.define('exchange_company_branch', {
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    google_map_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    branch_type: {
      type: DataTypes.ENUM,
      values: [...branchType],
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'exchange_company_branch',
  });
}
