const sequelize = require('../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idRol, idObjeto } = req.body;

    try {
      if (!idRol || !idObjeto) {
        return res.status(400).json({ error: 'ID de rol y objeto son requeridos' });
      }

      const permisos = await sequelize.query(
        `SELECT Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar 
         FROM tbl_permisos 
         WHERE Id_Rol = ? AND Id_Objeto = ?`,
        {
          replacements: [idRol, idObjeto],
          type: QueryTypes.SELECT,
        }
      );

      if (permisos.length === 0) {
        return res.status(404).json({ error: 'No se encontraron permisos para este rol y objeto' });
      }

      res.status(200).json(permisos[0]);
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      res.status(500).json({ error: 'Error al obtener permisos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
