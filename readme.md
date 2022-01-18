## Step 1

- Create folder for project
- init npm package for the project

```
$ npm init
```

## Install dependencies

- For Project dependencies
- Eg

`npm i --save (dependencies)`

- For Development dependencies
- eg

```
npm i -D nodemon
```

## Setup script for start
- For production and Development
```
 "scripts": {
    "start": "NODE_ENV=production node server",
    "dev":"nodemon server"
  },
```
## Runing the project
- Inside the root directory of the project.
- development
```
$ npm  dev
```
- Production
```
$ npm start
```

## Add env file
- create folder for config files
- add config.env
```
NODE_ENV=production
PORT=5000
```

- using it the env variables
```
const dotenv = require('dotenv');

dotenv.config({path:"./config/config.env"});
```