import ProductEntity from '../entities/product.entity.js';


class ProductService {

    // Crear un nuevo producto
    async createProduct(data) {
        try {
            const { sellerId, name, price, quantity, description } = data;

            // Validar campos requeridos
            if (!sellerId || !name || !price || !quantity || !description) {
                throw new Error('Seller ID, name, price, quantity, and description are required');
            }

            // Verificar si el vendedor existe
            const seller = await SellerEntity.findByPk(sellerId);
            if (!seller) {
                throw new Error('Seller not found');
            }

            // Crear producto
            const product = await ProductEntity.create(data);

            console.log('Product created:', product); // Log del producto creado

            return product;
        } catch (error) {
            console.error('Error creating product:', error.message); // Log del error
            throw new Error('Error creating product: ' + error.message);
        }
    }

    // Obtener todos los productos
    async getAllProducts() {
        try {
            const products = await ProductEntity.findAll();
            return products;
        } catch (error) {
            throw new Error('Error obteniendo products: ' + error.message);
        }
    }


    // Obtener un producto por ID
    async getProductById(id) {
        try {
            const product = await ProductEntity.findByPk(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error obteniendo product: ' + error.message);
        }
    }

    async updateProduct(id, data) {
        try {
            const product = await ProductEntity.findByPk(id);
            if (!product) {
                throw new Error('Product not found');
            }
            await product.update(data);
            return product;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await ProductEntity.findByPk(id);
            if (!product) {
                throw new Error('Product not found');
            }
            await product.destroy();
            return { message: 'Product has been successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }

}

export default new ProductService();
