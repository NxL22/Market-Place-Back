import AdminEntity from '../entities/admin.entity.js';
import SellerEntity from '../entities/seller.entity.js';
import UserEntity from '../entities/user.entity.js'


class SellerService {

    // Crear un nuevo vendedor
    async createSeller(data) {
        try {
            const { name, password, email, storeName, storeDescription } = data;

            // Validar formato de email
            if (!validateEmail(email)) {
                throw new Error('Invalid email format');
            }

            // Validar campos requeridos
            if (!name || !password || !email || !storeName) {
                throw new Error('Name, password, email, and storeName are required');
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

            // Crear vendedor
            const seller = await SellerEntity.create({
                name,
                email,
                password: hashedPassword,
                storeName,
                storeDescription,
                role: roles.SELLER,
                isApproved: false // Puedes ajustar esto según tu lógica de negocio
            });

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
}


export default new SellerService();
