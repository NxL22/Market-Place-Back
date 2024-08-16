import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';



const OrderEntity = sequelize.define('Order', {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    },
}, {
    timestamps: true
});

export default OrderEntity;
