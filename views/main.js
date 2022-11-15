const socket = io.connect()

function render(data) {
    const html = data.map(msg => `<li class="clearfix">
    <div class="message-data">
    <span class="message-data-time">${msg.autor}</span> [${msg.fecha}]
    </div>
    <div class="message my-message">${msg.msj}</div>
    </li>`).join(" ");

    document.getElementById('mensajes').innerHTML = html;
}

function enviarMensaje(event) {
    const nombre = document.getElementById('nombre').value;
    const msj = document.getElementById('chat_mensaje').value;
    const fecha = new Date().toLocaleString();
    console.log(fecha);
    document.getElementById('chat_mensaje').value = '';
    socket.emit('new_msg', {
        autor: nombre,
        msj: msj,
        fecha: fecha
    })
    return false;
}

//productos
function renderProducto(prod) {
    const html = prod.map(elem => `
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">${elem.id}</th>
    <td class="py-4 px-6">${elem.nombreProd}</td>
    <td>$${elem.precio}</td>
    <td>${elem.descripcion}</td>
    <td>${elem.stock}</td>
    <td>${elem.timestamp}</td>
    <td>${elem.codigo}</td>
    <td><img style="max-width: 100px;" class="max-w-xs h-auto" src="${elem.foto}" style="width: 30px; height: 30px;" /></td>
    <td>
        <button onclick="return modificarProducto(this)" value="${elem.id}" type="button" class="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        <span class="sr-only">Icon description</span>
        </button>
    </td>
    <td>
        <button onclick="return borrarProducto(this)" value="${elem.id}" type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        <span class="sr-only">Icon description</span>
        </button>
    </td>
    </tr>`).join(' ');
    document.getElementById('lista-productos').innerHTML = html;
}

function enviarProducto(prod) {
    const nombre = document.getElementById("nombre").value
    const precio = document.getElementById("precio").value
    const descripcion = document.getElementById("descripcion").value
    const stock = document.getElementById("stock").value
    const codigo = document.getElementById("codigo").value
    const foto = document.getElementById("foto").value



    if (nombre != "" && precio != "" && descripcion != "" && stock != "" && codigo != "" && foto != "") {
        socket.emit("new_producto", {
            nombre: nombre,
            precio: precio,
            descripcion: descripcion,
            stock: stock,
            timestamp: new Date(),
            codigo: codigo,
            foto: foto
        })
    }
    else
    {
        console.log("faltan campos");
    }
    return false
}

function borrarProducto(prod) {
    socket.emit("remove_producto", prod.value)
    return false
}

function modificarProducto(prod) {
    const nombre = document.getElementById("nombre").value
    const precio = document.getElementById("precio").value
    const descripcion = document.getElementById("descripcion").value
    const stock = document.getElementById("stock").value
    const codigo = document.getElementById("codigo").value
    const foto = document.getElementById("foto").value

    if (nombre != "" && precio != "" && descripcion != "" && stock != "" && codigo != "" && foto != "") {
        socket.emit("modify_producto", {
            id:prod.value,
            nombre: nombre,
            precio: precio,
            descripcion: descripcion,
            stock: stock,
            timestamp: new Date(),
            codigo: codigo,
            foto: foto
        })        
    }
    else
    {
        console.log("faltan campos");
    }
    return false
}


socket.on('mensajes', data => {
    console.log(data);
    render(data);
})
socket.on("productos", (prod) => {
    renderProducto(prod);
})