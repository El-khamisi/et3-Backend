require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  TOKENKEY: process.env.TOKENWORD,
  NODE_ENV: process.env.NODE_ENV,

  //datebase
  DATABASE_URI_PROD: process.env.DATABASE_URI_PROD,
  DATABASE_URI_DEV: process.env.DATABASE_URI_DEV,
};
