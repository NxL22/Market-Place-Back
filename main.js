import sequelize from './src/config/db.js';
import httpServer from './src/config/http.js';
import dotenv from 'dotenv';
import './src/config/firebase.js'; 
import adminService from './src/services/admin.service.js';
import SellerEntity from './src/entities/seller.entity.js';
import ProductEntity from './src/entities/product.entity.js';

dotenv.config();

async function defineRelationships() {
    try {
        // Tiene que ser las relaciones antes que hagas el llamado a la BD sequelize.sync()
        SellerEntity.hasMany(ProductEntity, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
        ProductEntity.belongsTo(SellerEntity, { foreignKey: 'sellerId' });
        console.log('Relationships defined successfully.');
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
        // hacer el llamado a las relaciones antes de sincronizar la base de datos
        await defineRelationships();
        await sequelize.sync({ alter: true });
        console.log('Database connection established successfully.');

        // Start HTTP server
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
