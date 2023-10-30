const Server = require('../models/serve');
let mongoose = require('mongoose');

require('dotenv').config(); //configura y establece las variables de entornonpm

// database connection
console.log(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_CONTAINER_NAME}/${process.env.MONGO_INITDB_DATABASE}?authMechanism=SCRAM-SHA-1&authSource=admin`);
mongoose.connect(
    `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_CONTAINER_NAME}/${process.env.MONGO_INITDB_DATABASE}?authMechanism=SCRAM-SHA-1&authSource=admin`,
    { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }
);
mongoose.set('debug', true);



new Server().listen();
