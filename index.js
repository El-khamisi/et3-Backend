const express = require('express');
const sequelize = require('./src/config/sql');

const { PORT, NODE_ENV } = require('./src/config/env');
const superAdmin = require('./src/config/seeder.js');

const port = PORT || 8080;

//Create Application
const app = express();

const endpoints = require('./src/index.routes');
endpoints(app);

//Create All models in database
sequelize
  .sync()
  .then((res) => {
    console.log('Database has been connected');
  })
  .then((_) =>
    superAdmin()
      .then((_) => console.log(`Super Admin has been created succefully`))
      .catch((err) => console.log(err))
  )
  .catch((err) => {
    console.log(`Can NOT sync tables || ${err}`);
  });

if (NODE_ENV == 'dev') {
  app.listen(process.argv[2], () => {
    console.log(`Development connected successfully ON PORT-${process.argv[2]}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Production connected successfully ON port-${port}`);
  });
}

module.exports = app;
