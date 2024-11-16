const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener áreas
    try {
      const areas = await sequelize.query('SELECT * FROM tbl_area', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(areas);
    } catch (error) {
      console.error('Error al obtener las áreas:', error);
      res.status(500).json({ error: 'Error al obtener las áreas' });
    }
  } else if (req.method === 'POST') {
    // Crear nueva área
    const { Nombre_Area, Tipo_Area, Responsable_Area } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_area (Nombre_Area, Tipo_Area, Responsable_Area) VALUES (?, ?, ?)', 
        {
          replacements: [Nombre_Area, Tipo_Area, Responsable_Area],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Área creada con éxito' });
    } catch (error) {
      console.error('Error al crear el área:', error);
      res.status(500).json({ error: 'Error al crear el área' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un área
    const { Id_Area, Nombre_Area, Tipo_Area, Responsable_Area } = req.body;
    try {
      await sequelize.query(
        'UPDATE tbl_area SET Nombre_Area = ?, Tipo_Area = ?, Responsable_Area = ? WHERE Id_Area = ?', 
        {
          replacements: [Nombre_Area, Tipo_Area, Responsable_Area, Id_Area],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Área actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar el área:', error);
      res.status(500).json({ error: 'Error al actualizar el área' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar un área
    const { Id_Area } = req.body;
    try {
      await sequelize.query('DELETE FROM tbl_area WHERE Id_Area = ?', {
        replacements: [Id_Area],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Área eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el área:', error);
      res.status(500).json({ error: 'Error al eliminar el área' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
