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

    const usuario = await Usuario.findOne({ where: { Usuario: email } });

    if (!usuario) {
        return res.status(400).json({ mensaje: 'El usuario y/o contraseña que especificaste no son correctos' });
    }
    if (password) {
        const salt = await bcrypt.genSalt(10);
        usuario.Contrasena = await bcrypt.hash(password, salt);
    }
    const esValida = await bcrypt.compare(password, usuario.Contrasena);

    if (!esValida) {
        return res.status(400).json({ mensaje: 'El usuario y/o contraseña que especificaste no son correctos' });
    }

    // Crear el token incluyendo los campos requeridos
    const token = jwt.sign(
        { 
            id: usuario.Id_Usuario, // id del usuario
            role: usuario.Rol, // rol del usuario
            email: usuario.Correo, // correo del usuario
            estado: usuario.Id_EstadoUsuario, // estado del usuario
   //         password: usuario.Contrasena, // contraseña del usuario (considera los riesgos de seguridad)
            nombre: usuario.Usuario
        }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
    );

    const serialized = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, 
        path: '/',
    });

    res.setHeader('Set-Cookie', serialized);
    res.status(200).json({ token, role: usuario.Id_Rol });
}
