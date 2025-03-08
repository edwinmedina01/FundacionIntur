const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rolId } = req.query;
    try {
      let permisos;
      if (rolId) {
        permisos = await sequelize.query(
          `SELECT * FROM tbl_permisos WHERE Id_Rol = ?`,
          { replacements: [rolId], type: QueryTypes.SELECT }
        );
      } else {
        permisos = await sequelize.query(
          'SELECT * FROM tbl_permisos',
          { type: QueryTypes.SELECT }
        );
      }
      res.status(200).json(permisos);
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
      res.status(500).json({ error: 'Error al obtener los permisos' });
    }
  } 
  
  else if (req.method === 'POST') {
    const { Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Creado_Por, Estado } = req.body;

    try {
      // Validar que los campos requeridos existan
      if (!Id_Rol || !Id_Objeto || !Creado_Por) {
        return res.status(400).json({ error: 'Faltan campos requeridos: Id_Rol, Id_Objeto o Creado_Por' });
      }

      if (isNaN(Id_Rol) || isNaN(Id_Objeto) || isNaN(Creado_Por)) {
        return res.status(400).json({ error: 'Id_Rol, Id_Objeto y Creado_Por deben ser números enteros' });
      }

      // Verificar si ya existe un permiso para ese rol y objeto
      const permisoExists = await sequelize.query(
        'SELECT COUNT(*) as count FROM tbl_permisos WHERE Id_Rol = ? AND Id_Objeto = ?',
        { replacements: [Id_Rol, Id_Objeto], type: QueryTypes.SELECT }
      );

      if (permisoExists[0].count > 0) {
        return res.status(400).json({ error: 'Ya existe un permiso para este Id_Rol y Id_Objeto' });
      }

      // Asignar fecha de creación desde el servidor
      const fechaCreacion = new Date().toISOString().split("T")[0];

      await sequelize.query(
        'INSERT INTO tbl_permisos (Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Creado_Por, Fecha_Creacion,Estado) VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)',
        {
          replacements: [Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Creado_Por, fechaCreacion, Estado],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Permiso creado con éxito' });

    } catch (error) {
      console.error('Error al crear el permiso:', error);
      res.status(500).json({ error: 'Error al crear el permiso' });
    }
  } 
  
  else if (req.method === 'PUT') {
    const { Id_Permiso, Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Modificado_Por, Estado } = req.body;

    try {
      if (!Id_Permiso || !Id_Rol || !Id_Objeto || !Modificado_Por) {
        return res.status(400).json({ error: 'Faltan campos requeridos: Id_Permiso, Id_Rol, Id_Objeto o Modificado_Por, Estado' });
      }

      if (isNaN(Id_Permiso) || isNaN(Id_Rol) || isNaN(Id_Objeto) || isNaN(Modificado_Por)) {
        return res.status(400).json({ error: 'Id_Permiso, Id_Rol, Id_Objeto y Modificado_Por deben ser números enteros' });
      }

      // Verificar si el nuevo rol y objeto ya tienen un permiso registrado
      const permisoExists = await sequelize.query(
        'SELECT COUNT(*) as count FROM tbl_permisos WHERE Id_Rol = ? AND Id_Objeto = ? AND Id_Permiso != ?',
        { replacements: [Id_Rol, Id_Objeto, Id_Permiso], type: QueryTypes.SELECT }
      );

      if (permisoExists[0].count > 0) {
        return res.status(400).json({ error: 'Ya existe un permiso para este Id_Rol y Id_Objeto' });
      }

      // Asignar fecha de modificación desde el servidor
      const fechaModificacion = new Date().toISOString().split("T")[0];

      await sequelize.query(
        'UPDATE tbl_permisos SET Id_Rol = ?, Id_Objeto = ?, Permiso_Insertar = ?, Permiso_Actualizar = ?, Permiso_Eliminar = ?, Permiso_Consultar = ?, Modificado_Por = ?, Fecha_Modificacion = ? , Estado = ? WHERE Id_Permiso = ?',
        {
          replacements: [Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Modificado_Por, fechaModificacion,Estado, Id_Permiso],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Permiso actualizado con éxito' });

    } catch (error) {
      console.error('Error al actualizar el permiso:', error);
      res.status(500).json({ error: 'Error al actualizar el permiso' });
    }
  } 
  
  else if (req.method === 'DELETE') {
    const { Id_Permiso } = req.body;

    try {
      if (!Id_Permiso || isNaN(Id_Permiso)) {
        return res.status(400).json({ error: 'Falta un Id_Permiso válido' });
      }

      await sequelize.query('DELETE FROM tbl_permisos WHERE Id_Permiso = ?', {
        replacements: [Id_Permiso],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Permiso eliminado exitosamente' });

    } catch (error) {
      console.error('Error al eliminar el permiso:', error);
      res.status(500).json({ error: 'Error al eliminar el permiso' });
    }
  } 
  
  else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
