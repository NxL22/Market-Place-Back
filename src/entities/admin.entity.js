import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { roles } from '../utils/enum/role-enum.js';


const AdminEntity = sequelize.define('Admin', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
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
        validate: {
            len: [1, 255]
        }
    },
    role: {
        type: DataTypes.ENUM,
        values: Object.values(roles),
        allowNull: false,
        defaultValue: roles.ADMIN
    }
});

export default AdminEntity;