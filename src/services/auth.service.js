import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import AdminEntity from '../entities/admin.entity.js';
import UserEntity from '../entities/user.entity.js';
import EncriptionFunc from '../utils/jwt.encription.js'

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY; 

class AuthService {

    async login(email, password, isAdmin) {
        let user;
        if (isAdmin) {
            user = await AdminEntity.findOne({ where: { email } });
            console.log('Admin encontrado:', user); // Añadir log para ver si el admin se encuentra
            if (!user || !await bcrypt.compare(password, user.password)) {
                throw new Error('Invalid email or password');
            }
        } else {
            user = await UserEntity.findOne({ where: { email } });
            console.log('Usuario encontrado:', user); // Añadir log para ver si el usuario se encuentra
            if (!user || !await bcrypt.compare(password, user.password)) {
                throw new Error('Invalid email or password');
            }
        }

        const role = isAdmin ? 'admin' : 'user';
        const token = EncriptionFunc.generateToken({ id: user.id, email: user.email, role });
        
        console.log('Generated Token:', token); // Añadir log para ver el token generado
        
        return { token, user };
    }

}


export default new AuthService();
