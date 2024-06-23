import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "../routes/user.routes.js"
import productRoutes from "../routes/product.routes.js";
import adminRoutes from "../routes/admin.routes.js";
import sellerRoutes from "../routes/seller.routes.js";
import authRoutes from "../routes/auth.routes.js";


const expressApp = express();

expressApp.use(cors({
    origin: ['*'],
    allowedHeaders: ['Content-Type', 'Authorization', 'reset', 'pos'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
}));

expressApp.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
expressApp.use(bodyParser.json({ limit: "50mb" }));

expressApp.use(cookieParser());
expressApp.use(morgan("dev"));

  //aca se define el prefix de la ruta
expressApp.use('/user', userRoutes)
expressApp.use('/product', productRoutes)
expressApp.use('/admin', adminRoutes)
expressApp.use('/seller', sellerRoutes)
expressApp.use('/auth', authRoutes)

expressApp.use((err, _req, res, _next) => {

    const status = err.status || 500;
    const message = err.message || err;

    res.status(status).send(message);
});


export default expressApp;