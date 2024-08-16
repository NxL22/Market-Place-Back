import { Router } from "express";
import sellerService from "../services/seller.service.js";
import { authenticateJWT, authorizeRoles } from '../middlewares/middleware.js';
import { roles } from "../utils/enum/role-enum.js";



const sellerRoutes = Router();

// Crear un nuevo vendedor
sellerRoutes.post('/create-seller', async (req, res) => {
    try {
        const seller = await sellerService.createSeller(req.body);
        res.status(201).json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener todos los vendedores
sellerRoutes.get('/all-sellers', authenticateJWT, authorizeRoles([roles.SELLER, roles.ADMIN]), async (req, res) => {
    try {
        const sellers = await sellerService.getAllSellers();
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener un vendedor por ID
sellerRoutes.get('/seller-id/:id', authenticateJWT, authorizeRoles([roles.SELLER, roles.ADMIN]), async (req, res) => {
    try {
        const seller = await sellerService.getSellerById(req.params.id);
        res.json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Actualizar un vendedor por ID
sellerRoutes.put('/update-seller/:id', authenticateJWT, authorizeRoles([roles.SELLER, roles.ADMIN]), async (req, res) => {
    try {
        const seller = await sellerService.updateSeller(req.params.id, req.body);
        res.json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Eliminar un vendedor por ID
sellerRoutes.delete('/delete-seller/:id', authenticateJWT, authorizeRoles([roles.SELLER, roles.ADMIN]), async (req, res) => {
    try {
        const message = await sellerService.deleteSeller(req.params.id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


sellerRoutes.get('/verified-seller', async (req, res) => {
    try {
        const { token, email } = req.query
        const result = await sellerService.verifiedSeller({token, email});
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default sellerRoutes;
