const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const modalidades = await sequelize.query(
        'SELECT * FROM tbl_modalidad WHERE Estado <> 3',
        { type: QueryTypes.SELECT }
      );
      res.status(200).json(modalidades);
    } catch (error) {
      console.error('Error al obtener las modalidades:', error);
      res.status(500).json({ error: 'Error al obtener las modalidades' });
    }
  } 

  else if (req.method === 'POST') {
    const { Nombre, Descripcion, Duracion, Hora_Inicio, Hora_Final, Estado = 1, Creado_Por } = req.body;
    try {
      // Validar si ya existe una modalidad con ese nombre
      const existe = await sequelize.query(
        'SELECT COUNT(*) AS total FROM tbl_modalidad WHERE Nombre = ? AND Estado <> 3',
        {
          replacements: [Nombre],
          type: QueryTypes.SELECT,
        }
      );

      if (existe[0].total > 0) {
        return res.status(403).json({ error: 'Ya existe una modalidad con ese nombre.' });
      }

      const now = new Date();
      await sequelize.query(
        `INSERT INTO tbl_modalidad 
         (Nombre, Descripcion, Duracion, Hora_Inicio, Hora_Final, Estado, Creado_Por, Fecha_Creacion) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        {
          replacements: [Nombre, Descripcion, Duracion, Hora_Inicio, Hora_Final, Estado, Creado_Por, now],
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
    const { Id_Modalidad, Nombre, Descripcion, Duracion, Hora_Inicio, Hora_Final, Estado, Modificado_Por } = req.body;
    try {
      const existe = await sequelize.query(
        'SELECT COUNT(*) AS total FROM tbl_modalidad WHERE Nombre = ? AND Id_Modalidad <> ? AND Estado <> 3',
        {
          replacements: [Nombre, Id_Modalidad],
          type: QueryTypes.SELECT,
        }
      );

      if (existe[0].total > 0) {
        return res.status(403).json({ error: 'Ya existe otra modalidad con ese nombre.' });
      }

      const now = new Date();
      await sequelize.query(
        `UPDATE tbl_modalidad 
         SET Nombre = ?, Descripcion = ?, Duracion = ?, Hora_Inicio = ?, Hora_Final = ?, Estado = ?, Modificado_Por = ?, Fecha_Modificacion = ? 
         WHERE Id_Modalidad = ?`,
        {
          replacements: [Nombre, Descripcion, Duracion, Hora_Inicio, Hora_Final, Estado, Modificado_Por, now, Id_Modalidad],
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
    const { Id_Modalidad } = req.body;
    try {
      const now = new Date();
      await sequelize.query(
        'UPDATE tbl_modalidad SET Estado = 3, Fecha_Modificacion = ? WHERE Id_Modalidad = ?', 
        {
          replacements: [ now, Id_Modalidad],
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