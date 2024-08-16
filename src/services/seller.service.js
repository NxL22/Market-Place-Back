import SellerEntity from '../entities/seller.entity.js';
import UserEntity from '../entities/user.entity.js'
import { validateEmail } from '../utils/validators.js';
import bcrypt from 'bcrypt';
import { roles } from '../utils/enum/role-enum.js';
import crypto from 'crypto';
import transporter from '../config/nodemailer.js';
import dotenv from 'dotenv';

dotenv.config();

class SellerService {

    // Crear un nuevo vendedor
    async createSeller(data) {
        try {
            const { name, email, password, storeName, storeDescription } = data;

            // Validar formato de email
            ;
            if (!validateEmail(email)) {
                throw new Error('Invalid email format');
            }


            if (email == process.env.EMAIL_ADMIN) {
                throw new Error('Invalid email format');
            }

            // Validar campos requeridos

            if (!name || !password || !email || !storeName) {
                throw new Error('Name, password, email, and storeName are required');
            }


            // Verificar si el correo ya está en uso
            const existingUser = await UserEntity.findOne({ where: { email } });
            const existingSeller = await SellerEntity.findOne({ where: { email } });


            if (existingUser || existingSeller) {
                throw new Error('Email already in use');
            }
            // Generar un token de verificación
            const verifyToken = crypto.randomBytes(32).toString('hex');

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear vendedor
            const seller = await SellerEntity.create({
                name,
                email,
                password: hashedPassword,
                storeName,
                storeDescription,
                role: roles.SELLER,
                isApproved: false,
                verifyToken
            });


            const sendVerificationEmailToSeller = {
                from: process.env.EMAIL_NODEMAIL || 'lien.dev22@gmail.com',
                to: seller.email,
                subject: '¡Bienvenido a nuestro Marketplace como Vendedor!',
                html: `
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <h1 style="color: #333; text-align: center; font-family: Arial, sans-serif;">¡Bienvenido a nuestro Marketplace!</h1>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Estamos emocionados de tenerte como vendedor en nuestra plataforma. Ahora puedes comenzar a configurar tu tienda y añadir productos para vender.
                        </p>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Aquí tienes los detalles de tu tienda:
                        </p>
                        <ul style="list-style: none; padding: 0; text-align: center;">
                            <li style="font-family: Arial, sans-serif; font-size: 16px; color: #555;"><strong>Nombre de la tienda:</strong> ${seller.storeName}</li>
                            <li style="font-family: Arial, sans-serif; font-size: 16px; color: #555;"><strong>Descripción de la tienda:</strong> ${seller.storeDescription}</li>
                        </ul>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Para completar tu registro y comenzar a vender, verifica tu cuenta haciendo clic en el siguiente enlace:
                        </p>
                        <p style="text-align: center;">
                            <a href="http://localhost:3000/seller/verified-seller?email=${email}&token=${verifyToken}" 
                               style="display: inline-block; padding: 10px 20px; font-family: Arial, sans-serif; 
                               font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; 
                               border-radius: 5px;">
                               Verificar Cuenta
                            </a>
                        </p>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
                        </p>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            ¡Gracias por unirte a nosotros!
                        </p>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Saludos,<br>El equipo de nuestro Marketplace
                        </p>
                    </div>
                `
            };

            await transporter.sendMail(sendVerificationEmailToSeller);

            // Reemplazar la contraseña con un string vacío por seguridad
            seller.password = '';

            console.log('Seller created:', seller); // Log del vendedor creado

            return seller;

        } catch (error) {
            console.error('Error creating seller:', error.message); // Log del error
            throw new Error('Error creating seller: ' + error.message);
        }
    }


    // Obtener todos los vendedores
    async getAllSellers() {
        try {
            const sellers = await SellerEntity.findAll();
            return sellers;
        } catch (error) {
            throw new Error('Error obteniendo sellers: ' + error.message);
        }
    }


    // Obtener un vendedor por ID
    async getSellerById(id) {
        try {
            const seller = await SellerEntity.findByPk(id);
            if (!seller) {
                throw new Error('Seller not found');
            }
            return seller;
        } catch (error) {
            throw new Error('Error obteniendo seller: ' + error.message);
        }
    }


    // Actualizar un vendedor por ID
    async updateSeller(id, data) {
        try {
            const seller = await SellerEntity.findByPk(id);
            if (!seller) {
                throw new Error('Seller not found');
            }
            await seller.update(data);
            return seller;
        } catch (error) {
            throw new Error('Error updating seller: ' + error.message);
        }
    }


    // Eliminar un vendedor por ID
    async deleteSeller(id) {
        try {
            const seller = await SellerEntity.findByPk(id);
            if (!seller) {
                throw new Error('Seller not found');
            }
            await seller.destroy();
            return { message: 'Seller has been successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting seller: ' + error.message);
        }
    }


    // Verificar seller
    async verifiedSeller(data) {
        try {
            const { email, token } = data;
            console.log('Email:', email);
            console.log('Token:', token);
    
            const existingSeller = await SellerEntity.findOne({ where: { email, verifyToken: token } });
            console.log(existingSeller);
    
            if (!existingSeller) {
                throw new Error('Error verified seller: Seller not found');
            }
    
            existingSeller.isVerified = true;
            existingSeller.verifyToken = '';
            await existingSeller.save();
    
            const mailVerifiedOfSeller = {
                from: process.env.EMAIL_NODEMAIL || 'lien.dev22@gmail.com',
                to: existingSeller.email,
                subject: '¡Tu cuenta de vendedor ha sido verificada exitosamente!',
                html: `
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <h1 style="color: #333; text-align: center; font-family: Arial, sans-serif;">¡Bienvenido, ${existingSeller.name}!</h1>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Nos complace informarte que tu cuenta de vendedor ha sido verificada exitosamente.
                        </p>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Ahora puedes empezar a gestionar tu tienda y aprovechar todas las funcionalidades disponibles en nuestro marketplace.
                        </p>
                        <ul style="list-style: none; padding: 0; text-align: center;">
                            <li style="font-family: Arial, sans-serif; font-size: 16px; color: #555;"><strong>Nombre de la tienda:</strong> ${existingSeller.storeName}</li>
                            <li style="font-family: Arial, sans-serif; font-size: 16px; color: #555;"><strong>Descripción de la tienda:</strong> ${existingSeller.storeDescription}</li>
                        </ul>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte.
                        </p>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            ¡Gracias por unirte a nosotros y confiar en nuestra plataforma!
                        </p>
                        <p style="color: #555; text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
                            Saludos,<br>El equipo de nuestro Marketplace
                        </p>
                    </div>
                `
            };
    
            await transporter.sendMail(mailVerifiedOfSeller);
    
            existingSeller.password = '';
            return existingSeller;
        } catch (error) {
            throw new Error('Error al verificar el usuario: ' + error.message);
        }
    }
    
}




export default new SellerService();
