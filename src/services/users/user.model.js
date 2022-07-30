const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sql');
const jwt = require('jsonwebtoken');

//configuration
const { TOKENKEY } = require('../../config/env');

const userModel = sequelize.define(
  'users',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING(10), allowNull: false },
    last_name: { type: DataTypes.STRING(10), allowNull: false },
    email: { type: DataTypes.STRING(), unique: true, validate: { isEmail: { msg: 'Please enter a valid email address' } } },
    role: { type: DataTypes.ENUM(['admin', 'customer']), allowNull: false, defaultValue: 'customer' },
    password: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    freezeTableName: true,
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
  }
);

userModel.prototype.generateToken = function () {
  const token = jwt.sign(
    {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      role: this.role,
    },
    TOKENKEY,
    { expiresIn: '7d' }
  );

  return token;
};

module.exports = userModel;
