import knex from 'knex';
import sqliteConfig from './sqliteConfig.js';
const Knex = knex(sqliteConfig)


// schema es ABM de tablas
Knex.schema.createTable('msgs', tabla => {
    //id int auto_increment primary key
    tabla.increments('id')
    tabla.string('autor')
    tabla.string('msj')
    tabla.string('fecha')    
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