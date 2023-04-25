import { Router } from "express";
import ProductManager from "../manager/productManager.js";

const router = Router();
const productManager = new ProductManager('./src/files/products.json');

router.get('/', async (req, res) => {
    const products = await productManager.getAll();
    res.render('home', {products});
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
});

export default router;