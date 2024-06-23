import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { roles } from '../utils/enum/role-enum.js';


const UserEntity = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 255]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM,
        values: Object.values(roles),
        allowNull: false,
        defaultValue: roles.USER
    }
}, 
{
    timestamps: false // Esto deshabilita la creación automática de los campos createdAt y updatedAt
});

export default UserEntity;
