// /api/enviarcorreo.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../../../models/Usuario'; // Asegúrate de que la ruta sea correcta

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'proyectoimplementacion24@gmail.com', // Tu usuario de email
        pass: 'lori xsvu wosm nvvm', // Usa la contraseña de aplicación aquí
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
        const { email } = req.body;

        try {
            // Verificar si el usuario existe en la base de datos
            const user = await User.findOne({ where: { Correo: email } });
            if (!user) {
                return res.status(404).json({ error: 'Correo no encontrado.' });
            }

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
                subject: 'Solicitud de Recuperación de Contraseña',
                html: `
                    <h1 style="font-family: Arial, sans-serif; color: #333;">Solicitud de Recuperación de Contraseña</h1>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Estimado/a ${nombreUsuario},
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Hemos recibido una solicitud para restablecer la contraseña de la cuenta con Nombre de usuario > <strong>${nombreUsuario}</strong> < . Para proceder, por favor haz clic en el siguiente enlace:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${url}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                    </div>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Atentamente,<br>
                        El equipo de soporte.
                    </p>
                `,
            };

            // Enviar el correo
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Correo enviado con éxito.' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'Error al enviar el correo' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
