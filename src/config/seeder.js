const bcrypt = require('bcrypt');
const userModel = require('../services/users/user.model');

const superAdmin = async () => {
  const prototype = {
    first_name: 'cup',
    last_name: 'cake',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
  };

  try {
    const usr = await userModel.findOne({ whare: { email: prototype.email } });
    if (!usr) {
      if (prototype.password) {
        prototype.password = bcrypt.hashSync(prototype.password, 10);
      } else {
        throw new Error('Invalid Password');
      }
      const saved = await userModel.create(prototype);
    }
  } catch (e) {
    throw new Error('CAN NOT CREATE SUPER ADMIN ' + e.message);
  }
};

module.exports = superAdmin;
