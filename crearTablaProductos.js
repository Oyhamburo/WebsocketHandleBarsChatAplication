import knex from "knex";
import connection from "./mysql/db.js";

const Knex = knex(connection)


// schema es ABM de tablas
Knex.schema.createTable('productos', tabla => {
    //id int auto_increment primary key
    tabla.increments('id')
    tabla.string('nombre')
    tabla.string('precio')
    tabla.string('descripcion')
    tabla.integer('stock')
    tabla.datetime('timestamp')
    tabla.string('codigo')
    tabla.string('foto')
})
.then(()=>{
    console.log("tabla creada");
})
.catch((e)=>{
    console.log("error", e); throw e;
})
.finally(()=>{
    Knex.destroy()
})