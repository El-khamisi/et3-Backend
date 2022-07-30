const Sequelize = require('sequelize');
const { NODE_ENV, DATABASE_URI_DEV, DATABASE_URI_PROD } = require('./env');

let sequelize;
if (NODE_ENV == 'dev') {
  sequelize = new Sequelize(DATABASE_URI_DEV, {
    logging: false,
  });
} else {
  sequelize = new Sequelize(DATABASE_URI_PROD, {
    logging: false,
  });
}

module.exports = sequelize;
