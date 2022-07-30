# eT3Task-Backend

## Description
A Backend Server ( based on `node.js` and `express` framework) using `mysql` as a database provider and `sequelize` as ORM.
The webstie  has the ability to register new users using `JWT token` with different roles, explore different categories of coffee. The Admin of the website can add products, edit, and delete them


## Features
* Dashboard for website admin which gives the ability to control the products.
* Authenticate and authorize users by `JWT token` and initialize `express-session` for each user.
* Store data in `mysql` using the `sequelize` ORM.
* Authenticate the token by `Bearer token`
* Upload the media by `Multer` middleware and store them on `Cloudinary`.

## Installing

* Download the dependencies with `npm` package manager
```
$ npm install
```
## Executing program
* * The website works on `http://localhost:process.env.PORT || 8080` OR by `nodemon` which is run in development mode with monitoring of debugging terminal.

>npm run scripts
```
{
    "scripts": {
      "prettier": "prettier --config .prettierrc './**/*.js'  --write",
      "dev": "nodemon index.js 5050",
      "prod": " NODE_ENV=prod node index.js 8080",
      "start": "node index.js"
  },
}
```

## API Documention
[Postman API Documention](https://documenter.getpostman.com/view/17898602/UzdzTQYN)

## Environment Variables 
> src/config/env.js
```
PORT
TOKENWORD
company_SQLDB

#database
DATABASE_URI_PROD
DATABASE_URI_DEV

#cloudinary
cloudinary_name
cloudinary_api_key
cloudinary_api_secret

#environment
NODE_ENV

```

## Directory Structure

```
.
|_node_modules/
|_src
|    |_config
|    |_middelwares
|    |_services          #website is divided into small services
|    |    |_model.js
|    |    |_controllers.js            
|    |    |_routes.js
|    |    
|    |_utils
|    |
|    |_index.routes.js
|
|_.env
|_.gitignore
|_index.js
|_package.json
|_README.md
|_LICENSE.md
```
