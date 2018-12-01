export function defineExchangeCompanyWorkingTime(sequelize, DataTypes) {
  return sequelize.define('exchange_company_working_time', {
    mn_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mn_to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tu_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tu_to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    we_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    we_to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    th_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    th_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fr_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fr_to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    st_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    st_to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sn_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sn_to: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'exchange_company_working_time'
  });
}
