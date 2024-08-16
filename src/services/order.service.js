import CartEntity from "../entities/cart.entity.js";
import CartItemsEntity from "../entities/cartItems.entity.js";
import OrderEntity from "../entities/order.entity.js";
import OrderItemsEntity from "../entities/orderItems.entity.js";
import ProductEntity from "../entities/product.entity.js";
import { OrderStatus } from "../utils/enum/status-enum.js";



class OrderService {

    async holis() {
        const saludo = "hola esto es un SALUDO";
        return saludo;
    }
    async createOrder(userId) {
        try {

            const cart = await CartEntity.findOne({
                where: { userId },
                include: [{
                    model: CartItemsEntity,
                    include: [ProductEntity]
                }]
            });
    
            if (!cart) {
                throw new Error('Cart not found');
            }

            const uniqueSellerIds = [...new Set(cart.CartItems.map(cartItem => cartItem.Product.sellerId))];

            const totalAmount = cart.CartItems.reduce((sum, item) => sum + item.Product.price * item.quantity, 0);

            const order = await OrderEntity.create({
                userId,
                totalAmount,
                status: 'Pending' 
            });
    

            await order.setSellers(uniqueSellerIds);
    

            const orderItems = await Promise.all(cart.CartItems.map(item => 
                OrderItemsEntity.create({
                    orderId: order.id,
                    productId: item.productId,
                    price: item.Product.price,
                    quantity: item.quantity
                })
            ));
    
            order.dataValues.OrderItems = orderItems;
            
            return order;
    
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
}    


export default new OrderService();


