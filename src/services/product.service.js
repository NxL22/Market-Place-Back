import ImageEntity from '../entities/image.entity.js';
import ProductEntity from '../entities/product.entity.js';
import SellerEntity from '../entities/seller.entity.js';
import imagesService from './images.service.js';


class ProductService {

    // Crear un nuevo producto
    async createProduct(data, sellerId, file) {
        try {
            const { name, price, quantity, description } = data;

            // Validar campos requeridos
            if (!name || !price || !quantity || !description) {
                throw new Error('Name, price, quantity, and description are required');
            }

            const product = await ProductEntity.create({
                name,
                price,
                quantity,
                description,
                sellerId,
            });

            await imagesService.upload(file, product.id)

            return product;
        } catch (error) {
            console.error('Error creating product:', error.message); // Log del error
            throw new Error('Error creating product: ' + error.message);
        }
    }


    // Obtener todos los productos
    async getAllProducts() {
        try {
            const products = await ProductEntity.findAll({
                include: [ImageEntity], // Incluir imágenes asociadas
            });
            return products;
        } catch (error) {
            throw new Error('Error obteniendo productos: ' + error.message);
        }
    }


    // Obtener un producto por ID
    async getProductById(id) {
        try {
            const product = await ProductEntity.findByPk(id, {
                include: [ImageEntity], // Incluir imagen asociada
            });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error obteniendo producto: ' + error.message);
        }
    }

    async updateProduct(id, data, sellerId) {
        try {
            const product = await ProductEntity.findOne({ where: { id, sellerId } });
            if (!product) {
                throw new Error('Product not found');
            }
            await product.update({ ...product, ...data });
            return product;
        } catch (error) {
            throw new Error('Error actualizando producto: ' + error.message);
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
            throw new Error('Error eliminando producto: ' + error.message);
        }
    }

    // Actualizar la imagen de un producto
    async updateProductImage(productId, newImageUrl) {
        try {
            const product = await ProductEntity.findByPk(productId, {
                include: [ImageEntity]
            });

            if (!product) {
                throw new Error('Product not found');
            }

            if (product.Image) {
                product.Image.url = newImageUrl;
                await product.Image.save();
            } else {
                await ImageEntity.create({
                    url: newImageUrl,
                    productId: product.id
                });
            }

            return { message: 'Product image updated successfully' };
        } catch (error) {
            console.error('Error actualizando imagen del producto:', error.message);
            throw new Error('Error actualizando imagen del producto: ' + error.message);
        }
    }
}

export default new ProductService();