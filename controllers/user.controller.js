const {response, request} = require('express');

const usuariosGet = (req = request, res = response) => {
    const {nombre, edad} = req.query;
    res.status(200).json({
        "msg":"get-api controlador",
        nombre,
        edad
    })
}

const usuariosPost = (req, res) => {
    const {nombre, edad, id}= req.body; //valores que envio desde un fomulario
    res.status(201).json({
        "msg":"post-api controller",
         nombre,
         edad,
         id

    })
}

const usuariosPut = (req, res) => {
    const id = req.params.id; //obteniendo el id que se envia por la url
    res.status(400).json({
        "msg":"put-api controller",
        id
    })
}

const usuariosDelete = (req, res) => {
    res.status(403).json({
        "msg":"delete-api controller"
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}