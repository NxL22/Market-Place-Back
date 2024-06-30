import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserEntity from "../entities/user.entity.js"; 
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
};

// Configuración de la estrategia JWT
passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        try {
            const user = await UserEntity.findOne({ where: { email: jwtPayload.email } });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            user.password = null; // Eliminar la contraseña por seguridad
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

// Middleware de autenticación
export const authenticateJWT = passport.authenticate("jwt", { session: false });


// Middleware de autorización
export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { role } = req.user;

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: "User not authorized" });
        }

        next();
    };
};
