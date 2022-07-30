const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sql');

const coffeModel = sequelize.define(
  'coffee',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    beverage_category: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'Coffee' },
    photo: { type: DataTypes.TEXT },
    beverage: { type: DataTypes.TEXT },
    beverage_prep: { type: DataTypes.TEXT },
    calories: { type: DataTypes.FLOAT(4) },
    total_fat: { type: DataTypes.FLOAT(4) },
    caffeine: { type: DataTypes.FLOAT(4) },
  },
  { paranoid: true, deletedAt: 'deletedAt', freezeTableName: true }
);

module.exports = coffeModel;
