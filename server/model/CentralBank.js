export function defineCentralBank(sequelize, DataTypes) {
  const CentralBank = sequelize.define('central_bank', {
    title_eng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title_th: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subtitle_eng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subtitle_th: {
      type: DataTypes.STRING,
      allowNull: true
    },
    source_of_data_eng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    source_of_data_th: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currency_name_eng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currency_name_th: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currency_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    last_updated: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true,
    tableName: 'central_bank'
  });

  CentralBank.associate = function (models) {
    CentralBank.hasMany(models.CentralBankDetail);
  };

  return CentralBank;
}
