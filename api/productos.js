class Productos {
    constructor() {
        this.productos = []
        this.id = 0
    }

    listar() {
        return this.productos;
    }

    listarAll() {
        return this.productos.length? this.productos : {error : 'no hay productos cargados'}
    }

    guardar(prod) {
        prod.id = ++this.id
        this.productos.push(prod)
    }

    actualizar(prod,id) {
        prod.id = Number(id)
        let index = this.productos.findIndex( prod => prod.id == id)
        this.productos.splice(index,1,prod)
    }

    borrar(id) {
        let index = this.productos.findIndex( prod => prod.id == id)
        return this.productos.splice(index,1)
    }

}

export default Productos