const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { Id_Estudiante } = req.query;
    try {
      let permisos;
      if (Id_Estudiante) {
        permisos = await sequelize.query(
          `SELECT * FROM tbl_graduando WHERE Id_Estudiante = ? order by Fecha_Creacion DESC` ,
          { replacements: [rolId], type: QueryTypes.SELECT }
        );
      } else {
        console.error('Error al obtener los graducion:', error);
      }
      res.status(200).json(permisos);
    } catch (error) {
      console.error('Error al obtener los graducion:', error);
      res.status(500).json({ error: 'Error al obtener los graducion' });
    }
  } 
  
}
