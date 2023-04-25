import { Router } from "express";
import CartManager from "../manager/cartManager.js";

const router = Router();

const cartManager = new CartManager('./src/files/carts.json');

router.post('/', async (req, res) => {
    const cart = { products: [] };
    const result = await cartManager.addCart(cart);
    res.send({ status: 'success', result });
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = Number(req.params.cid);
        const cart = await cartManager.getByIdCart(cartId);
        const cartProduct = cart.products;
        if(!cartProduct) {
            res.status(404).send({error: 'No items found'});
            return;
        };
        res.send({ status: 'succes', cartProduct });

    } catch (error) {
        console.error(error);
    };
});

router.post('/:cid/product/:pid', async (req, res) => {
    const idcart = Number(req.params.cid);
    const idProduct = Number(req.params.pid);
    const result = await cartManager.addProductToCart(idcart, idProduct);
    res.send({result});
})

export default router;