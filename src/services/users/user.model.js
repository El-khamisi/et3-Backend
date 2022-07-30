const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');

//configuration
const { TOKENKEY, NODE_ENV } = require('../../config/env');

const userModel = sequelize.define({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING(10), allowNull: false },
  last_name: { type: DataTypes.STRING(10), allowNull: false },
  email: { type: DataTypes.STRING(), unique: true, validate: { isEmail: { msg: 'Please enter a valid email address' } } },
  role: { type: DataTypes.STRING(8), allowNull: false },
  password: { type: DataTypes.TEXT, allowNull: false },
});

userSchema.methods.generateToken = function (req, res) {
  const token = jwt.sign(
    {
      id: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      photo: this.photo,
      phone: this.phone,
      role: this.role,
      isVerified: this.isVerified,
    },
    TOKENKEY,
    { expiresIn: '7d' }
  );

  return token;
};

//Exclude findOne for Login password
userSchema.post(['save', 'find', 'findByIdAndUpdate', 'findByIdAndDelete'], function (doc, next) {
  if (!doc) {
    next();
  } else if (doc.length && doc.length > 0) {
    doc.forEach((e, i) => {
      doc[i].password = undefined;
    });
  } else {
    doc.password = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
