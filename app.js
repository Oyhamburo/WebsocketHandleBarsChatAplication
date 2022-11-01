const express = require('express')
const handlebars = require('express-handlebars')
//servidor express
const app = express();
const DB = require("./funciones")
const db = new DB("./data/productos.json")
//const productosRouter = require('./routes/productos')
//variable para escribir en archivo
var fs = require('fs');

const {Server: HTTPServer} = require ('http')
const {Server: SocketServer } = require ('socket.io')

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



app.get("/",async (req,res) => {
    res.render("index", {layout:"main",productos:await db.getAll()})
})

io.on('connection', async (socket) =>{
    console.log(`conectado: ${socket.id}`);

    socket.emit('mensajes', Mensajes)
    socket.emit("productos", await db.getAll())

/* ESCUCHO LOS MENSAJES NUEVOS EN EL BACK */
    socket.on('new_msg', (data) =>{
        console.log(data);
        Mensajes.push(data);

        // Escribo en archivo .txt el mensaje
        fs.writeFile('message.txt', JSON.stringify(Mensajes), function() {
            console.log('Archivo Grabado!');
        });
        io.sockets.emit('mensajes', Mensajes)
// CONSTANTE SOCKET USUARIO ESPECIFICO
// IO.SOCKETS TODOS LOS USUARIOS CONECTADOS AL SOCKET
    })
    socket.on("new_producto",async (prod)=>{
        await db.save(prod)

        const productos = await db.getAll()
        io.sockets.emit("productos",productos)
    })
})

const server = httpServer.listen(8080, () => {
    console.log("Servidor iniciado");
});

server.on("error", (error) => {
    console.error(`Error: ${error}`);
});