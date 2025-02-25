const sequelize = require('../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { Id_Estudiante} = req.body;

    try {
      if (!Id_Estudiante) {
        return res.status(400).json({ error: 'Id_Estudiante es requerido' });
      }

      const  permisos = await sequelize.query(
        `SELECT * FROM tbl_graduando WHERE Id_Estudiante = ?`,
        { replacements: [Id_Estudiante], type: QueryTypes.SELECT }
      );

      if (permisos.length === 0) {
        return res.status(404).json({ error: 'No se encontraron graducacion' });
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
