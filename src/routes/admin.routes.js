import { Router } from "express";
import adminService from "../services/admin.service.js";
import { authenticateJWT, authorizeRoles } from '../middlewares/middleware.js';

const adminRoutes = Router();

// Crear un nuevo administrador
adminRoutes.post('/create-admin', authenticateJWT, authorizeRoles(['ADMIN']), authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const admin = await adminService.createAdmin(req.body);
        res.status(201).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener todos los administradores
adminRoutes.get('/all-admins', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const admins = await adminService.getAllAdmins();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener un administrador por ID
adminRoutes.get('/admin-id/:id', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const admin = await adminService.getAdminById(req.params.id);
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Actualizar un administrador por ID
adminRoutes.put('/update-admin/:id', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const admin = await adminService.updateAdmin(req.params.id, req.body);
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Eliminar un administrador por ID
adminRoutes.delete('/delete-admin/:id', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const message = await adminService.deleteAdmin(req.params.id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default adminRoutes;
