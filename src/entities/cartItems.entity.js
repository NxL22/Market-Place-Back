import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class CartItemsEntity extends Model {}

CartItemsEntity.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    productId: { 
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Carts',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'CartItems'
});

export default CartItemsEntity;
