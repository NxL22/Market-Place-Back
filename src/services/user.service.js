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


    // Crear usuario
    async createUser(data) {
        try {
            const { name, password, email } = data;

            // Validate email
            if (!validateEmail(email)) {
                throw new Error('Invalid email format');
            }

            // Validate required fields
            if (!name || !password || !email) {
                throw new Error('Name, password, and email are required');
            }

            // Check if user already exists
            const existingUser = await UserEntity.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await UserEntity.create({ ...data, password: hashedPassword, role: roles.USER });
            console.log('User created:', user);

            return user;
        } catch (error) {
            console.error('Error creating user:', error.message);
            throw new Error(error.message);
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