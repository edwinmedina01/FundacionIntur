const sequelize = require('../../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener instituciones
    try {
      const instituciones = await sequelize.query('SELECT * FROM tbl_instituto', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(instituciones);
    } catch (error) {
      console.error('Error al obtener las instituciones:', error);
      res.status(500).json({ error: 'Error al obtener las instituciones' });
    }
  } else if (req.method === 'POST') {
    // Crear nueva institución
    const { Nombre_Instituto, Direccion, Telefono, Correo, Director, Estado } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_instituto (Nombre_Instituto, Direccion, Telefono, Correo, Director,Estado) VALUES (?, ?, ?, ?, ?, ?)', 
        {
          replacements: [Nombre_Instituto, Direccion, Telefono, Correo, Director,Estado],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Institución creada con éxito' });
    } catch (error) {
      console.error('Error al crear la institución:', error);
      res.status(500).json({ error: 'Error al crear la institución' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar una institución
    const { Id_Instituto, Nombre_Instituto, Direccion, Telefono, Correo, Director,Estado } = req.body;
    try {
      // Actualizar la institución utilizando los parámetros recibidos
      await sequelize.query(
        'UPDATE tbl_instituto SET Nombre_Instituto = ?, Direccion = ?, Telefono = ?, Correo = ?, Director = ?,Estado = ? WHERE Id_Instituto = ?', 
        {
          replacements: [Nombre_Instituto, Direccion, Telefono, Correo, Director,Estado, Id_Instituto],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Institución actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la institución:', error);
      res.status(500).json({ error: 'Error al actualizar la institución' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar una institución
    const { Id_Instituto } = req.body;
    try {
      await sequelize.query('DELETE FROM tbl_instituto WHERE Id_Instituto = ?', {
        replacements: [Id_Instituto],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Institución eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la institución:', error);
      res.status(500).json({ error: 'Error al eliminar la institución' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
