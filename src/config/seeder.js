const User = require('../services/user/user.model');
const { Admin } = require('./roles');
const bcrypt = require('bcrypt');

const superAdmin = async () => {
  const prototype = {
    first_name: 'cup',
    last_name: 'cake',
    email: 'admin@test.com',
    password: 'admin123',
    role: Admin,
  };

  try {
    const usr = await User.findOne({
      email: 'admin@test.com',
    }).exec();

    if (!usr) {
      const saved = new User(prototype);
      if (prototype.password) {
        saved.password = bcrypt.hashSync(prototype.password, 10);
      } else {
        throw new Error('Invalid Password');
      }
      await saved.save();
    }
  } catch (e) {
    console.log('CAN NOT CREATE SUPER ADMIN' + e.message);
  }
};

module.exports = superAdmin;
