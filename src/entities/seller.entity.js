import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { roles } from '../utils/enum/role-enum.js';


const SellerEntity = sequelize.define('Seller', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 255],
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    storeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    storeDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 255]
        }
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    role: {
        type: DataTypes.ENUM,
        values: Object.values(roles),
        allowNull: false,
        defaultValue: roles.SELLER
    }
 
}, {
    timestamps: true
});

export default SellerEntity;
