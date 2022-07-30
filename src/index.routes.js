const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { createClient } = require('redis');
let RedisStore = require('connect-redis')(session);
const morgan = require('morgan');
const { TOKENKEY, NODE_ENV } = require('./config/env');

const login = require('./services/users/login.routes');
const coffee = require('./services/coffee/routes');

//Utilities Routes
const uploadMedia = require('./services/utils/upload_media.routes');

module.exports = async (app) => {
  app.use(cookieParser());
  app.use(express.json());
  app.use(morgan('dev'));

  let redisClient = createClient({ legacyMode: true });
  redisClient
    .connect((_) => console.log('Redis client has been connected succefully'))
    .catch((err) => console.log(`Error while connecting to Redis client: ${err}`));

  app.use(
    session({
      name: 's_id',
      secret: TOKENKEY,
      store: new RedisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days OR ONE WEEK
        sameSite: NODE_ENV == 'dev' ? '' : 'none',
        secure: NODE_ENV == 'dev' ? false : true,
        httpOnly: false,
      },
    })
  );

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
  app.use(coffee);
  app.use(uploadMedia);
};
