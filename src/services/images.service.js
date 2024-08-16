import admin from 'firebase-admin'; //Modulo que permmite interactuar con Firebase
import { v4 as uuidv4 } from 'uuid';
import ImageEntity from '../entities/image.entity.js';


class ImagesService {

    async saludo() {
        return "Hola";
    }

    // Método para subir un archivo a Firebase Storage
    async uploadFileToFirebase(file) {
        // Obtiene el bucket de almacenamiento de Firebase
        const bucket = admin.storage().bucket();

        // Define el nombre del archivo en el bucket con un UUID único
        const blob = bucket.file(`images/${uuidv4()}-${file.originalname}`);

        // Crea un stream para subir el archivo al bucket
        const blobStream = blob.createWriteStream({
            resumable: false, // La subida no es resumible
            metadata: {
                contentType: file.mimetype // Define el tipo de contenido del archivo
            }
        });

        // Retorna una promesa que se resuelve cuando el archivo se ha subido exitosamente
        return new Promise((resolve, reject) => {
            blobStream.on('error', err => {
                reject(err); // Rechaza la promesa si hay un error
            });

            blobStream.on('finish', async () => {
                try {
                    await blob.makePublic(); // Hace el archivo público
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // URL pública del archivo
                    resolve(publicUrl); // Resuelve la promesa con la URL pública
                } catch (error) {
                    reject(error); // Rechaza la promesa si hay un error
                }
            });

            blobStream.end(file.buffer); // Finaliza el stream y sube el archivo
        });
    }

    // Método para guardar la URL de la imagen en la base de datos
    async saveImageUrlToDatabase(url, productId) {
        try {
            // Crea una nueva entrada en la entidad ImageEntity con la URL y el productId
            const newImage = await ImageEntity.create({ url, productId });
            return newImage; // Retorna la nueva imagen creada
        } catch (error) {
            console.error('Error saving image URL to database:', error); // Imprime el error en la consola
            throw new Error('Error saving image URL to database'); // Lanza un error
        }
    }

    // Método principal para subir una imagen
    async upload(file, productId) {
        try {
            const publicUrl = await this.uploadFileToFirebase(file); // Sube el archivo a Firebase y obtiene la URL pública
            const newImage = await this.saveImageUrlToDatabase(publicUrl, productId); // Guarda la URL en la base de datos
            return newImage; // Retorna la nueva imagen creada
        } catch (error) {
            console.error('Error uploading image:', error); // Imprime el error en la consola
            throw new Error(`Error uploading image: ${error.message}`); // Lanza un error con un mensaje detallado
        }
    }
}


export default new ImagesService();
