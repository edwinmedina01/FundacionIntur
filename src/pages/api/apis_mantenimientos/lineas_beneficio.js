const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener líneas de beneficio
    try {
      const lineasBeneficio = await sequelize.query('SELECT * FROM tbl_lineas_de_beneficio order by fecha_creacion desc', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(lineasBeneficio);
    } catch (error) {
      console.error('Error al obtener las líneas de beneficio:', error);
      res.status(500).json({ error: 'Error al obtener las líneas de beneficio' });
    }
  }  else if (req.method === 'POST') {
    // Crear nueva línea de beneficio
    const { Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado } = req.body;
  
    try {
      // Verificar si el Nombre_Beneficio ya existe
      const existingBeneficio = await sequelize.query(
        'SELECT * FROM tbl_lineas_de_beneficio WHERE Nombre_Beneficio = ?',
        {
          replacements: [Nombre_Beneficio],
          type: QueryTypes.SELECT,
        }
      );
  
      if (existingBeneficio.length > 0) {
        return res.status(400).json({ error: 'El nombre del beneficio ya existe' });
      }
  
      // Insertar el nuevo beneficio con fecha de creación y modificación
      await sequelize.query(
        'INSERT INTO tbl_lineas_de_beneficio (Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado, Fecha_Creacion, Fecha_Modificacion) VALUES (?, ?, ?, ?, ?, NOW(), NOW())', 
        {
          replacements: [Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Línea de beneficio creada con éxito' });
    } catch (error) {
      console.error('Error al crear la línea de beneficio:', error);
      res.status(500).json({ error: 'Error al crear la línea de beneficio' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar una línea de beneficio
    const { Id_Beneficio, Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado } = req.body;
  
    try {
      // Verificar si el Nombre_Beneficio ya existe en otra línea de beneficio (excluyendo el actual)
      const existingBeneficio = await sequelize.query(
        'SELECT * FROM tbl_lineas_de_beneficio WHERE Nombre_Beneficio = ? AND Id_Beneficio != ?',
        {
          replacements: [Nombre_Beneficio, Id_Beneficio],
          type: QueryTypes.SELECT,
        }
      );
  
      if (existingBeneficio.length > 0) {
        return res.status(400).json({ error: 'El nombre del beneficio ya existe' });
      }
  
      // Si el estado no se proporcionó, se conserva el valor actual del estado
      const updatedState = Estado !== undefined ? Estado : null;
  
      // Actualizar la línea de beneficio con la nueva fecha de modificación y el estado
      await sequelize.query(
        'UPDATE tbl_lineas_de_beneficio SET Nombre_Beneficio = ?, Tipo_Beneficio = ?, Monto_Beneficio = ?, Responsable_Beneficio = ?, Estado = ?, Fecha_Modificacion = NOW() WHERE Id_Beneficio = ?', 
        {
          replacements: [Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, updatedState, Id_Beneficio],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Línea de beneficio actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la línea de beneficio:', error);
      res.status(500).json({ error: 'Error al actualizar la línea de beneficio' });
    }
  }
   else if (req.method === 'DELETE') {
    // Eliminar una línea de beneficio
    const { Id_Beneficio } = req.body;
    try {
      await sequelize.query('DELETE FROM tbl_lineas_de_beneficio WHERE Id_Beneficio = ?', {
        replacements: [Id_Beneficio],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Línea de beneficio eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la línea de beneficio:', error);
      res.status(500).json({ error: 'Error al eliminar la línea de beneficio' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
