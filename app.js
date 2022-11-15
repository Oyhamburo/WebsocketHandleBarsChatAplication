import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import {fileURLToPath} from 'url';


//KNEX 
import knex from 'knex';
//SQLITE3
import sqliteConfig from './sqliteConfig.js';
const Knex = knex(sqliteConfig)

import BaseDeDatos from './funciones.js';

//MARIADB
import connection from './mysql/db.js';
const DB = new BaseDeDatos(connection, 'productos')
// import DB from "./funciones.js";
// const db = new DB("./data/productos.json")

const app = express();

// import fs from 'fs';
import {Server as HTTPServer} from 'http';
import {Server as SocketServer } from 'socket.io';

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename); 
const httpServer = new HTTPServer(app)

const io = new SocketServer (httpServer)

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use (express.static("views"));
/*ESTAS DOS LINEAS SIEMPRE TIENEN QUE ESTAR*/

const Mensajes = []


app.engine('hbs',handlebars.engine({
    layoutsDir: `${__dirname}/views/layouts`,
    partialDir: `${__dirname}/views/partials`,
    defaultLayout:'main',
    extname:'.hbs'
}))

app.set('views','./views');
app.set('view engine', 'hbs')


// GET PARA TRAER PRODUCTO POR ID DE MARIADB
app.get('/productos/:id', async (req, res) => {
    const {id} = req.params
    const productos = await DB.getById(id);
    res.send(productos);
})

app.get("/",async (req,res) => {
    res.render("index", {layout:"main",productos:await DB.getAll()})
})

io.on('connection', async (socket) =>{
    console.log(`conectado: ${socket.id}`);    
    
    socket.emit("productos", await DB.getAll())

    
/* ESCUCHO LOS MENSAJES NUEVOS EN EL BACK */
    socket.on('new_msg', (data) =>{
        console.log(data);
        // Escribo en archivo .txt el mensaje
        // fs.writeFile('message.txt', JSON.stringify(Mensajes), function() {
        //     console.log('Archivo Grabado!');
        // });

        // ESCRIBO EN BD SQLITE
        Knex("msgs")
            .insert(data)
            .then(()=> {
                console.log(data);
            })
            .catch((e)=>{
                console.log(e);
            })


        
// CONSTANTE SOCKET USUARIO ESPECIFICO
// IO.SOCKETS TODOS LOS USUARIOS CONECTADOS AL SOCKET
        Knex.from("msgs").select('*')
            .then(rows => {
                io.sockets.emit('mensajes', rows)
                console.table(rows)
            })
            .catch((e) => {
                console.log(e);
            })
    })
    socket.on("new_producto",async (prod)=>{
        console.log(prod);
        await DB.save(prod)

        const productos = await DB.getAll()
        io.sockets.emit("productos",productos)
    })

    socket.on("remove_producto",async (id)=>{
        console.log(id);
        await DB.deleteById(id)

        const productos = await DB.getAll()
        io.sockets.emit("productos",productos)
    })

    socket.on("modify_producto",async (prod)=>{        
        await DB.updateById(prod)        
        console.log(prod);
        const productos = await DB.getAll()
        io.sockets.emit("productos",productos)
    })
})

const server = httpServer.listen(8080, () => {
    console.log("Servidor iniciado");
});

server.on("error", (error) => {
    console.error(`Error: ${error}`);
});