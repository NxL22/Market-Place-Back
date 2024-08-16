import CartEntity from "../entities/cart.entity.js";
import CartItemsEntity from "../entities/cartItems.entity.js";
import ProductEntity from "../entities/product.entity.js";


class CartService {

    async createCart(userId) {
        const cartExisting = await CartEntity.findOne({ where: { userId } });
        if (cartExisting) {
            return cartExisting;
        }
        const cart = await CartEntity.create({ userId, totalAmount: 0 });
        return cart;
    }


    async getCart(userId) {
        const cartExisting = await CartEntity.findOne({
            where: { userId },
            include: CartItemsEntity
        });
        if (cartExisting) {
            return cartExisting;
        }
        const cart = await CartEntity.create({ userId, totalAmount: 0 });
        return cart;
    }


    async addCartItem(userId, data) {
        const { productId, quantity } = data;

        try {
            const cart = await CartEntity.findOne({
                where: { userId },
                include: [{
                    model: CartItemsEntity,
                    include: [ProductEntity]
                }]
            });


            const product = await ProductEntity.findOne({
                where: { id: productId }
            })

            if (!product) {
                throw new Error('Product not fount')
            }
            if (product.quantity < quantity) {
                throw new Error('Capacity not fount')
            }


            const findProduct = cart.CartItems.find(i => i.productId === productId);

            if (!findProduct) {
                try {
                    const createCartItems = await CartItemsEntity.create({
                        productId: product.id,
                        cartId: cart.id,
                        quantity,
                        amount: product.price * quantity
                    }); 
                    return createCartItems
                } catch (error) {
                    console.error('Error al crear el ítem en el carrito:', error);
                    throw error;               }
            } else {
                try {
                    findProduct.quantity = quantity;
                    findProduct.amount = product.price * quantity; 
                    findProduct.save()
                    return findProduct;
                } catch (error) {
                    console.error('Error al manejar el producto existente en el carrito:', error);
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            throw error;
        }
    }


    async emptyCart(userId) {
        try {
            const cart = await CartEntity.findOne({ where: { userId } });
            if (!cart) {
                throw new Error('Cart not found');
            }

            await CartItemsEntity.destroy({ where: { cartId: cart.id } });

            cart.totalAmount = 0;

            cart.save();

            return { message: 'Cart has been emptied successfully' };

        } catch (error) {
            console.error('Error emptying cart:', error);
            throw error;
        }
    }


    async emptyCartItem(userId, data) {
        try {
            console.log('Step 1: Inicio del método');
            const { productId } = data;
            console.log('Step 2: productId extraído', productId);

            const cart = await CartEntity.findOne({ where: { userId } });
            console.log('Step 3: CartEntity encontrado', cart);

            if (!cart) {
                console.log('Step 3.1: No se encontró ningún carrito para el userId', userId);
                return null;
            }

            const cartItems = await CartItemsEntity.destroy({ where: { cartId: cart.id, productId } });
            console.log('Step 4: CartItemsEntity encontrado', cartItems);

            if (!cartItems) {
                console.log('Step 4.1: No se encontró ningún item en el carrito para cartId y productId', cart.id, productId);
                return null;
            }

            return { message: 'Item has been delete' };

        } catch (error) {
            console.error('Error emptying cartItems:', error);
            throw error;
        }
    }



}


export default new CartService();


/* 
const transaction = await Sequelize.transaction(); <-- ME PARECIO LOGICO ESTO PERO
NO LO USE. 
 */