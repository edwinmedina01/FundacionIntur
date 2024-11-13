const sequelize = require('../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Obtener todos los beneficios
      const beneficios = await sequelize.query('SELECT * FROM tbl_lineas_de_beneficio', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(beneficios);
    } catch (error) {
      console.error('Error al obtener los beneficios:', error);
      res.status(500).json({ error: 'Error al obtener los beneficios' });
    }
  } else if (req.method === 'POST') {
    // Obtener datos del cuerpo de la solicitud
    let { Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado } = req.body;

    try {
      // Si no se pasó una Fecha_Creacion, se asigna la fecha actual
      if (!Fecha_Creacion) {
        Fecha_Creacion = new Date().toISOString().split('T')[0];  // Asignar la fecha actual
      }
      // Si no se pasó una Fecha_Modificacion, se asigna null
      if (!Fecha_Modificacion) {
        Fecha_Modificacion = null;
      }

      // Verificar si ya existe un beneficio con el mismo nombre
      const existingBenefit = await sequelize.query('SELECT * FROM tbl_lineas_de_beneficio WHERE Nombre_Beneficio = ?', {
        replacements: [Nombre_Beneficio],
        type: QueryTypes.SELECT,
      });

      if (existingBenefit.length > 0) {
        return res.status(400).json({ error: 'El beneficio ya existe' });
      }

      // Insertar nuevo beneficio
      await sequelize.query(
        'INSERT INTO tbl_lineas_de_beneficio (Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        {
          replacements: [Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Beneficio creado con éxito' });
    } catch (error) {
      console.error('Error al crear el beneficio:', error);
      res.status(500).json({ error: 'Error al crear el beneficio' });
    }
  } else if (req.method === 'PUT') {
    // Obtener datos del cuerpo de la solicitud
    let { Id_Beneficio, Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado } = req.body;

    try {
      // Si no se pasó una Fecha_Modificacion, se asigna la fecha actual
      if (!Fecha_Modificacion) {
        Fecha_Modificacion = new Date().toISOString().split('T')[0];
      }
      
      // Verificar si existe el beneficio con el Id_Beneficio
      const existingBenefit = await sequelize.query('SELECT * FROM tbl_lineas_de_beneficio WHERE Id_Beneficio = ? AND Id_Beneficio != ?', {
        replacements: [Id_Beneficio, Id_Beneficio],
        type: QueryTypes.SELECT,
      });

      if (existingBenefit.length > 0) {
        return res.status(400).json({ error: 'El beneficio con este ID ya existe' });
      }

      // Actualizar el beneficio
      await sequelize.query(
        'UPDATE tbl_lineas_de_beneficio SET Nombre_Beneficio = ?, Tipo_Beneficio = ?, Monto_Beneficio = ?, Responsable_Beneficio = ?, Creado_Por = ?, Fecha_Creacion = ?, Modificado_Por = ?, Fecha_Modificacion = ?, Estado = ? WHERE Id_Beneficio = ?',
        {
          replacements: [Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado, Id_Beneficio],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Beneficio actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el beneficio:', error);
      res.status(500).json({ error: 'Error al actualizar el beneficio' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Beneficio } = req.body;

    try {
      // Eliminar el beneficio
      await sequelize.query('DELETE FROM tbl_lineas_de_beneficio WHERE Id_Beneficio = ?', {
        replacements: [Id_Beneficio],
        type: QueryTypes.DELETE,
      });

      return res.status(200).json({ message: 'Beneficio eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el beneficio:', error);
      return res.status(500).json({ error: 'Error al eliminar el beneficio' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
