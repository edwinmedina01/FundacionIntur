import Usuario from '../../../models/Usuario'; // Asegúrate de que la ruta es correcta
import bcrypt from 'bcryptjs';
import client from "../../lib/redis";


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, newPassword , token } = req.body; // Solo requerir 'username' y 'newPassword'

        // Validar que se haya proporcionado el nombre de usuario y la nueva contraseña
        if (!username || !newPassword) {
            return res.status(400).json({ message: 'Se requieren el nombre de usuario y la nueva contraseña.' });
        }

        if (!token || !newPassword) {
            return res.status(400).json({ message: "❌ token invalido" });
          }
          // Obtener el email vinculado al token desde Redis
          const email = await client.get(`verify:${token}`);
      
          if (!email) {
            return res.status(400).json({ message: "❌ Token inválido o expirado." });
          }
      



        try {
            // Validar la nueva contraseña (ajusta las reglas según tus necesidades)
            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
            }

            // Obtener el usuario de la base de datos utilizando el nombre de usuario
            const usuario = await Usuario.findOne({ where: { Usuario: username } }); // Busca por nombre de usuario

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado con ese nombre de usuario.' });
            }

            // Verificar que el correo electrónico coincide (aquí podrías ajustar la lógica)
            // No se requiere que el correo sea ingresado por el usuario, solo se verifica que exista
          //  const email = usuario.Correo; // Obtener el correo del usuario encontrado

            if (!email) {
                return res.status(400).json({ message: 'El usuario no tiene un correo electrónico asociado.' });
            }

            if (email!= usuario.Correo) {
                return res.status(400).json({ message: 'El correo no coincide con el correo proporcionado' });
            }



            // Si el correo electrónico existe, proceder a hashear la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Actualiza la contraseña en la base de datos
            await Usuario.update(
                { Contrasena: hashedPassword , Primer_Login:0 }, // Actualizar solo la contraseña
                { where: { Usuario: username } } // Busca por nombre de usuario
            );
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
