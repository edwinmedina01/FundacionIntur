
import jwt from 'jsonwebtoken';
const Usuario = require('../../../models/Usuario');
import { matchPassword } from '../../lib/helpers'; 
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { currentPassword, newPassword } = req.body;
  
        let userId = 0
        const token = req.cookies.token;

        try{
            const decoded = jwt.verify(token, SECRET_KEY);
            userId = decoded.id;
        }catch(error){
            return res.status(401).json({ message: 'Token inválido' });
        }

        const usuario = await Usuario.findOne({ where: { Id_Usuario: userId } });

        const esValida = await matchPassword(currentPassword, usuario.Contrasena);

        if (!esValida) {
            return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }

        try {
            const updates = {};
        
            // Actualiza la contraseña solo si se ha enviado una nueva
            if (newPassword) {
              const hashedPassword = await bcrypt.hash(newPassword, 10);
              updates.Contrasena = hashedPassword;
            }

            updates.Primer_Login = false;
            updates.Primer_Ingreso = (new Date()).toISOString()

            await Usuario.update(updates, { where: { Id_Usuario: userId } });
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar el usuario' });
        }


      
  
      // Si todo va bien
      return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  