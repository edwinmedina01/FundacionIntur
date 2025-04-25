import { registrarBitacora } from '../../../utils/bitacoraHelper';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const token = req.cookies.token || '';

    try {
      jwt.verify(token, SECRET_KEY); // Solo verificamos que el token sea válido
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido o no proporcionado' });
    }

    const { Id_Usuario, Modulo, Tipo_Accion, Detalle } = req.body;

    if (!Id_Usuario || !Modulo || !Tipo_Accion || !Detalle) {
      return res.status(400).json({ error: 'Faltan datos para registrar en bitácora' });
    }

    try {
      await registrarBitacora({
        Id_Usuario,
        Modulo,
        Tipo_Accion,
        Data_Antes: null,
        Data_Despues: null,
        Detalle,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(200).json({ message: '✅ Acción registrada en bitácora correctamente' });
    } catch (error) {
      console.error('❌ Error al registrar en bitácora:', error);
      res.status(500).json({ error: 'Error al registrar en bitácora' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
