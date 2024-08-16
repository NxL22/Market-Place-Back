import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserEntity from "../entities/user.entity.js";
import AdminEntity from "../entities/admin.entity.js"; // Asegúrate de que este import es correcto
import SellerEntity from "../entities/seller.entity.js"; // Asegúrate de que este import es correcto
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // Importar bcrypt para comparar contraseñas
import { roles } from '../utils/enum/role-enum.js';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
};

passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        const { email, role } = jwtPayload;
        try {
            let user = null;
            if (role === roles.ADMIN) {
                user = await AdminEntity.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: 'Admin not found' });
                }
            } else if (role === roles.SELLER) {
                user = await SellerEntity.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: 'Seller not found' });
                }
            } else {
                user = await UserEntity.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
            }

            user.password = null;
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

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
