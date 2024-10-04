// pages/api/login.js

import {serialize} from 'cookie';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const Usuario = require('../../../models/Usuario');

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({where: {Usuario: email}})
   

    const esValida = await bcrypt.compare(password, usuario.Contrasena);

    if (!usuario || !esValida) {
        return res.status(400).json({ mensaje: 'El usuario y/o contraseña que especificaste no son correctos' });
    }

    const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '1h' });

    const serialized = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo asegura la cookie con HTTPS en producción
        sameSite: 'strict',
        maxAge: 3600, // 1 hora en segundos
        path: '/', // Hacer la cookie accesible desde cualquier parte del sitio
    });
  
      // Añadir la cookie a la respuesta
    res.setHeader('Set-Cookie', serialized);

    res.status(200).json({ token });
}
