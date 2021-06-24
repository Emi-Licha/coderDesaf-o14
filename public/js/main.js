const socket = io.connect();



/* si recibo productos, los muestro usando handlebars */
socket.on('productos', function (productos) {
    console.log('productos socket client')
    document.getElementById('datos').innerHTML = data2TableHBS(productos)
});

/* obtengo el formulario */
const form = document.querySelector('form');

form.addEventListener('submit', event => {
    event.preventDefault();
    const data = { name: form[0].value, price: form[1].value, thumbnail: form[2].value };
    console.log(data)
    fetch('/api/productos/guardar', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(respuesta => respuesta.json())
    .then(productos => {
        form.reset();
        socket.emit('update', 'ok');
    })
    .catch(error => {
        console.log('ERROR', error);
    });
});

function data2TableHBS(productos) {
    const plantilla = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>
        {{#if productos.length}}
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>
                {{#each productos}}
                <tr>
                    <td>{{this.id}}</td>
                    <td>{{this.name}}</td>
                    <td>$ {{ this.price }}</td>
                    <td><img width="50" src={{this.thumbnail}} alt="not found"></td>
                </tr>
                {{/each}}
            </table>
        </div>
        {{/if}}
    `

    console.log(productos);
    var template = Handlebars.compile(plantilla);
    let html = template({ productos: productos, hayProductos: productos.length });
    return html;
}
function addMessage(e) {
    let msg ={
        author: document.getElementById("username").value,
        text: document.getElementById("text").value
    }
    socket.emit("new-message", msg);
    return false
}

function render(data){
    let html = data
        .map(function(e, index){
            return`<div>
            <strong>${e.author}</strong>
            <em>${e.text}<em></div>`
        })
        .join(" ");
        document.getElementById("messages").innerHTML = html;
}
socket.on("messages", function(data){
    render(data)
})