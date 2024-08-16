import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class CartEntity extends Model {}

CartEntity.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
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
    }
}, {
    sequelize,
    modelName: 'Cart'
});

export default CartEntity;
