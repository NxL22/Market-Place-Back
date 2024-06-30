import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import AdminEntity from '../entities/admin.entity.js';
import UserEntity from '../entities/user.entity.js';
import EncriptionFunc from '../utils/jwt.encription.js'
import { roles } from '../utils/enum/role-enum.js';


dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

class AuthService {

    async login(data) {
        const { email, password, role } = data;

        if (!email || !password || !role) {
            throw new Error('Email, password, and role are required');
        }

        try {
            let user;

            if (email === process.env.EMAIL_ADMIN) {
                user = await AdminEntity.findOne({ where: { email } });
                console.log('Admin found:', user);
                if (!user || !await bcrypt.compare(password, user.password)) {
                    throw new Error('Invalid email or password');
                }
            } else {
                if (![roles.SELLER, roles.USER].includes(role)) {
                    throw new Error('Invalid role');
                }

                if (role === roles.SELLER) {
                    user = await AdminEntity.findOne({ where: { email } });
                    console.log('Seller found:', user);
                    if (!user || !await bcrypt.compare(password, user.password)) {
                        throw new Error('Invalid email or password');
                    }
                } else {
                    user = await UserEntity.findOne({ where: { email } });
                    console.log('User found:', user);
                    if (!user || !await bcrypt.compare(password, user.password)) {
                        throw new Error('Invalid email or password');
                    }
                }
            }

            const token = EncriptionFunc.generateToken({ id: user.id, email: user.email, role });
            console.log('Generated Token:', token);

            // Clonamos y a ese objeto le asignamos password = ""
            const userSafe = { ...user.toJSON(), password: '' };

            return { token, user: userSafe };

        } catch (error) {
            console.error('Error during login:', error.message);
            throw new Error('Login failed. Please try again later.');
        }
    }

}




export default new AuthService();
