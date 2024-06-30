import AdminEntity from '../entities/admin.entity.js';
import SellerEntity from '../entities/seller.entity.js';
import UserEntity from '../entities/user.entity.js'
import { roles } from '../utils/enum/role-enum.js';
import { validateEmail } from '../utils/validators.js';
import bcrypt from 'bcrypt';


class UserService {

    // Probando y saludando
    async holis() {
        const saludo = "hola esto es un SALUDO"
        return saludo;
    }


    // Crear un nuevo usuario
    async createUser(data) {
        try {
            const { name, password, email } = data;

            // Validar formato de email
            if (!validateEmail(email)) {
                throw new Error('Invalid email format');
            }

            // Validar campos requeridos
            if (!name || !password || !email) {
                throw new Error('Name, password, and email are required');
            }

            // Verificar si el correo ya está en uso
            const existingUser = await UserEntity.findOne({ where: { email } });
            const existingSeller = await SellerEntity.findOne({ where: { email } });
            const existingAdmin = await AdminEntity.findOne({ where: { email } });

            if (existingUser || existingSeller || existingAdmin) {
                throw new Error('Email already in use');
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario
            const user = await UserEntity.create({
                name,
                email,
                password: hashedPassword,
                role: roles.USER
            });

            // Reemplazar la contraseña con un string vacío por seguridad
            user.password = '';

            console.log('User created:', user); // Log del usuario creado

            return user;
        } catch (error) {
            console.error('Error creating user:', error.message); // Log del error
            throw new Error('Error creating user: ' + error.message);
        }
    }



    // Obtener todos los usuarios
    async getAllUsers() {
        try {
            const users = await UserEntity.findAll();
            return users;
        } catch (error) {
            throw new Error('Error obteniendo users: ' + error.message);
        }
    }


    // Obtener usuario por ID
    async getUserById(id) {
        try {
            const user = await UserEntity.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Error obteniendo user: ' + error.message);
        }
    }


    // Actualizar un usuario por ID
    async updateUser(id, data) {
        try {
            const user = await UserEntity.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            await user.update(data);
            return user;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }


    // Eliminar un usuario por ID
    async deleteUser(id) {
        try {
            const user = await UserEntity.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            await user.destroy();
            return { message: 'User has been successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }
}



export default new UserService(); 