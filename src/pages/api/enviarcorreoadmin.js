// /api/enviarcorreo.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../../../models/Usuario'; // Asegúrate de que la ruta sea correcta
import { cryptPassword } from '../../lib/helpers'; // Ajusta la ruta según donde esté tu módulo
// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'proyectoevaluacion03@gmail.com', // Tu usuario de email
        pass: 'jnuc qyru wplz otto', // Usa la contraseña de aplicación aquí
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Objeto en memoria para almacenar tokens
const tokenStore = {};

// Función para almacenar el token con su tiempo de expiración
const storeToken = (email, token) => {
    tokenStore[token] = {
        email,
        expires: Date.now() + 5 * 60 * 1000, // Expira en 5 minutos
    };
};

// Función para obtener los datos del token
const getTokenData = (token) => {
    return tokenStore[token];
};

// Función para eliminar el token
const deleteToken = (token) => {
    delete tokenStore[token];
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId, newPassword, email, adminId } = req.body;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; 
        try {
            // Verificar si el usuario existe en la base de datos
            const user = await User.findOne({ where: { Id_Usuario: userId } });

            if (!userId || !newPassword || !email || !adminId) {
                return res.status(400).json({ success: false, message: "Faltan datos requeridos." });
            }

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            const hashedPassword = await cryptPassword(newPassword);


            await User.update(
                { Contrasena: hashedPassword ,Primer_Login:true}, 
                { where: { Id_Usuario: userId } }
            );

            // Obtener el nombre del usuario (campo "Usuario")
            const nombreUsuario = user.Usuario;

            // Generar un token único
            const token = crypto.randomBytes(20).toString('hex');

            // Almacenar el token en el objeto en memoria
            storeToken(email, token);

            // URL para cambiar la contraseña
            const url = `http://localhost:3000/resetpassword`;

            // Configurar el contenido del correo electrónico
            const mailOptions = {
                from: 'proyectoimplementacion24@gmail.com',
                to: email,
                subject: 'Restablecimiento de Contraseña por el Administrador',
                html: `
                    <h1 style="font-family: Arial, sans-serif; color: #333;">Restablecimiento de Contraseña</h1>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Estimado/a <strong>${nombreUsuario}</strong>,
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Un administrador ha restablecido tu contraseña. Ahora puedes iniciar sesión con la siguiente contraseña temporal:
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #d9534f;">
                        <strong>${newPassword}</strong>
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Para acceder a tu cuenta, usa la contraseña temporal e inicia sesión en la plataforma:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${baseUrl}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">
                            Iniciar Sesión
                        </a>
                    </div>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Por razones de seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión.
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Si no solicitaste este cambio, por favor contacta al equipo de soporte.
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Atentamente,<br>
                        El equipo de soporte.
                    </p>
                `,
            };

            // Enviar el correo
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Correo enviado con éxito.', success: true });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'Error al enviar el correo' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
