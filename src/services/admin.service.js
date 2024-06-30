import AdminEntity from '../entities/admin.entity.js';
import SellerEntity from '../entities/seller.entity.js';
import UserEntity from '../entities/user.entity.js'
import bcrypt from 'bcrypt';


class AdminService {

    // Crear un nuevo administrador
    async createAdmin(data) {
        try {
            // Verificar si ya existe un administrador
            const adminExists = await AdminEntity.findOne();
            if (adminExists) {
                console.log('Admin already exists');
                return adminExists;
            }

            // Verificar si el correo ya está en uso
            const existingUser = await UserEntity.findOne({ where: { email: data.email } });
            const existingSeller = await SellerEntity.findOne({ where: { email: data.email } });
            const existingAdmin = await AdminEntity.findOne({ where: { email: data.email } });

            if (existingUser || existingSeller || existingAdmin) {
                console.log('Email already exists');
                throw new Error('Email already in use');
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // Crear administrador
            const adminCreate = await AdminEntity.create({ email: data.email, password: hashedPassword });
            console.log('Admin created:', adminCreate); // Logging created admin

            return adminCreate;
        } catch (error) {
            console.error('Error creating admin:', error.message); // Log del error
            throw new Error('Error creating admin: ' + error.message);
        }
    }


    // Obtener todos los administradores
    async getAllAdmins() {
        try {
            const admins = await AdminEntity.findAll();
            return admins;
        } catch (error) {
            throw new Error('Error obteniendo admins: ' + error.message);
        }
    }


    // Obtener un administrador por ID
    async getAdminById(id) {
        try {
            const admin = await AdminEntity.findByPk(id);
            if (!admin) {
                throw new Error('Admin not found');
            }
            return admin;
        } catch (error) {
            throw new Error('Error obteniendo admin: ' + error.message);
        }
    }


    // Actualizar un administrador por ID
    async updateAdmin(id, data) {
        try {
            const admin = await AdminEntity.findByPk(id);
            if (!admin) {
                throw new Error('Admin not found');
            }
            await admin.update(data);
            return admin;
        } catch (error) {
            throw new Error('Error updating admin: ' + error.message);
        }
    }


    // Eliminar un administrador por ID
    async deleteAdmin(id) {
        try {
            const admin = await AdminEntity.findByPk(id);
            if (!admin) {
                throw new Error('Admin not found');
            }
            await admin.destroy();
            return { message: 'Admin has been successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting admin: ' + error.message);
        }
    }

}

export default new AdminService();
