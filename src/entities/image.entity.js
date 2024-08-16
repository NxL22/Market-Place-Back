import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Definición del modelo ImageEntity
const ImageEntity = sequelize.define('Image', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productId: { 
        type: DataTypes.UUID, // Cambiado a UUID para coincidir con ProductEntity
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        }
    }
}, {
    timestamps: true,
});

export default ImageEntity;
