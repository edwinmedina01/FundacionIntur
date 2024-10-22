// pages/api/login.js

import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const Usuario = require('../../../models/Usuario');

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    const { email, password } = req.body;

    // Modificación aquí: incluir el rol en la consulta
    const usuario = await Usuario.findOne({ where: { Usuario: email } });

    // Verificación del usuario
    if (!usuario) {
        return res.status(400).json({ mensaje: 'El usuario y/o contraseña que especificaste no son correctos' });
    }

    const esValida = await bcrypt.compare(password, usuario.Contrasena);

    if (!esValida) {
        return res.status(400).json({ mensaje: 'El usuario y/o contraseña que especificaste no son correctos' });
    }

    // Modificación aquí: incluir el rol en el token
    const token = jwt.sign({ id: usuario.id, role: usuario.Id_Rol }, SECRET_KEY, { expiresIn: '1h' });

    const serialized = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo asegura la cookie con HTTPS en producción
        sameSite: 'strict',
        maxAge: 3600, // 1 hora en segundos
        path: '/', // Hacer la cookie accesible desde cualquier parte del sitio
    });

    // Añadir la cookie a la respuesta
    res.setHeader('Set-Cookie', serialized);

    // Modificación aquí: incluir el rol en la respuesta
    res.status(200).json({ token, role: usuario.Id_Rol }); // Responder con el rol
}
