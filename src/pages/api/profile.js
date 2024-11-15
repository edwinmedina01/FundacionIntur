// pages/api/profile.js

import jwt from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';
import Usuario from '../../../models/Usuario';
import sequelize from '../../../database/database';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    const token = req.cookies.token || '';

    if (!token) {
        return res.status(401).json({ mensaje: 'No estás autorizado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const usuario = await Usuario.findOne({ where: { Id_Usuario: decoded.id } });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Obtener el estado del usuario
        const [estado] = await sequelize.query('SELECT Descripcion FROM tbl_estado_usuario WHERE Id_EstadoUsuario = ?', {
            replacements: [usuario.Id_EstadoUsuario],
            type: QueryTypes.SELECT,
        });

        if (!estado) {
            return res.status(404).json({ mensaje: 'Estado de usuario no encontrado' });
        }

        // Obtener el rol del usuario
        const [rol] = await sequelize.query('SELECT ROL FROM Tbl_Roles WHERE Id_Rol = ?', {
            replacements: [usuario.Id_Rol],
            type: QueryTypes.SELECT,
        });

        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol de usuario no encontrado' });
        }

        // Devuelve la información del usuario
        return res.status(200).json({
            id: usuario.Id_Usuario,
            rol: rol.ROL, // Usa el nombre del rol
            email: usuario.Correo,
            estado: estado.Descripcion,
            nombre: usuario.Usuario,
        });
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        return res.status(401).json({ mensaje: 'Token no válido' });
    }
}
