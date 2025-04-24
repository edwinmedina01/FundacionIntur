import jwt from 'jsonwebtoken';
const Usuario = require('../../../../models/Usuario');
import { matchPassword } from '../../../lib/helpers'; 
import bcrypt from 'bcryptjs';
import { registrarBitacora } from '../../../utils/bitacoraHelper';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Se requieren ambas contraseñas.' });
        }

        let userId = 0;
        const token = req.cookies.token;

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            userId = decoded.id;
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const usuario = await Usuario.findOne({ where: { Id_Usuario: userId } });
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const esValida = await matchPassword(currentPassword, usuario.Contrasena);
        if (!esValida) {
            return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }

        try {
            const dataAntes = usuario.toJSON();
            const updates = {
                Primer_Login: false,
                Primer_Ingreso: new Date().toISOString()
            };

            if (newPassword) {
                updates.Contrasena = await bcrypt.hash(newPassword, 10);
            }

            await Usuario.update(updates, { where: { Id_Usuario: userId } });

            const dataDespues = { ...dataAntes, ...updates, Contrasena: '[OCULTA]' };
            dataAntes.Contrasena = '[OCULTA]';

            await registrarBitacora({
                Id_Usuario: userId,
                Modulo: 'USUARIO',
                Tipo_Accion: 'UPDATE',
                Data_Antes: dataAntes,
                Data_Despues: dataDespues,
                Detalle: 'El usuario cambió su contraseña.',
                IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                Navegador: req.headers['user-agent'],
            });

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
