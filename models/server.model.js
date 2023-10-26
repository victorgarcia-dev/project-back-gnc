const express = require('express');

class Server {
    constructor(){
        //configurar para usar express en el proyecto
        this.app = express();

        //variable de entorno
        this.port = process.env.PORT || 8080;

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
         this.app.use( this.usersPath , require('../routes/user.route' ));
    }

    middleware(){

        //leo y parseo body
        this.app.use(express.json());
    }

    //escuchar servidor
    listen(){
        this.app.listen(this.port, () => {
            console.log(`servidor corriendo en el puerto ${this.port}`);
        })
    }
}

module.exports = Server;