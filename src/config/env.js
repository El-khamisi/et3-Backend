require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  TOKENKEY: process.env.TOKENWORD,
  NODE_ENV: process.env.NODE_ENV,

  //datebase
  DATABASE_URI_PROD: process.env.DATABASE_URI_PROD,
  DATABASE_URI_DEV: process.env.DATABASE_URI_DEV,

  //Cloudinary
  cloudinary_name: process.env.cloudinary_name,
  cloudinary_api_key: process.env.cloudinary_api_key,
  cloudinary_api_secret: process.env.cloudinary_api_secret,
};
