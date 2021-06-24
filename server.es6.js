import express from 'express';
const app = express();
import fs from 'fs';
import handlebars from 'express-handlebars';
const puerto = 8080;
const rutaM = "./mensajes.txt";
import Productos from './api/productos.js';
import http from 'http';
import {Server as Socket} from 'socket.io'
const server = http.Server(app)
const io = new Socket(server)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
import router from './router/routes.js'
app.use('/api', router);
app.engine("hbs", handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs"
}));

let productos = new Productos;
let messages = [
    {
        author: "Martin",
        text: "me encanta la pagina"
    }
]
async function read(rutaM) {
    try {
        const archivo = await fs.promises.readFile(rutaM);
        messages = JSON.parse(archivo);
    } catch (err) {
        throw new Error("No se encontro ningun mensaje en la base de datos");
    }
}
read(rutaM);
io.on("connection", function(socket){
    console.log("un cliente se ha conectado");
    socket.emit("messages", messages);

    socket.on("new-message", function(data) {
        messages.push(data);
        io.sockets.emit("messages", messages)
        let dato = JSON.stringify(messages,null,2)
        fs.writeFileSync(rutaM, dato, 'utf-8')
    })
    
        
})

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    /* Envio los mensajes al cliente que se conectó */
    socket.emit('productos', productos.listar());

    /* Escucho los mensajes enviado por el cliente y se los propago a todos */
    socket.on('update', data => {
        io.sockets.emit('productos', productos.listar());
    });
});



app.set('views','./views')
app.set('view engine','hbs')

server.listen(puerto, ()=>{
    console.log(`El servidor esta escuchando en puerto ${puerto}`)
})

