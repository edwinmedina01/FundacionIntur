const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener grados
    try {

      const grados = await sequelize.query(
        `
        SELECT 
          *
        FROM tbl_grado 
        where estado=1
        order by Fecha_Creacion desc
        
        `,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.status(200).json(grados);
    } catch (error) {
      console.error('Error al obtener los grados:', error);
      res.status(500).json({ error: 'Error al obtener los grados' });
    }
  } else if (req.method === 'POST') {
    // Crear nuevo grado
    const { Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_grado (Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Fecha_Creacion) VALUES (?, ?, ?, ?, ?, NOW())',
        {
          replacements: [Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Grado creado con éxito' });
    } catch (error) {
      console.error('Error al crear el grado:', error);
      res.status(500).json({ error: 'Error al crear el grado' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un grado
    const { Id_Grado, Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias } = req.body;
    try {
      // Actualizar el grado utilizando los parámetros recibidos
      await sequelize.query(
        'UPDATE tbl_grado SET Nombre = ?, Descripcion = ?, Nivel_Academico = ?, Duracion = ?, Cantidad_Materias = ?, Fecha_Modificacion = NOW() WHERE Id_Grado = ?',
        {
          replacements: [Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Id_Grado],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Grado actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el grado:', error);
      res.status(500).json({ error: 'Error al actualizar el grado' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar un grado
    const { Id_Grado } = req.body;
    try {
      await sequelize.query('DELETE FROM tbl_grado WHERE Id_Grado = ?', {
        replacements: [Id_Grado],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Grado eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el grado:', error);
      res.status(500).json({ error: 'Error al eliminar el grado' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
