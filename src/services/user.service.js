import { error } from 'console';
import transporter from '../config/nodemailer.js';
import SellerEntity from '../entities/seller.entity.js';
import UserEntity from '../entities/user.entity.js';
import { roles } from '../utils/enum/role-enum.js';
import { validateEmail } from '../utils/validators.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

class UserService {

    // Probando y saludando
    async holis() {
        const saludo = "hola esto es un SALUDO";
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

            if (email === process.env.EMAIL_ADMIN) {
                throw new Error('Invalid email format');
            }

            // Validar campos requeridos
            if (!name || !password || !email) {
                throw new Error('Name, password, and email are required');
            }

            // Verificar si el correo ya está en uso
            const existingUser = await UserEntity.findOne({ where: { email } });
            const existingSeller = await SellerEntity.findOne({ where: { email } });

            if (existingUser || existingSeller) {
                throw new Error('Email already in use');
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generar un token de verificación
            const verifyToken = crypto.randomBytes(16).toString('hex');

            // Crear usuario
            const user = await UserEntity.create({
                name,
                email,
                password: hashedPassword,
                role: roles.USER,
                verifyToken,
                isVerified: false
            });

            const sendVerificationEmail = {
                from: process.env.EMAIL_NODEMAIL || 'lien.dev22@gmail.com',
                to: user.email,
                subject: '¡Tu enlace de verificación ha llegado!',
                html: `
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <h1 style="color: #333; text-align: center; font-family: Arial, sans-serif;">¡Bienvenido!</h1>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            ¡Dale clic a lo loco a este enlace para verificar tu cuenta!
                        </p>
                        <p style="text-align: center;">
                            <a href="http:localhost:3000/user/verified?email=${email}&token=${verifyToken}" 
                               style="display: inline-block; padding: 10px 20px; font-family: Arial, sans-serif; 
                               font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; 
                               border-radius: 5px;">
                               Verificar Cuenta
                            </a>
                        </p>
                    </div>
                `
            };

            await transporter.sendMail(sendVerificationEmail);

            // Reemplazar la contraseña con un string vacío por seguridad
            user.password = '';

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


    // Verificar usuario
    async verified(data) {
        const { email, token } = data;
        console.log('Email:', email);
        console.log('Token:', token);
        const existingUser = await UserEntity.findOne({ where: { email, verifyToken: token } });
        console.log(existingUser);
        if (!existingUser) {
            throw new Error('Error verified user: ' + error.message);
        }
        existingUser.isVerified = true;
        existingUser.verifyToken = '';
        await existingUser.save()


        // Construir y enviar el correo de confirmación
        const mailVerified = {
            from: process.env.EMAIL_NODEMAIL || 'lien.dev22@gmail.com',
            to: existingUser.email,
            subject: 'Registro exitoso en el sitio web',
            html: `
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <h1>¡Bienvenido, ${existingUser.name}!</h1>
            <p>Tu cuenta ha sido verificada exitosamente.</p>
            <p>Gracias por registrarte en nuestro sitio web. Ahora puedes acceder a todas las funcionalidades disponibles.</p>
            <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
            <p>Saludos,</p>
            <p>El equipo de nuestro sitio web y de tu corazon<3</p>
            </div>
        `
        };

        await transporter.sendMail(mailVerified);

        existingUser.password = "";
        return existingUser;

    } catch(error) {
        throw new Error('Error al verificar el usuario: ' + error.message);
    }


    async createCartForUser(userId) {

    }

}





export default new UserService();
