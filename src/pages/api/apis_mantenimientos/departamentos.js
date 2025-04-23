const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');
const { registrarBitacora } = require('../../../utils/bitacoraHelper');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const departamentos = await sequelize.query('SELECT * FROM tbl_departamento ORDER BY fecha_creacion DESC', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(departamentos);
    } catch (error) {
      console.error('Error al obtener los departamentos:', error);
      res.status(500).json({ error: 'Error al obtener los departamentos' });
    }
  } else if (req.method === 'POST') {
    const { Nombre_Departamento, Creado_Por } = req.body;

    if (!Nombre_Departamento) {
      return res.status(400).json({ error: 'Falta el nombre del departamento' });
    }

    try {
      const existingDepartamento = await sequelize.query(
        'SELECT * FROM tbl_departamento WHERE Nombre_Departamento = ?',
        {
          replacements: [Nombre_Departamento],
          type: QueryTypes.SELECT,
        }
      );

      if (existingDepartamento.length > 0) {
        return res.status(400).json({ error: 'El departamento ya existe' });
      }

      await sequelize.query(
        'INSERT INTO tbl_departamento (Nombre_Departamento, Fecha_Creacion, Fecha_Modificacion) VALUES (?, NOW(), NOW())',
        {
          replacements: [Nombre_Departamento],
          type: QueryTypes.INSERT,
        }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: 'DEPARTAMENTOS',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: { Nombre_Departamento },
        Detalle: `Se creó el departamento: ${Nombre_Departamento}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(201).json({ message: 'Departamento creado con éxito' });
    } catch (error) {
      console.error('Error al crear el departamento:', error);
      res.status(500).json({ error: 'Error al crear el departamento' });
    }
  } else if (req.method === 'PUT') {
    const { Id_Departamento, Nombre_Departamento, Estado, Modificado_Por } = req.body;

    if (!Id_Departamento || !Nombre_Departamento) {
      return res.status(400).json({ error: 'Faltan datos para actualizar el departamento' });
    }

    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_departamento WHERE Id_Departamento = ?',
        { replacements: [Id_Departamento], type: QueryTypes.SELECT }
      );

      await sequelize.query(
        'UPDATE tbl_departamento SET Nombre_Departamento = ?, Estado = ?, Fecha_Modificacion = NOW() WHERE Id_Departamento = ?',
        {
          replacements: [Nombre_Departamento, Estado, Id_Departamento],
          type: QueryTypes.UPDATE,
        }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'DEPARTAMENTOS',
        Tipo_Accion: 'UPDATE',
        Data_Antes: dataAntes[0],
        Data_Despues: { Nombre_Departamento, Estado },
        Detalle: `Se actualizó el departamento ID: ${Id_Departamento}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(200).json({ message: 'Departamento actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el departamento:', error);
      res.status(500).json({ error: 'Error al actualizar el departamento' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Departamento, Modificado_Por } = req.body;

    if (!Id_Departamento) {
      return res.status(400).json({ error: 'Falta el ID del departamento para eliminar' });
    }

    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_departamento WHERE Id_Departamento = ?',
        { replacements: [Id_Departamento], type: QueryTypes.SELECT }
      );

      await sequelize.query('DELETE FROM tbl_departamento WHERE Id_Departamento = ?', {
        replacements: [Id_Departamento],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'DEPARTAMENTOS',
        Tipo_Accion: 'DELETE',
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se eliminó el departamento ID: ${Id_Departamento}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(200).json({ message: 'Departamento eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el departamento:', error);
      res.status(500).json({ error: 'Error al eliminar el departamento' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}