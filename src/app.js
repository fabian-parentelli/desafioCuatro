import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js'
import { Server, Socket } from 'socket.io';
import productRouter from './routers/product.router.js';
import cartRouter from './routers/cart.router.js';
import viewRouter from './routers/view.router.js'

import ProductManager from './manager/productManager.js';
const productManager = new ProductManager('./src/files/products.json');

const app = express();
app.use(express.static(`${__dirname}/public`))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const server = app.listen(8080, () => console.log('Listening server on port 8080'));

const io = new Server(server);

// app.set('socketio', io);

io.on("connection", async (socket) => {
    console.log('Nuevo cliente conectado');
    
    // Ver productos.
    const products = await productManager.getAll();
    socket.emit('products', products);

    // Agrgar productos.
    socket.on('post', async (product) => {
        const result = await productManager.addProducts(product);
        socket.emit('products', result);
    });

    socket.on("delete", async (data) => {
        const result = await productManager.deleteByID(Number(data));
        socket.emit("products", result);
    });
});