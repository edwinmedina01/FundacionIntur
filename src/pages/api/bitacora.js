import { Op } from 'sequelize';
import BitacoraAccion from '../../../models/BitacoraAccion';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Traer toda la bitácora
      const bitacora = await BitacoraAccion.findAll({
        attributes: ['Id_Bitacora', 'Id_Usuario', 'Modulo', 'Tipo_Accion', 'Detalle', 'IP_Usuario', 'Fecha'],
        order: [['Fecha', 'DESC']]
      });
      return res.status(200).json(bitacora);
    }

    if (req.method === 'DELETE') {
      const { Id_Bitacora } = req.body;

      if (!Id_Bitacora) {
        return res.status(400).json({ error: 'Id_Bitacora es requerido para eliminar' });
      }

      const registro = await BitacoraAccion.findByPk(Id_Bitacora);

      if (!registro) {
        return res.status(404).json({ error: 'Registro de bitácora no encontrado' });
      }

      await registro.destroy();
      return res.status(200).json({ message: 'Registro eliminado exitosamente' });
    }

    // Si no es GET ni DELETE
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en Bitácora:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
}
