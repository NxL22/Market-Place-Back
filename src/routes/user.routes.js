import { Router } from "express";
import userService from "../services/user.service.js";
import { authenticateJWT, authorizeRoles } from '../middlewares/middleware.js';

const userRoutes = Router();

// Holis (probar)
userRoutes.get('/holis', async (_req, res) => {
    try {
        const saludo = await userService.holis();
        res.send(saludo);
    } catch (error) {
        res.status(500).send('Error al procesar la solicitud');
    }
});


// Crear un nuevo usuario
userRoutes.post('/create-user', async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error.message === 'Invalid email format' || error.message === 'Name, password, and email are required') {
            res.status(400).json({ message: error.message });
        } else if (error.message === 'User already exists') {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});


// Obtener todos los usuarios
userRoutes.get('/all-users', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener un usuario por ID
userRoutes.get('/user-id/:id', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Actualizar un usuario por ID
userRoutes.put('/update-user/:id', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Eliminar un usuario por ID
userRoutes.delete('/delete-user/:id', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const message = await userService.deleteUser(req.params.id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





export default userRoutes;