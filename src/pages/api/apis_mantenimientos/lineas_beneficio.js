const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');
const { registrarBitacora } = require('../../../utils/bitacoraHelper');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const lineasBeneficio = await sequelize.query('SELECT * FROM tbl_lineas_de_beneficio ORDER BY Fecha_Creacion DESC', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(lineasBeneficio);
    } catch (error) {
      console.error('Error al obtener las líneas de beneficio:', error);
      res.status(500).json({ error: 'Error al obtener las líneas de beneficio' });
    }
  } else if (req.method === 'POST') {
    const { Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado, Creado_Por } = req.body;

    try {
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

      await sequelize.query(
        'INSERT INTO tbl_lineas_de_beneficio (Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado, Fecha_Creacion, Fecha_Modificacion) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        {
          replacements: [Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado],
          type: QueryTypes.INSERT,
        }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: 'LINEAS_BENEFICIO',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: { Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado },
        Detalle: `Se creó la línea de beneficio: ${Nombre_Beneficio}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(201).json({ message: 'Línea de beneficio creada con éxito' });
    } catch (error) {
      console.error('Error al crear la línea de beneficio:', error);
      res.status(500).json({ error: 'Error al crear la línea de beneficio' });
    }
  } else if (req.method === 'PUT') {
    const { Id_Beneficio, Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado, Modificado_Por } = req.body;

    try {
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

      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_lineas_de_beneficio WHERE Id_Beneficio = ?',
        { replacements: [Id_Beneficio], type: QueryTypes.SELECT }
      );

      await sequelize.query(
        'UPDATE tbl_lineas_de_beneficio SET Nombre_Beneficio = ?, Tipo_Beneficio = ?, Monto_Beneficio = ?, Responsable_Beneficio = ?, Estado = ?, Fecha_Modificacion = NOW() WHERE Id_Beneficio = ?',
        {
          replacements: [Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado, Id_Beneficio],
          type: QueryTypes.UPDATE,
        }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'LINEAS_BENEFICIO',
        Tipo_Accion: 'UPDATE',
        Data_Antes: dataAntes[0],
        Data_Despues: { Nombre_Beneficio, Tipo_Beneficio, Monto_Beneficio, Responsable_Beneficio, Estado },
        Detalle: `Se actualizó la línea de beneficio ID: ${Id_Beneficio}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(200).json({ message: 'Línea de beneficio actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la línea de beneficio:', error);
      res.status(500).json({ error: 'Error al actualizar la línea de beneficio' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Beneficio, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_lineas_de_beneficio WHERE Id_Beneficio = ?',
        { replacements: [Id_Beneficio], type: QueryTypes.SELECT }
      );

      await sequelize.query('DELETE FROM tbl_lineas_de_beneficio WHERE Id_Beneficio = ?', {
        replacements: [Id_Beneficio],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'LINEAS_BENEFICIO',
        Tipo_Accion: 'DELETE',
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se eliminó la línea de beneficio ID: ${Id_Beneficio}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
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