import { Router } from "express";
import productService from "../services/product.service.js";
import { authenticateJWT, authorizeRoles } from '../middlewares/middleware.js';

const productRoutes = Router();

// Crear un nuevo producto
productRoutes.post('/create-product', authenticateJWT, authorizeRoles(['SELLER', 'ADMIN']), async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener todos los productos
productRoutes.get('/all-products', authenticateJWT, authorizeRoles(['USER', 'SELLER', 'ADMIN']), async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener un producto por ID
productRoutes.get('/product-id/:id', authenticateJWT, authorizeRoles(['USER', 'SELLER', 'ADMIN']), async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Actualizar un producto por ID
productRoutes.put('/update-product/:id', authenticateJWT, authorizeRoles(['SELLER', 'ADMIN']), async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Eliminar un producto por ID
productRoutes.delete('/delete-product/:id', authenticateJWT, authorizeRoles(['SELLER', 'ADMIN']), async (req, res) => {
    try {
        const message = await productService.deleteProduct(req.params.id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default productRoutes;
