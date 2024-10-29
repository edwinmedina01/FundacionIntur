// pages/api/logout.js

import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    // Configurar la cookie 'token' con una fecha de expiración pasada para eliminarla
    const serialized = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // Expira la cookie inmediatamente
        path: '/',
    });

    res.setHeader('Set-Cookie', serialized);
    res.status(200).json({ mensaje: 'Cierre de sesión exitoso' });
}
