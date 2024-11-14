// pages/api/login.js

import { serialize } from 'cookie';
import { matchPassword } from '../../lib/helpers'; // Ajusta la ruta según donde esté tu módulo
import jwt from 'jsonwebtoken';
const Usuario = require('../../../models/Usuario');

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
    //return  res.status(405).json({ mensaje: 'Método no permitido' });
    if (req.method !== 'POST') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    const { email, password } = req.body;

    // Verificamos si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ where: { Usuario: email } });

    if (!usuario) {
        return res.status(400).json({ mensaje: 'El usuario y/o contraseña que especificaste no son correctos' });
    }

    // Comparamos la contraseña en texto plano con la encriptada en la base de datos
    const esValida = await matchPassword(password, usuario.Contrasena);

    if (!esValida) {
        return res.status(400).json({ mensaje: 'El usuario y/o contraseña que especificaste no son correctos' });
    }

    console.log(SECRET_KEY)
    // Crear el token incluyendo los campos requeridos TEST
    const token = jwt.sign(
        { 
            id: usuario.Id_Usuario,
            role: usuario.Id_Rol,
            email: usuario.Correo,
            estado: usuario.Id_EstadoUsuario,
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
    res.status(200).json({ token, role: usuario.Rol, primerLogin: usuario.Primer_Login });
}
