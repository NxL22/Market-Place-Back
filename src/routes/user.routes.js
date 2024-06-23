import { Router } from "express";
import userService from "../services/user.service.js";


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
        res.status(500).json({ message: error.message });
    }
});


// Obtener todos los usuarios
userRoutes.get('/all-users', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener un usuario por ID
userRoutes.get('/user-id/:id', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Actualizar un usuario por ID
userRoutes.put('/update-user/:id', async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Eliminar un usuario por ID
userRoutes.delete('/delete-user/:id', async (req, res) => {
    try {
        const message = await userService.deleteUser(req.params.id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





export default userRoutes;