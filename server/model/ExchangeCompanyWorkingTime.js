export function defineExchangeCompanyWorkingTime(sequelize, DataTypes) {
  return sequelize.define('exchange_company_working_time', {
    mn_from: {
      type: DataTypes.TIME,
      allowNull: true
    },
    mn_to: {
      type: DataTypes.TIME,
      allowNull: true
    },
    tu_from: {
      type: DataTypes.TIME,
      allowNull: true
    },
    tu_to: {
      type: DataTypes.TIME,
      allowNull: true
    },
    we_from: {
      type: DataTypes.TIME,
      allowNull: true
    },
    we_to: {
      type: DataTypes.TIME,
      allowNull: true
    },
    th_from: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    th_to: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    fr_from: {
      type: DataTypes.TIME,
      allowNull: true
    },
    fr_to: {
      type: DataTypes.TIME,
      allowNull: true
    },
    st_from: {
      type: DataTypes.TIME,
      allowNull: true
    },
    st_to: {
      type: DataTypes.TIME,
      allowNull: true
    },
    sn_from: {
      type: DataTypes.TIME,
      allowNull: true
    },
    sn_to: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'exchange_company_working_time'
  });
}
