import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';



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
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otpExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    isRegistered: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 255] // Asegura que la profesión no sea demasiado larga
        }
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true // Asegura que el avatar sea una URL válida
        }
    }
}, 
{
    timestamps: false // Esto deshabilita la creación automática de los campos createdAt y updatedAt
});

export default UserEntity;