import jwt from 'jsonwebtoken';
const Usuario = require('../../../models/Usuario');
import { matchPassword } from '../../lib/helpers'; 
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { currentPassword, newPassword } = req.body;

        // Validar que se hayan proporcionado las contraseñas
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Se requieren ambas contraseñas.' });
        }

        let userId = 0;
        const token = req.cookies.token;

        // Validación del token
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            userId = decoded.id;
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Obtener el usuario de la base de datos
        const usuario = await Usuario.findOne({ where: { Id_Usuario: userId } });
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Validar la contraseña actual
        const esValida = await matchPassword(currentPassword, usuario.Contrasena);
        if (!esValida) {
            return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }

        try {
            const updates = {
                Primer_Login: false,
                Primer_Ingreso: new Date().toISOString()
            };
        
            // Hashear la nueva contraseña y actualizar solo si se ha enviado
            if (newPassword) {
                updates.Contrasena = await bcrypt.hash(newPassword, 10);
            }

            // Actualiza el usuario en la base de datos
            await Usuario.update(updates, { where: { Id_Usuario: userId } });

            // Si todo va bien
            return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
