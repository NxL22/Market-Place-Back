import { Router } from 'express';
import authService from '../services/auth.service.js';
import { roles } from '../utils/enum/role-enum.js';
import { authenticateJWT } from '../middlewares/middleware.js';


const authRoutes = Router();


authRoutes.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // Validar que el rol sea uno de los permitidos
        if (![roles.USER, roles.SELLER, roles.ADMIN].includes(role)) {
            return res.status(400).send('Invalid role');
        }

        // Iniciar sesión
        const result = await authService.login({ email, password, role });
        res.send(result);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).send('Invalid email, password, or role');
    }
});

authRoutes.get('/profile', authenticateJWT,   async(req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Error fetching profile');
    }
})

export default authRoutes;
