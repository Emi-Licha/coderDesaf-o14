import express from 'express';
const router = express.Router();
import Productos from '../api/productos.js'
import fs from 'fs';
const ruta = "./productos.txt";

let productos = new Productos;

router.get('/productos/listar', (req, res) => {

    async function read(ruta) {
        try {
            const archivo = await fs.promises.readFile(ruta);
            res.send(JSON.parse(archivo));
        } catch (err) {
            res.send("No se encontraron productos");
        }
    }
    read(ruta);

});

router.get('/productos/vista', (req, res) => {
    let prods = productos.listar();
    res.render('lista', { productos: prods, hayProductos: prods.length });
})

router.post('/productos/guardar', (req, res) => {
   
    
    let producto = req.body;
    res.json(productos.guardar(producto))
    
    let data = JSON.stringify(productos,null,2);
    fs.writeFileSync(ruta, data, 'utf-8')
    
    
})

router.get('/productos/listar/:id', (req,res) =>{
    const id = req.params.id
    const producto = productos.find(producto => producto.id == id)
    if (!producto){
        res.json({'error': 'Producto no encontrado'})
    }
    res.json(producto)
})

router.delete('/productos/:id', (req,res)=>{
    let { id } = req.params
    let producto = productos.borrar(id)
    if(!producto){
        res.send('el producto que usted intenta borrar no existe!')
    }
    res.send(`El producto ha sido eliminado con exito!`);
    
})
router.put('/productos/actualizar/:id', (req,res) => {
    let { id } = req.params
    let producto = req.body
    if(!producto){
        res.send('No se ha encontrado ningun producto con ese id!')
    }
    productos.actualizar(producto,id)
    res.json(producto)
})

export default router;