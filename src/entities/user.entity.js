import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { roles } from '../utils/enum/role-enum.js';

class UserEntity extends Model {}

UserEntity.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    verifyToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    role: {
        type: DataTypes.ENUM,
        values: Object.values(roles),
        allowNull: false,
        defaultValue: roles.USER
    }
}, 
{
    sequelize,
    modelName: 'User',
    timestamps: false // Esto deshabilita la creación automática de los campos createdAt y updatedAt
});

export default UserEntity;
