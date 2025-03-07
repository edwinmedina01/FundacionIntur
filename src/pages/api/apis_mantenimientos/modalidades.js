const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener todas las modalidades excepto las eliminadas (Estado ≠ 3)
    try {
      const modalidades = await sequelize.query(
        'SELECT * FROM tbl_modalidad WHERE Estado <> 3', // 🔥 Filtra los eliminados
        { type: QueryTypes.SELECT }
      );
      res.status(200).json(modalidades);
    } catch (error) {
      console.error('Error al obtener las modalidades:', error);
      res.status(500).json({ error: 'Error al obtener las modalidades' });
    }
  } 
  
  else if (req.method === 'POST') {
    // Crear nueva modalidad (Estado = 1 por defecto)
    const { Nombre, Descripcion, Duracion, Horario, Creado_Por } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_modalidad (Nombre, Descripcion, Duracion, Horario, Estado, Creado_Por, Fecha_Creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())', 
        {
          replacements: [Nombre, Descripcion, Duracion, Horario, 1, Creado_Por],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Modalidad creada con éxito' });
    } catch (error) {
      console.error('Error al crear la modalidad:', error);
      res.status(500).json({ error: 'Error al crear la modalidad' });
    }
  } 
  
  else if (req.method === 'PUT') {
    // Actualizar una modalidad (incluye el Estado)
    const { Id_Modalidad, Nombre, Descripcion, Duracion, Horario, Estado, Modificado_Por } = req.body;
    try {
      await sequelize.query(
        'UPDATE tbl_modalidad SET Nombre = ?, Descripcion = ?, Duracion = ?, Horario = ?, Estado = ?, Modificado_Por = ?, Fecha_Modificacion = NOW() WHERE Id_Modalidad = ?', 
        {
          replacements: [Nombre, Descripcion, Duracion, Horario, Estado, Modificado_Por, Id_Modalidad],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Modalidad actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la modalidad:', error);
      res.status(500).json({ error: 'Error al actualizar la modalidad' });
    }
  } 
  
  else if (req.method === 'DELETE') {
    // Cambio de Estado en lugar de eliminar físicamente
    const { Id_Modalidad, Modificado_Por } = req.body;
    try {
      await sequelize.query(
        'UPDATE tbl_modalidad SET Estado = 3, Modificado_Por = ?, Fecha_Modificacion = NOW() WHERE Id_Modalidad = ?', 
        {
          replacements: [Modificado_Por, Id_Modalidad],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Modalidad marcada como eliminada' });
    } catch (error) {
      console.error('Error al eliminar la modalidad:', error);
      res.status(500).json({ error: 'Error al eliminar la modalidad' });
    }
  } 
  
  else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
