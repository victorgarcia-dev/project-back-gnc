'use strict';

let morgan = require('morgan');
const express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let common = require('./libs/common');
const helmet = require('helmet');
let errorResponse = common.errorResponse;

require('dotenv').config();
const app = express();

// database connection
console.log(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_CONTAINER_NAME}/${process.env.MONGO_INITDB_DATABASE}?authMechanism=SCRAM-SHA-1&authSource=admin`);
mongoose.connect(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_CONTAINER_NAME}/${process.env.MONGO_INITDB_DATABASE}?authMechanism=SCRAM-SHA-1&authSource=admin`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.set('debug', true);


// API CORS
let enableCORS = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Access-Token');
  if ('OPTIONS' == req.method) {
    return res.sendStatus(200);
  }
  next();
};
app.use(enableCORS);


// parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('[:date[iso]] :remote-addr :method :url :status :response-time ms - :res[content-length]'));


// public routes
app.use('/api/v1', require('./routes/public'));

// lo saco para poder hacer mas rapido todo, volver a poner una vez que 
// se avance con la app y login web

// authentication and authorization middleware
//app.use('/api/v1/:companycode', require('./routes/authentication'));
//app.use('/api/v1/:companycode', require('./routes/authorization'));
//app.use('/api/v1/:companycode', require('./routes/auth.js'));


// private routes cuando implemente auth de nuevo agregar las companys

//app.use("/api/v1/:companycode/events", require("./routes/event"));
//app.use("/api/v1/:companycode/assistant", require("./routes/assistant"));
//app.use("/api/v1/:companycode/ticket", require("./routes/ticket"));
//app.use("/api/pagos", require("./routes/pagos"));
//app.use("/api/pagofinal", require("./routes/pagoFinal"));

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  return errorResponse({ status: 500, error: 'Server Error' }, res);
});

app.listen(process.env.API_PORT);
console.log('API GNC => listening on port ' + process.env.API_PORT);

