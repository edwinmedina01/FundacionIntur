import { Op } from 'sequelize';
//import { verificarToken } from '../../utils/auth';
import BitacoraAccion from '../../../models/BitacoraAccion';

export default async function handler(req, res) {
  try {
    // 🔐 Verifica el token del usuario
   // const decoded = verificarToken(req);

    if (req.method === 'GET') {
      // Traer TODA la bitácora sin filtros ni paginación
      const bitacora = await BitacoraAccion.findAll({
        attributes: ['Id_Bitacora', 'Id_Usuario', 'Modulo', 'Tipo_Accion', 'Detalle', 'IP_Usuario', 'Fecha'],
        order: [['Fecha', 'DESC']]
      });
      return res.status(200).json(bitacora);
    } else {
      return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en Bitácora:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
}