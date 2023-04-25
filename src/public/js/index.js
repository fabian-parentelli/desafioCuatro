const socket = io();

const fomProduc = document.querySelector('#fomProduc');
const container = document.querySelector('#container');

socket.on('products', data => {

    container.innerHTML = ``;

    data.forEach(prod => {
        const div = document.createElement('div');
        div.classList = 'products';
        div.innerHTML += `
            <ul>
                <li>title: ${prod.title}</li> 
                <li>description: ${prod.description}</li>
                <li>code: ${prod.code}</li>
                <li>price: ${prod.price}</li>
                <li>status: ${prod.status}</li>
                <li>stock: ${prod.stock}</li>
                <li>category: ${prod.category}</li>
                <li>id: ${prod.id}</li>
            </ul>
            <button class="eliminar" id=${prod.id}>Eliminar</button>
        `;
        container.appendChild(div);
    });
});


fomProduc.addEventListener("submit", (e) => {
    e.preventDefault();
    const product = Object.fromEntries(new FormData(e.target));
    product.thumbnails = [];
    socket.emit("post", product);
});

container.addEventListener("click", (e) => {
    socket.emit("delete", e.target.id);
});