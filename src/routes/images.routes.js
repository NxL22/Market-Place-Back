import { Router } from 'express';
import multer from 'multer';
// import path from 'path'; // Esta ruta es necesaria para la configuración de multer en local
import imagesService from '../services/images.service.js';

const imagesRoutes = Router();


// GUARDADO LOCAL FALTA IMPORTAR EL PATH PARA LA DIRECCIONES RELATIVAS
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {

//         cb(null, path.join(path.resolve(), 'src/uploads/'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// Configuración de almacenamiento en memoria para multer
const storage = multer.memoryStorage();
const upload = multer({ storage });


imagesRoutes.post('/holis2', async (_req, res) => {
    try {
        const saludo = await imagesService.saludo();
        res.send(saludo);
    } catch (error) {
        res.status(500).send('Error al procesar la solicitud');
    }
});


imagesRoutes.put('/upload', upload.single('image'), async (req, res) => {
    try {
        const { productId } = req.body; // Asegúrate de que `productId` se envíe en el cuerpo de la solicitud
        if (!req.file) {
            return res.status(400).send('No image uploaded.');
        }
        if (!productId) {
            return res.status(400).send('No productId provided.');
        }
        const image = await imagesService.upload(req.file, productId);
        res.send(`Image uploaded successfully: ${image.url}`);
    } catch (error) {
        res.status(500).send(`Error uploading image: ${error.message}`);
    }
});


export default imagesRoutes;
