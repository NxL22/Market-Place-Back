import sequelize from './src/config/db.js';
import httpServer from './src/config/http.js';
import dotenv from 'dotenv';
import './src/config/firebase.js';
import adminService from './src/services/admin.service.js';
import SellerEntity from './src/entities/seller.entity.js';
import ProductEntity from './src/entities/product.entity.js';
import ImageEntity from './src/entities/image.entity.js';
import CartEntity from './src/entities/cart.entity.js';
import CartItemsEntity from './src/entities/cartItems.entity.js';
import UserEntity from './src/entities/user.entity.js';
import OrderEntity from './src/entities/order.entity.js';

dotenv.config();

async function defineRelationships() {
    try {
        // Relación entre SellerEntity y ProductEntity
        SellerEntity.hasMany(ProductEntity, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
        ProductEntity.belongsTo(SellerEntity, { foreignKey: 'sellerId' });

        // Relación entre ProductEntity e ImageEntity
        ProductEntity.hasOne(ImageEntity, { foreignKey: 'productId', onDelete: 'CASCADE' });
        ImageEntity.belongsTo(ProductEntity, { foreignKey: 'productId' });

        // Relación entre ProductEntity y CartItemsEntity
        ProductEntity.hasOne(CartItemsEntity, { foreignKey: 'productId', onDelete: 'CASCADE' });
        CartItemsEntity.belongsTo(ProductEntity, { foreignKey: 'productId' });

        // Relación entre CartEntity y CartItemsEntity
        CartEntity.hasMany(CartItemsEntity, { foreignKey: 'cartId', onDelete: 'CASCADE' });
        CartItemsEntity.belongsTo(CartEntity, { foreignKey: 'cartId' });

        // Relación entre CartEntity y UserEntity
        UserEntity.hasOne(CartEntity, { foreignKey: 'userId', onDelete: 'CASCADE' });
        CartEntity.belongsTo(UserEntity, { foreignKey: 'userId' });

        // Relación entre UserEntity y OrderEntity
        UserEntity.hasMany(OrderEntity, { foreignKey: 'userId', onDelete: 'CASCADE' });
        OrderEntity.belongsTo(UserEntity, { foreignKey: 'userId' });

        // Relación entre SellerEntity y OrderEntity (muchos a muchos)
        SellerEntity.belongsToMany(OrderEntity, { through: 'SellerOrders', foreignKey: 'sellerId' });
        OrderEntity.belongsToMany(SellerEntity, { through: 'SellerOrders', foreignKey: 'orderId' });

        // Relación entre UserEntity y OrderEntity (muchos a muchos)
        UserEntity.belongsToMany(OrderEntity, { through: 'UserOrders', foreignKey: 'userId' });
        OrderEntity.belongsToMany(UserEntity, { through: 'UserOrders', foreignKey: 'orderId' });

    } catch (relationError) {
        console.error('Error defining relationships:', relationError);
        throw relationError;
    }
}

async function initializeFirebase() {
    try {
        console.log('Firebase admin initialized successfully.');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
}

async function createAdmin() {
    try {
        await adminService.createAdmin({ email: process.env.EMAIL_ADMIN, password: process.env.PASSWORD_ADMIN });
    } catch (error) {
        console.error('Error creating admin:', error);
        throw error;
    }
}

async function startServer() {
    const PORT = process.env.PORT || 3000;
    try {
        // Definir relaciones antes de sincronizar la base de datos
        await defineRelationships();

        // Sincronizar la base de datos
        await sequelize.sync({ alter: true });
        console.log('Database connection established successfully.');

        // Iniciar servidor HTTP
        httpServer.listen(PORT, async () => {
            console.log(`Server listening on port ${PORT}`);

            await initializeFirebase();
            await createAdmin();
        });
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

startServer();
