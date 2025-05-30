const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener secciones
    try {
      const secciones = await sequelize.query(
        `
        SELECT 
          s.Id_Seccion,
          s.Nombre_Seccion,
          s.Id_Grado,
          g.Nombre AS Nombre_Grado,
          s.Estado,
          s.Fecha_Creacion,
          s.Fecha_Modificacion,
          s.Creado_Por,
          s.Modificado_Por
        FROM tbl_seccion s
        INNER JOIN tbl_grado g ON s.Id_Grado = g.Id_Grado
        where s.Estado=1
        order by s.Fecha_Creacion desc
        `,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).json(secciones);
    } catch (error) {
      console.error('Error al obtener las secciones:', error);
      res.status(500).json({ error: 'Error al obtener las secciones' });
    }
  } else if (req.method === 'POST') {
    // Crear nueva sección
    const { Nombre_Seccion, Id_Grado, Estado } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_seccion (Nombre_Seccion, Id_Grado, Estado, Fecha_Creacion, Fecha_Modificacion) VALUES (?, ?, ?, NOW(), NOW())', 
        {
          replacements: [Nombre_Seccion, Id_Grado, Estado],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Sección creada con éxito' });
    } catch (error) {
      console.error('Error al crear la sección:', error);
      res.status(500).json({ error: 'Error al crear la sección' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar una sección
    const { Id_Seccion, Nombre_Seccion, Id_Grado, Estado } = req.body;
    try {
      // Actualizar la sección utilizando los parámetros recibidos
      await sequelize.query(
        'UPDATE tbl_seccion SET Nombre_Seccion = ?, Id_Grado = ?, Estado = ?, Fecha_Modificacion = NOW() WHERE Id_Seccion = ?', 
        {
          replacements: [Nombre_Seccion, Id_Grado, Estado, Id_Seccion],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Sección actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la sección:', error);
      res.status(500).json({ error: 'Error al actualizar la sección' });
    }
  }
   else if (req.method === 'DELETE') {
    // Eliminar una sección
    const { Id_Seccion } = req.body;
    try {
      await sequelize.query('DELETE FROM tbl_seccion WHERE Id_Seccion = ?', {
        replacements: [Id_Seccion],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Sección eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la sección:', error);
      res.status(500).json({ error: 'Error al eliminar la sección' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
