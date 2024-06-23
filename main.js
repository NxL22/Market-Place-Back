import sequelize from "./src/config/db.js";
import httpServer from "./src/config/http.js";
import dotenv from "dotenv";
import './src/config/firebase.js'; 


dotenv.config();

async function bootstrap() {
    const PORT = process.env.PORT || 3000;

    try {
        await transporter.verify();
        console.log('Transporter verified successfully.');
        
        await sequelize.sync({ alter: true });
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Inicia el servidor HTTP
        httpServer.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);

            // Verifica la conexión a Firebase
            try {
                console.log('Firebase admin initialized successfully.');
            } catch (error) {
                console.error('Error initializing Firebase:', error);
            }
        });

    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

bootstrap();
