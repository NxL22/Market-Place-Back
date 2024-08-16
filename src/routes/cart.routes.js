import { Router } from 'express';
import cartService from '../services/cart.service.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/middleware.js';
import { roles } from '../utils/enum/role-enum.js';


const cartRoutes = Router();

// cartRoutes.post('/cart', async (req, res) => { 
//     try {
//         // Extraer el userId del cuerpo de la solicitud
//         const { id: userId } = req.body;

//         // Validar que el userId esté presente
//         if (!userId) {
//             return res.status(400).json({ message: 'User ID is required' });
//         }

//         // Verificar que el usuario exista
//         const user = await userService.getUserById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Crear un nuevo carrito para el usuario
//         const cart = await cartService.createCartForUser(userId);

//         // Enviar la respuesta con éxito y el carrito creado
//         return res.status(201).json({ message: 'Cart created successfully', cart });
//     } catch (error) {
//         // Manejar errores y enviar una respuesta de error genérica
//         console.error('Error creating cart:', error);
//         return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });


cartRoutes.post('/', authenticateJWT, authorizeRoles([roles.USER]), async (req, res) => {
    try {
        const cart = await cartService.createCart(req.user.id);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).send('Error al crear el carrito');
    }
});

cartRoutes.get('/', authenticateJWT, authorizeRoles([roles.USER]), async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).send('Error al crear el carrito');
    }
});


cartRoutes.post('/add-cartItems', authenticateJWT, authorizeRoles([roles.USER]), async (req, res) => {
    try {
        const cartItem = await cartService.addCartItem(req.user.id, req.body);
        return res.status(201).json(cartItem);
    } catch (error) {
        console.error('Error adding cart item:', error);
        if (error.message === 'Insufficient stock') {
            return res.status(400).json({ message: 'No hay suficiente stock para añadir este producto al carrito' });
        }
        return res.status(500).json({ message: 'Error al añadir el producto al carrito', error: error.message });
    }
});


cartRoutes.delete('/empty-cart', authenticateJWT, authorizeRoles([roles.USER]), async (req, res) => {
    try {
        const result = await cartService.emptyCart(req.user.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error emptying cart:', error);
        return res.status(500).json({ message: 'Error al vaciar el carrito', error: error.message });
    }
});


cartRoutes.delete('/empty-cartItems', authenticateJWT, authorizeRoles([roles.USER]), async (req, res) => {
    try {
        const result = await cartService.emptyCartItem(req.user.id, req.body)
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error emptying cartItems:', error);
        return res.status(500).json({ message: 'Error al vaciar el item', error: error.message });
    }
});


export default cartRoutes;