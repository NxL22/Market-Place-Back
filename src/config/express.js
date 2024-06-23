import express from "express";



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
    expressApp.use('/', )


expressApp.use((err, _req, res, _next) => {

    const status = err.status || 500;
    const message = err.message || err;

    res.status(status).send(message);
});


export default expressApp;