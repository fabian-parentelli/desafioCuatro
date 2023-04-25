import fs from 'fs';
import ProductManager from './productManager.js';

const productManager = new ProductManager('./src/files/products.json');

export default class CartManager {

    constructor(path) { this.path = path };

    addCart = async (cart) => {
        try {
            const carts = await this.getAllCart();

            if (carts.length === 0) {
                cart.id = 1;
            } else {
                cart.id = carts[carts.length - 1].id + 1;
            };

            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return cart;

        } catch (error) {
            console.error(error);
        };
    };

    getAllCart = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const carts = JSON.parse(data);
                return carts;
            } else {
                return [];
            };

        } catch (error) {
            console.error(error);
        };
    };

    getByIdCart = async (id) => {
        try {
            const carts = await this.getAllCart();
            const cart = carts.find(car => car.id === id);
            if (cart) {
                return cart;
            } else {
                return {error: 'This products not found'}
            };

        } catch (error) {
            console.error(error);
        };
    };

    updateCart = async (id, obj) => {

        try {
            const carts = await this.getAllCart();
            const wantedCart = await this.getByIdCart(id);

            const cart = { ...wantedCart, ...obj };

            const indexCart = carts.findIndex(car => car.id === id);
            carts.splice(indexCart, 1);

            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return cart;

        } catch (error) {
            console.error(error);
        };
    };

    addProductToCart = async (cid, pid) => {
        try {
            const carts = await this.getAllCart();
            const cart = carts.find(car => car.id === cid);

            const productID = await productManager.getById(pid);
            if (productID) {
                const idOnly = productID.id
                const product = { products: idOnly, quantity: 1 };

                const cartIn = Object.values(cart.products)
                const productosOnly = cartIn.find(prod => prod.products === idOnly)

                if (productosOnly) {
                    productosOnly.quantity++
                } else {
                    cart.products.push(product);
                };

                const update = await this.updateCart(cid, cart);
                return { status: 'success', update };
            } else {
                return { error: 'Not Fouund' };
            }

        } catch (error) {
            console.error(error);
        };
    };
};