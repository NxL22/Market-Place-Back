import { Router } from 'express';
import authService from '../services/auth.service.js';


const authRoutes = Router();


authRoutes.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validar que el rol sea uno de los permitidos
        if (![role.USER, role.SELLER, role.ADMIN].includes(role)) {
            return res.status(400).send('Invalid role');
        }

        // Iniciar sesión
        const result = await authService.login({ email, password, role });

        // Agregar logs para depuración
        console.log('Login Result:', result);

        res.send(result);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).send('Invalid email, password, or role');
    }
});


export default authRoutes;
