const sequelize = require('../../../../database/database'); 
const { QueryTypes } = require('sequelize');
const { registrarBitacora } = require('../../../utils/bitacoraHelper');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const instituciones = await sequelize.query('SELECT * FROM tbl_instituto ORDER BY Fecha_Creacion DESC', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(instituciones);
    } catch (error) {
      console.error('Error al obtener las instituciones:', error);
      res.status(500).json({ error: 'Error al obtener las instituciones' });
    }
  } else if (req.method === 'POST') {
    const { Nombre_Instituto, Direccion, Telefono, Correo, Director, Estado, Creado_Por } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_instituto (Nombre_Instituto, Direccion, Telefono, Correo, Director, Estado, Fecha_Creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())', 
        {
          replacements: [Nombre_Instituto, Direccion, Telefono, Correo, Director, Estado],
          type: QueryTypes.INSERT,
        }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: 'INSTITUCIONES',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: { Nombre_Instituto, Direccion, Telefono, Correo, Director, Estado },
        Detalle: `Se creó la institución: ${Nombre_Instituto}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(201).json({ message: 'Institución creada con éxito' });
    } catch (error) {
      console.error('Error al crear la institución:', error);
      res.status(500).json({ error: 'Error al crear la institución' });
    }
  } else if (req.method === 'PUT') {
    const { Id_Instituto, Nombre_Instituto, Direccion, Telefono, Correo, Director, Estado, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_instituto WHERE Id_Instituto = ?',
        { replacements: [Id_Instituto], type: QueryTypes.SELECT }
      );

      await sequelize.query(
        'UPDATE tbl_instituto SET Nombre_Instituto = ?, Direccion = ?, Telefono = ?, Correo = ?, Director = ?, Estado = ?, Fecha_Modificacion = NOW() WHERE Id_Instituto = ?', 
        {
          replacements: [Nombre_Instituto, Direccion, Telefono, Correo, Director, Estado, Id_Instituto],
          type: QueryTypes.UPDATE,
        }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'INSTITUCIONES',
        Tipo_Accion: 'UPDATE',
        Data_Antes: dataAntes[0],
        Data_Despues: { Nombre_Instituto, Direccion, Telefono, Correo, Director, Estado },
        Detalle: `Se actualizó la institución ID: ${Id_Instituto}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(200).json({ message: 'Institución actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la institución:', error);
      res.status(500).json({ error: 'Error al actualizar la institución' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Instituto, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_instituto WHERE Id_Instituto = ?',
        { replacements: [Id_Instituto], type: QueryTypes.SELECT }
      );

      await sequelize.query('DELETE FROM tbl_instituto WHERE Id_Instituto = ?', {
        replacements: [Id_Instituto],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'INSTITUCIONES',
        Tipo_Accion: 'DELETE',
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se eliminó la institución ID: ${Id_Instituto}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
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