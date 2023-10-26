const Server = require('./models/server.model');

require('dotenv').config(); //configura y establece las variables de entornonpm

const server = new Server();
server.listen();