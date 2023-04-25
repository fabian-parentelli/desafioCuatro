import { Router } from "express";
import ProductManager from '../manager/productManager.js';

const router = Router();

const manager = new ProductManager('./src/files/products.json');

router.get('/', async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        const products = await manager.getAll();

        if (!products) {
            return res.status(404).send({ error: 'Products no found' });
        };

        if (!limit) {
            res.send({ status: 'success', products });
        } else {
            const limitProduct = products.slice(0, limit);
            res.send({ status: 'success', limitProduct });
        };

    } catch (error) {
        console.error(error);
    };
});

router.get('/:pid', async (req, res) => {
    try {
        const idProduct = Number(req.params.pid);
        const product = await manager.getById(idProduct);

        if (!product) {
            return res.status(400).send({ error: 'Product not found' });
        } else {
            res.send({ status: 'success', product });
        };

    } catch (error) {
        console.error(error);
    };
});

router.post('/', async (req, res) => {
    try {
        const product = req.body;

        if (!product) { product.status = true };

        const { title, description, code, price, stock, category } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(404).send({ error: 'All fields are reuired' });
        };

        const products = await manager.getAll();
        const wantedCode = products.find(prod => prod.code === code);
        if (wantedCode) { return res.status(400).send({ error: 'The code is repeted' }) };

        const result = await manager.addProducts(product);
        res.send({ status: 'succes', result });
    } catch (error) {
        console.error(error);
    };
});

router.put('/:pid', async (req, res) => {
    try {
        const idProduct = Number(req.params.pid);
        const objProduct = req.body;

        if(objProduct.id) {objProduct.id = idProduct};

        const result = await manager.updateProduct(idProduct, objProduct);
        if(!result) { 
            res.status(400).send({error: 'Product not found'}); 
            return; 
        };
        res.send({status: 'success', result});
        
    } catch (error) {
        console.error(error);
    };
});

router.delete('/:pid', async (req,res) => {
    try {
        const idProduct = Number(req.params.pid);
        await manager.deleteByID(idProduct);
        res.send({status: 'Remove product'});
        
    } catch (error) {
        console.error(error);
    };
});

export default router;