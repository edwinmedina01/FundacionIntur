const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');
const { registrarBitacora } = require('../../../utils/bitacoraHelper');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const areas = await sequelize.query('SELECT * FROM tbl_area ORDER BY Fecha_creacion DESC', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(areas);
    } catch (error) {
      console.error('Error al obtener las áreas:', error);
      res.status(500).json({ error: 'Error al obtener las áreas' });
    }
  } else if (req.method === 'POST') {
    const { Nombre_Area, Tipo_Area, Responsable_Area, Estado, Creado_Por } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_area (Nombre_Area, Tipo_Area, Responsable_Area, Estado, Fecha_Creacion, Fecha_Modificacion) VALUES (?, ?, ?, ?, NOW(), NOW())',
        {
          replacements: [Nombre_Area, Tipo_Area, Responsable_Area, Estado],
          type: QueryTypes.INSERT,
        }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: 'ÁREAS',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: { Nombre_Area, Tipo_Area, Responsable_Area, Estado },
        Detalle: `Se creó el área: ${Nombre_Area}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(201).json({ message: 'Área creada con éxito' });
    } catch (error) {
      console.error('Error al crear el área:', error);
      res.status(500).json({ error: 'Error al crear el área' });
    }
  } else if (req.method === 'PUT') {
    const { Id_Area, Nombre_Area, Tipo_Area, Responsable_Area, Estado, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_area WHERE Id_Area = ?',
        { replacements: [Id_Area], type: QueryTypes.SELECT }
      );

      await sequelize.query(
        'UPDATE tbl_area SET Nombre_Area = ?, Tipo_Area = ?, Responsable_Area = ?, Estado = ?, Fecha_Modificacion = NOW() WHERE Id_Area = ?',
        {
          replacements: [Nombre_Area, Tipo_Area, Responsable_Area, Estado, Id_Area],
          type: QueryTypes.UPDATE,
        }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'ÁREAS',
        Tipo_Accion: 'UPDATE',
        Data_Antes: dataAntes[0],
        Data_Despues: { Nombre_Area, Tipo_Area, Responsable_Area, Estado },
        Detalle: `Se actualizó el área ID: ${Id_Area}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(200).json({ message: 'Área actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar el área:', error);
      res.status(500).json({ error: 'Error al actualizar el área' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Area, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_area WHERE Id_Area = ?',
        { replacements: [Id_Area], type: QueryTypes.SELECT }
      );

      await sequelize.query('DELETE FROM tbl_area WHERE Id_Area = ?', {
        replacements: [Id_Area],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'ÁREAS',
        Tipo_Accion: 'DELETE',
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se eliminó el área ID: ${Id_Area}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
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
