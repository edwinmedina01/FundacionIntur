import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../../../models/Usuario'; // Asegúrate de que la ruta sea correcta
import { cryptPassword } from '../../lib/helpers'; // Ajusta la ruta según donde esté tu módulo
import fs from 'fs';
import path from 'path';

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // Tu usuario de email
        pass: process.env.EMAIL_APP_PASS, // Usa la contraseña de aplicación aquí
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const convertirImagenABase64 = (nombreArchivo) => {
    try {
        const ruta = path.join(process.cwd(), 'public', nombreArchivo); // Ruta de la imagen en /public
        const imagenBase64 = fs.readFileSync(ruta, { encoding: 'base64' });
        return `data:image/png;base64,${imagenBase64}`; // Ajusta el tipo de imagen si es JPG
    } catch (error) {
        console.error("Error al convertir imagen a Base64:", error);
        return null;
    }
};

// Función para crear un nuevo usuario y enviar el correo de bienvenida
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, username, adminId } = req.body;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // URL base de la app

        try {
            // Verificar si el email ya está registrado
            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ success: false, message: "El usuario ya existe." });
            }

            // Generar una contraseña temporal para el nuevo usuario
            const newPassword = crypto.randomBytes(8).toString('hex'); // Genera una contraseña aleatoria
            const hashedPassword = await cryptPassword(newPassword); // Cifra la contraseña

            // Crear el nuevo usuario
            const newUser = await User.create({
                email,
                username,
                password: hashedPassword,
                createdBy: adminId,
            });

            const firmaBase64 = convertirImagenABase64('firma.png'); // Firma de la empresa en Base64

            if (!firmaBase64) {
                return res.status(500).json({ error: 'Error al cargar la imagen de la firma' });
            }

            // Configurar el contenido del correo electrónico
            const mailOptions = {
                from: 'proyectoimplementacion24@gmail.com', // Tu email de envío
                to: email,
                subject: 'Bienvenido a Fundación Intur',
                html: `
                    <h1 style="font-family: Arial, sans-serif; color: #333;">Bienvenido a Fundación Intur</h1>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Estimado/a <strong>${username}</strong>,
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        ¡Gracias por registrarte en Fundación Intur! Tu cuenta ha sido creada exitosamente.
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Tu contraseña inicial es:
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #d9534f;">
                        <strong>${newPassword}</strong>
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Para acceder a tu cuenta, por favor usa la contraseña temporal e inicia sesión en la plataforma:
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
                        Si tienes alguna duda o necesitas asistencia, no dudes en contactar a nuestro equipo de soporte.
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Atentamente,<br>
                        El equipo de Fundación Intur.
                    </p>
                    <img src="${baseUrl}/firma.png" alt="Firma Digital" style="width: 250px; display: block; margin-top: 10px;">
                `,
            };

            // Enviar el correo de bienvenida
            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Usuario creado y correo enviado exitosamente.', success: true });

        } catch (error) {
            console.error('Error al crear el usuario y enviar el correo:', error);
            res.status(500).json({ error: 'Error al crear el usuario y enviar el correo' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
