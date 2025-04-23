const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');
const { registrarBitacora } = require('../../../utils/bitacoraHelper');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const municipios = await sequelize.query(
        `SELECT m.Fecha_Creacion, m.Id_Municipio, m.Id_Departamento, m.Nombre_Municipio, d.Nombre_Departamento, m.Estado
         FROM tbl_municipio m
         JOIN tbl_departamento d ON m.Id_Departamento = d.Id_Departamento
         ORDER BY m.Fecha_Creacion DESC`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).json(municipios);
    } catch (error) {
      console.error('Error al obtener los municipios:', error);
      res.status(500).json({ error: 'Error al obtener los municipios' });
    }
  } else if (req.method === 'POST') {
    const { Id_Departamento, Nombre_Municipio, Estado, Creado_Por } = req.body;

    if (!Id_Departamento || !Nombre_Municipio) {
      return res.status(400).json({ error: 'Faltan datos para crear el municipio' });
    }

    try {
      await sequelize.query(
        'INSERT INTO tbl_municipio (Id_Departamento, Nombre_Municipio, Estado, Fecha_Creacion, Fecha_Modificacion) VALUES (?, ?, ?, NOW(), NOW())',
        {
          replacements: [Id_Departamento, Nombre_Municipio, Estado],
          type: QueryTypes.INSERT,
        }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: 'MUNICIPIOS',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: { Id_Departamento, Nombre_Municipio, Estado },
        Detalle: `Se creó el municipio: ${Nombre_Municipio}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(201).json({ message: 'Municipio creado con éxito' });
    } catch (error) {
      console.error('Error al crear el municipio:', error);
      res.status(500).json({ error: 'Error al crear el municipio' });
    }
  } else if (req.method === 'PUT') {
    const { Id_Municipio, Id_Departamento, Nombre_Municipio, Estado, Modificado_Por } = req.body;

    if (!Id_Municipio || !Id_Departamento || !Nombre_Municipio) {
      return res.status(400).json({ error: 'Faltan datos para actualizar el municipio' });
    }

    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_municipio WHERE Id_Municipio = ?',
        { replacements: [Id_Municipio], type: QueryTypes.SELECT }
      );

      await sequelize.query(
        'UPDATE tbl_municipio SET Id_Departamento = ?, Nombre_Municipio = ?, Estado = ?, Fecha_Modificacion = NOW() WHERE Id_Municipio = ?',
        {
          replacements: [Id_Departamento, Nombre_Municipio, Estado, Id_Municipio],
          type: QueryTypes.UPDATE,
        }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'MUNICIPIOS',
        Tipo_Accion: 'UPDATE',
        Data_Antes: dataAntes[0],
        Data_Despues: { Id_Departamento, Nombre_Municipio, Estado },
        Detalle: `Se actualizó el municipio ID: ${Id_Municipio}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(200).json({ message: 'Municipio actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el municipio:', error);
      res.status(500).json({ error: 'Error al actualizar el municipio' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Municipio, Modificado_Por } = req.body;

    if (!Id_Municipio) {
      return res.status(400).json({ error: 'Falta el ID del municipio para eliminar' });
    }

    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_municipio WHERE Id_Municipio = ?',
        { replacements: [Id_Municipio], type: QueryTypes.SELECT }
      );

      await sequelize.query('DELETE FROM tbl_municipio WHERE Id_Municipio = ?', {
        replacements: [Id_Municipio],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'MUNICIPIOS',
        Tipo_Accion: 'DELETE',
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se eliminó el municipio ID: ${Id_Municipio}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(200).json({ message: 'Municipio eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el municipio:', error);
      res.status(500).json({ error: 'Error al eliminar el municipio' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
