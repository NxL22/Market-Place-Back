import { Router } from "express";
import orderService from "../services/order.service.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/middleware.js";
import { roles } from "../utils/enum/role-enum.js";


const orderRoutes = Router();


orderRoutes.get('/holis-order', async (_req, res) => {
    try {
        const saludo = await orderService.holis();
        res.send(saludo);
    } catch (error) {
        res.status(500).send('Error al procesar la solicitud');
    }
});


orderRoutes.post('/', authenticateJWT, authorizeRoles([roles.USER]), async (req, res) => {
    try {
        const result = await orderService.createOrder(req.user.id)
        res.status(201).json(result) // Porque estamos trabajando con Where
    } catch (error) {
        res.status(500).send('Error al procesar la solicitud');
    }
});



export default orderRoutes;