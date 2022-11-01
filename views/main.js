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
    <td class="py-4 px-6">${elem.title}</td>
    <td>$${elem.precio}</td>
    <td><img style="max-width: 100px;" class="max-w-xs h-auto" src="${elem.img}" style="width: 30px; height: 30px;" /></td>
    </tr>`).join(' ');
    document.getElementById('lista-productos').innerHTML = html;
}

function enviarProducto(prod) {
    const title = document.getElementById("title").value
    const precio = document.getElementById("precio").value
    const img = document.getElementById("img").value

    socket.emit("new_producto", {
        title: title,
        precio: precio,
        img: img
    })
    return false



}


socket.on('mensajes', data => {
    console.log(data);
    render(data);
})
socket.on("productos", (prod) => {
    renderProducto(prod);
})