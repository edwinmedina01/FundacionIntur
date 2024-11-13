const sequelize = require('../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const usuarios = await sequelize.query('SELECT * FROM tbl_tipopersona', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  } else if (req.method === 'POST') {
    let { Tipo_Persona, Descripcion, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado } = req.body;

    try {
      // Asignar la fecha actual si no se pasó Fecha_Creacion
      if (!Fecha_Creacion) {
        Fecha_Creacion = new Date().toISOString().split('T')[0];
      }
      // Asignar null a Fecha_Modificacion si no se proporciona
      if (!Fecha_Modificacion) {
        Fecha_Modificacion = null;
      }

      // Verificar si el tipo de persona ya existe
      const existingUser = await sequelize.query('SELECT * FROM tbl_tipopersona WHERE Tipo_Persona = ?', {
        replacements: [Tipo_Persona],
        type: QueryTypes.SELECT,
      });

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'El tipo de persona ya existe' });
      }

      // Insertar nuevo tipo de persona
      await sequelize.query('INSERT INTO tbl_tipopersona (Tipo_Persona, Descripcion, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)', {
        replacements: [Tipo_Persona, Descripcion, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado],
        type: QueryTypes.INSERT,
      });
      res.status(201).json({ message: 'Tipo de persona creado con éxito' });
    } catch (error) {
      console.error('Error al crear el tipo de persona:', error);
      res.status(500).json({ error: 'Error al crear el tipo de persona' });
    }
  } else if (req.method === 'PUT') {
    let { Id_Tipo_Persona, Tipo_Persona, Descripcion, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado } = req.body;

    try {
      // Asignar la fecha actual a Fecha_Modificacion si no se proporciona
      if (!Fecha_Modificacion) {
        Fecha_Modificacion = new Date().toISOString().split('T')[0];
      }

      // Verificar si el tipo de persona con Id_Tipo_Persona existe
      const existingUser = await sequelize.query('SELECT * FROM tbl_tipopersona WHERE Id_Tipo_Persona = ?', {
        replacements: [Id_Tipo_Persona],
        type: QueryTypes.SELECT,
      });

      if (existingUser.length === 0) {
        return res.status(404).json({ error: 'El tipo de persona no existe' });
      }

      // Actualizar tipo de persona
      await sequelize.query(
        'UPDATE tbl_tipopersona SET Tipo_Persona = ?, Descripcion = ?, Creado_Por = ?, Fecha_Creacion = ?, Modificado_Por = ?, Fecha_Modificacion = ?, Estado = ? WHERE Id_Tipo_Persona = ?',
        {
          replacements: [Tipo_Persona, Descripcion, Creado_Por, Fecha_Creacion, Modificado_Por, Fecha_Modificacion, Estado, Id_Tipo_Persona],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Tipo de persona actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el tipo de persona:', error);
      res.status(500).json({ error: 'Error al actualizar el tipo de persona' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Tipo_Persona } = req.body;

    try {
      await sequelize.query('DELETE FROM tbl_tipopersona WHERE Id_Tipo_Persona = ?', {
        replacements: [Id_Tipo_Persona],
        type: QueryTypes.DELETE,
      });

      return res.status(200).json({ message: 'Tipo de persona eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el tipo de persona:', error);
      return res.status(500).json({ error: 'Error al eliminar el tipo de persona' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
