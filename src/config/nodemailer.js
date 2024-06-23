import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_NODEMAIL, // tu correo electrónico
        pass: process.env.TOKEN_GMAIL, // tu contraseña o token de aplicación
    },
    tls: {
        rejectUnauthorized: false
    }
});


transporter.verify().then(() => {
    console.log('Ready to send emails');
}).catch(err => console.log('Error verifying transporter:', err));

export default transporter;