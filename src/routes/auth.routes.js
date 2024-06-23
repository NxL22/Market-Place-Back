import { Router } from 'express';
import authService from '../services/auth.service.js';

const authRoutes = Router();

authRoutes.post('/login', async (req, res) => {
    try {
        const { email, password, isAdmin } = req.body;
        
        // Agregar logs para depuración
        console.log('Request Body:', req.body);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('isAdmin:', isAdmin);
        
        const result = await authService.login(email, password, isAdmin);
        
        // Agregar logs para depuración
        console.log('Login Result:', result);
        
        res.send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(401).send('Invalid email or password');
    }
});

export default authRoutes;
