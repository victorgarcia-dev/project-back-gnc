const express = require('express');

class Server {
    constructor() {
        //configurar para usar express en el proyecto
        this.app = express();


        //rutas api
        this.usersPath = '/api/users';

        //conectar a la base de datos
        // this.conectarDB();

        //Middleware
        this.middleware();

        //rutas de mi app
        this.routes();

    }

    /*async conectarDB() {
        await dbConnection()
    }*/



    //rutas de mi app
    routes() {
        //ruta usuarios
        this.app.use(this.usersPath, require('../routes/user.route'));
    }

    middleware() {

        //leo y parseo body
        this.app.use(express.json());
    }

    //escuchar servidor
    listen() {
        this.app.listen(process.env.PORT || 42000, () => {
            console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
        })
    }
}

module.exports = Server;