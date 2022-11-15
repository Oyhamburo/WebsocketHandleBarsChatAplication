// import knex from 'knex';
// import connection from './mysql/db.js';
// const Knex = knex(connection)
import knex from "knex";
// import fs from 'fs';
class BaseDeDatos {
    constructor(config, tabla) {
        this.knex = knex(config)
        this.table = tabla;
    // constructor(archivo) {
        // this.archivo = archivo        
    }
    async save(producto) {
        try {
            return await this.knex.insert(producto).into(this.table)
            // const data = await fs.promises.readFile(`${this.archivo}`, `utf-8`)
            // const productos = JSON.parse(data);
            // const id = productos.length + 1;
            // producto.id = id;
            // productos.push(producto);
            // const productosString = JSON.stringify(productos);
            // await fs.promises.writeFile(`${this.archivo}`, productosString)
            // return producto.id

        } catch (error) {
            return "no se guardar"

        }
    }

    async getById(id) {
        try{
            const producto = this.knex.select('*').from(this.table).where({id})
        // const data = await fs.promises.readFile(`${this.archivo}`, "utf-8");
        // const productos = JSON.parse(data);
        // const producto = productos.find((producto) => producto.id == id);
            if(producto){
                console.log(producto)
                return producto
            }else{
                return "hubo un error"
            }
        }catch(e)
        {
            throw new Error(e)
        }
    }
    // async random() {
    //     try {
    //         const data = await fs.promises.readFile(`${this.archivo}`, "utf-8")
    //         const dataArray = JSON.parse(data);
    //         const aleatorio = Math.floor(Math.random() * dataArray.length);
    //         const valor = dataArray[aleatorio]

    //         return valor

    //     } catch {
    //         return "ocurrio un error inesperado"
    //     }
    // }
    async deleteById(id) {

        try {
            return await this.knex.from(this.table).where({id}).del()
            // const data = await fs.promises.readFile(`${this.archivo}`, "utf-8")
            // const productos = JSON.parse(data);
            // const arrayBorrado = productos.filter((item) => item.id !== id)
            // const verricar = productos.find((item) => item.id === id);
            // if (verricar) {
            //     await fs.promises.writeFile(`${this.archivo}`, JSON.stringify(arrayBorrado))
            //     return "se borro el archivo correctamente"
            // } else {
            //     return "no se encontro el archivo"
            // }

        } catch (error) {
            return "error el leer el archivo borrado por id"
        }

    }
    
    async getAll() {
        try {
            return this.knex.select('*').from(this.table)
            // const data = await fs.promises.readFile(`${this.archivo}`, "utf-8")
            // const datos = JSON.parse(data)
            // return datos

        } catch (error) {
            return "error al leer el archivo"
        }
    }
    async deleteAll() {
        try {
            fs.promises.writeFile(`${this.archivo}`, JSON.stringify([]))
            console.log('se borro la lista')
        } catch (err) {
            console.error("ocurrio un error", err)
        }

    }

    async updateById(objetoNuevo) {
        const obj = {
            nombre: objetoNuevo.nombre,
            precio: objetoNuevo.precio,
            descripcion: objetoNuevo.descripcion,
            stock: objetoNuevo.stock,
            timestamp: objetoNuevo.timestamp,
            codigo: objetoNuevo.codigo,
            foto: objetoNuevo.foto
        }
        console.log(obj);
        try {            
            return await this.knex.from(this.table).where('id',objetoNuevo.id).update(obj)            
            // const data = fs.readFileSync(this.archivo, "utf-8");
            // let dataParseada = JSON.parse(data);
            // let productoViejo = dataParseada.find((objeto) => objeto.id === id);

            // if (productoViejo === undefined) {
            //     throw {
            //         msg: "404 Not found"
            //     };
            // }
            // let productosFiltrados = dataParseada.filter((objeto) => objeto.id !== id);
            // productoViejo = {
            //     id,
            //     ...objetoNuevo
            // };
            // productosFiltrados.push(productoViejo);
            // fs.writeFileSync(this.archivo, JSON.stringify(productosFiltrados, null, 2));
            // return "se remplazo el producto";


        } catch (error) {
            return "no se encontro el producto a cambiar"
        }

    }
}



export default BaseDeDatos;