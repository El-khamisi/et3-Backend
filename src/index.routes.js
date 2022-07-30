const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const { TOKENKEY, NODE_ENV, DATABASE_URI_DEV, DATABASE_URI_PROD } = require('./config/env');

const login = require('./services/login/login.routes');
const dashboard = require('./services/dashboard/index.routes');

//Utilities Routes
const metadata = require('./services/utils/metadata.routes');

module.exports = async (app) => {
  app.use(cookieParser());
  app.use(express.json());

  let sequelize;
  if (ENV == 'dev') {
    app.use(morgan('dev'));
    sequelize = new Sequelize(DATABASE_URI_DEV, {
      logging: false,
    });
  } else {
    sequelize = new Sequelize(DATABASE_URI_PROD, {
      logging: false,
    });
  }
  //Create All models in database
  sequelize
    .sync({ alter: true })
    .then((res) => {
      console.log(`Database has been connected`);
    })
    .catch((err) => {
      console.log('Can NOT connect to Database', err);
    });

  // Middlewares for allowing CORS
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Credentials', true);
    return next();
  });

  //Routers
  app.use(login);
};
