import SellerEntity from '../entities/seller.entity.js';


class SellerService {

    // Crear un nuevo vendedor
    async createSeller(data) {
        try {
            const seller = await SellerEntity.create(data);
            return seller;
        } catch (error) {
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
