// /api/enviarcorreo.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import client from "../../../lib/redis";

import User from '../../../../models/Usuario'; // Asegúrate de que la ruta sea correcta
import { use } from 'react';
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

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        try {
            // Verificar si el usuario existe en la base de datos
            const user = await User.findOne({ where: { Correo: email } });
            if (!user) {
                return res.status(404).json({ mensaje: 'Correo no encontrado.' });
            }


            const firmaBase64 = convertirImagenABase64('firma.png'); // Asegúrate de que la imagen está en /public/

            if (!firmaBase64) {
                return res.status(500).json({ error: 'Error al cargar la imagen de la firma' });
            }

            switch(user.Id_EstadoUsuario){
                        case 2:
                        return    res.status(404).json({ mensaje: 'Usuario Inactivo.' });
                        break
                        case 3:
                            return     res.status(404).json({ mensaje: 'Usuario Suspendido.' });
                        break

            }
            // Obtener el nombre del usuario (campo "Usuario")
            const nombreUsuario = user.Usuario;

            // Generar un token único
            const token = crypto.randomBytes(20).toString('hex');

            // Almacenar el token en el objeto en memoria
    
            // Guardar en Redis con una expiración de 15 minutos (900 segundos)
             await client.setEx(`verify:${token}`, 900, email);

            // URL para cambiar la contraseña
           // const url = `http://localhost:3000/resetpassword`;
            const url = process.env.NEXT_PUBLIC_APP_URL; 
            const verificationUrl = `${url}/resetpassword?token=${token}`;
            // Configurar el contenido del correo electrónico
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Solicitud de Recuperación de Contraseña',
                html: `
                    <h1 style="font-family: Arial, sans-serif; color: #333;">Solicitud de Recuperación de Contraseña</h1>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Estimado/a ,
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Hemos recibido una solicitud para restablecer la contraseña. Para proceder, por favor haz clic en el siguiente enlace:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                    </div>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
                    </p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Atentamente,<br>
                        El equipo de soporte.
                         <img src="https://fundacion-intur.vercel.app/firma.png" alt="Firma Digital" style="width: 500px; display: block; margin-top: 10px;">
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
