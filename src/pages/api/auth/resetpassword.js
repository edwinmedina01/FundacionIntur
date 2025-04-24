import Usuario from '../../../../models/Usuario';
import bcrypt from 'bcryptjs';
import client from '../../../lib/redis';
import { registrarBitacora } from '../../../utils/bitacoraHelper';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, newPassword, token } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ message: 'Se requieren el nombre de usuario y la nueva contraseña.' });
    }

    if (!token || !newPassword) {
      return res.status(400).json({ message: '❌ token invalido' });
    }

    const email = await client.get(`verify:${token}`);

    if (!email) {
      return res.status(400).json({ message: '❌ Token inválido o expirado.' });
    }

    try {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
      }

      const usuario = await Usuario.findOne({ where: { Usuario: username } });

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado con ese nombre de usuario.' });
      }

      if (!email) {
        return res.status(400).json({ message: 'El usuario no tiene un correo electrónico asociado.' });
      }

      if (email !== usuario.Correo) {
        return res.status(400).json({ message: 'El correo no coincide con el correo proporcionado' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const dataAntes = usuario.toJSON();

      await Usuario.update(
        { Contrasena: hashedPassword, Primer_Login: 0 },
        { where: { Usuario: username } }
      );

      const usuarioActualizado = await Usuario.findOne({ where: { Usuario: username } });

      await registrarBitacora({
        Id_Usuario: usuario.Id_Usuario,
        Modulo: 'USUARIO',
        Tipo_Accion: 'UPDATE',
        Data_Antes: { ...dataAntes, Contrasena: '[OCULTA]' },
        Data_Despues: { ...usuarioActualizado.toJSON(), Contrasena: '[OCULTA]' },
        Detalle: `Se restableció la contraseña del usuario '${username}' vía token.`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      await client.del(`verify:${token}`);

      return res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      return res.status(500).json({ message: 'Error al actualizar la contraseña.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido.`);
  }
}
