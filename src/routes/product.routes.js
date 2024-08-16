import { Router } from "express";
import productService from "../services/product.service.js";
import { authenticateJWT, authorizeRoles } from '../middlewares/middleware.js';
import { roles } from "../utils/enum/role-enum.js";
import multer from 'multer';

const productRoutes = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crear un nuevo producto
productRoutes.post('/create-product', upload.single('image'), authenticateJWT, authorizeRoles([roles.SELLER]), async (req, res) => {
    try {
        // req.file me lo da "" el multer(su middleware)
        const product = await productService.createProduct(req.body, req.user.id, req.file);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener todos los productos
productRoutes.get('/all-products', async (_req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener un producto por ID
productRoutes.get('/product-id/:id', authenticateJWT, authorizeRoles([roles.SELLER, roles.ADMIN]), async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Actualizar un producto por ID *ESTA*
productRoutes.put('/update-product/:id', authenticateJWT, authorizeRoles([roles.SELLER]), async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body, req.user.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Eliminar un producto por ID
productRoutes.delete('/delete-product/:id', authenticateJWT, authorizeRoles([roles.SELLER, roles.ADMIN]), async (req, res) => {
    try {
        const message = await productService.deleteProduct(req.params.id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar la imagen de un producto
productRoutes.put('/update-product/:productId/image', authenticateJWT, authorizeRoles([roles.SELLER, roles.ADMIN]), async (req, res) => {
    try {
        const result = await productService.updateProductImage(req.params.productId, req.body.newImageUrl);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default productRoutes;
