import AdminEntity from '../entities/admin.entity.js';
import bcrypt from 'bcrypt';


class AdminService {

    // Crear un nuevo administrador
    async createAdmin(data) {
        try {
            const adminExists = await AdminEntity.findOne();
            if (adminExists) {
                console.log('Admin already exists');
                return adminExists;
            }
            const admin = await AdminEntity.findOne({ where: { email: data.email } });
            if (admin) {
                console.log('Email already exists');
                return admin;
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const adminCreate = await AdminEntity.create({ email: data.email, password: hashedPassword });
            console.log('Admin created:', adminCreate); // Logging created admin
            return adminCreate;
        } catch (error) {
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
