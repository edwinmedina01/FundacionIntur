const sequelize = require('../../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener modalidades
    try {
      const modalidades = await sequelize.query('SELECT * FROM tbl_modalidad', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(modalidades);
    } catch (error) {
      console.error('Error al obtener las modalidades:', error);
      res.status(500).json({ error: 'Error al obtener las modalidades' });
    }
  } else if (req.method === 'POST') {
    // Crear nueva modalidad
    const { Nombre, Descripcion, Duracion, Horario } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_modalidad (Nombre, Descripcion, Duracion, Horario) VALUES (?, ?, ?, ?)', 
        {
          replacements: [Nombre, Descripcion, Duracion, Horario],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Modalidad creada con éxito' });
    } catch (error) {
      console.error('Error al crear la modalidad:', error);
      res.status(500).json({ error: 'Error al crear la modalidad' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar una modalidad
    const { Id_Modalidad, Nombre, Descripcion, Duracion, Horario } = req.body; // Desestructurar los valores del cuerpo
    try {
      // Actualizar la modalidad utilizando los parámetros recibidos
      await sequelize.query(
        'UPDATE tbl_modalidad SET Nombre = ?, Descripcion = ?, Duracion = ?, Horario = ? WHERE Id_Modalidad = ?', 
        {
          replacements: [Nombre, Descripcion, Duracion, Horario, Id_Modalidad], // Asegúrate de que el orden sea correcto
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Modalidad actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la modalidad:', error);
      res.status(500).json({ error: 'Error al actualizar la modalidad' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar una modalidad
    const { Id_Modalidad } = req.body; // Obtener el ID desde el cuerpo de la solicitud
    try {
      await sequelize.query('DELETE FROM tbl_modalidad WHERE Id_Modalidad = ?', {
        replacements: [Id_Modalidad],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Modalidad eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la modalidad:', error);
      res.status(500).json({ error: 'Error al eliminar la modalidad' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
