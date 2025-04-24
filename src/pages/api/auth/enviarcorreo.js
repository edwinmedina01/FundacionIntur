// /api/enviarcorreo.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import client from "../../../lib/redis";
import User from '../../../../models/Usuario';
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import { registrarBitacora } from '../../../utils/bitacoraHelper';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const convertirImagenABase64 = (nombreArchivo) => {
    try {
        const ruta = path.join(process.cwd(), 'public', nombreArchivo);
        const imagenBase64 = fs.readFileSync(ruta, { encoding: 'base64' });
        return `data:image/png;base64,${imagenBase64}`;
    } catch (error) {
        console.error("Error al convertir imagen a Base64:", error);
        return null;
    }
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email,adminId } = req.body;

        try {
            const user = await User.findOne({
                where: {
                    Correo: email,
                    Id_EstadoUsuario: { [Op.ne]: 3 },
                },
            });

            if (!user) return res.status(404).json({ mensaje: 'Correo no encontrado.' });
            if (user.Id_EstadoUsuario !== 1) return res.status(403).json({ mensaje: 'Usuario inactivo o no autorizado.' });

            const firmaBase64 = convertirImagenABase64('firma.png');
            if (!firmaBase64) return res.status(500).json({ error: 'Error al cargar la imagen de la firma' });

            const token = crypto.randomBytes(20).toString('hex');
            await client.setEx(`verify:${token}`, 900, email);

            const url = process.env.NEXT_PUBLIC_APP_URL;
            const verificationUrl = `${url}/resetpassword?token=${token}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Solicitud de Recuperación de Contraseña',
                html: `
                    <h1 style="font-family: Arial, sans-serif; color: #333;">Solicitud de Recuperación de Contraseña</h1>
                    <p style="font-family: Arial, sans-serif; color: #555;">Estimado/a ,</p>
                    <p style="font-family: Arial, sans-serif; color: #555;">Hemos recibido una solicitud para restablecer la contraseña. Para proceder, por favor haz clic en el siguiente enlace:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                    </div>
                    <p style="font-family: Arial, sans-serif; color: #555;">Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.</p>
                    <p style="font-family: Arial, sans-serif; color: #555;">
                        Atentamente,<br>
                        El equipo de soporte.
                        <img src="https://fundacion-intur.vercel.app/firma.png" alt="Firma Digital" style="width: 500px; display: block; margin-top: 10px;">
                    </p>
                `,
            };

            await transporter.sendMail(mailOptions);

            await registrarBitacora({
                Id_Usuario: user.Id_Usuario,
                Modulo: 'USUARIOS',
                Tipo_Accion: 'UPDATE',
                Data_Antes: null,
                Data_Despues: null,
                Detalle: `El usuario solicitó el reinicio de contraseña'${user.Usuario}'`,
                IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                Navegador: req.headers['user-agent'],
            });

            res.status(200).json({ message: 'Correo enviado con éxito.' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'Error al enviar el correo' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
