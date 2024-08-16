import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const OrderItemsEntity = sequelize.define('OrderItems', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Orders', 
            key: 'id'
        }
    },
    productId: { 
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Products', 
            key: 'id'
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
}, {
    sequelize,
    modelName: 'OrderItems'
});

export default OrderItemsEntity;

