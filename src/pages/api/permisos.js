const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rolId } = req.query;
    // Obtener todos los permisos
    try {
      let permisos;

      if (rolId) {
        // Obtener permisos filtrados por rolId
        permisos = await sequelize.query(
          `SELECT Id_Permiso, Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar 
           FROM tbl_permisos WHERE Id_Rol = ?`,
          {
            replacements: [rolId],
            type: QueryTypes.SELECT,
          }
        );
      } else {
        // Obtener todos los permisos si no se proporciona rolId
        permisos = await sequelize.query(
          'SELECT Id_Permiso, Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar FROM tbl_permisos',
          {
            type: QueryTypes.SELECT,
          }
        );
      }

      res.status(200).json(permisos);
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
      res.status(500).json({ error: 'Error al obtener los permisos' });
    }
  } else if (req.method === 'POST') {
    // Crear un nuevo permiso
    const { Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar } = req.body;

    // Validar que se proporcionen los campos necesarios
    if (!Id_Rol || !Id_Objeto) {
      return res.status(400).json({ error: 'Faltan campos requeridos: Id_Rol o Id_Objeto' });
    }

    try {
      // Verificar si el Id_Rol existe
      const rolExists = await sequelize.query('SELECT COUNT(*) as count FROM tbl_roles WHERE Id_Rol = ?', {
        replacements: [Id_Rol],
        type: QueryTypes.SELECT,
      });

      if (rolExists[0].count === 0) {
        return res.status(400).json({ error: 'El Id_Rol proporcionado no existe' });
      }

      // Verificar si el Id_Objeto existe
      const objetoExists = await sequelize.query('SELECT COUNT(*) as count FROM tbl_objetos WHERE Id_Objeto = ?', {
        replacements: [Id_Objeto],
        type: QueryTypes.SELECT,
      });

      if (objetoExists[0].count === 0) {
        return res.status(400).json({ error: 'El Id_Objeto proporcionado no existe' });
      }

      // Verificar si el rol y objeto ya tienen un permiso registrado
      const permisoExists = await sequelize.query('SELECT COUNT(*) as count FROM tbl_permisos WHERE Id_Rol = ? AND Id_Objeto = ?', {
        replacements: [Id_Rol, Id_Objeto],
        type: QueryTypes.SELECT,
      });

      if (permisoExists[0].count > 0) {
        return res.status(400).json({ error: 'Ya existe un permiso para este Id_Rol y Id_Objeto' });
      }

      // Asignar valores por defecto a los permisos si no se proporcionan
      const insertPermiso = Permiso_Insertar !== undefined ? Permiso_Insertar : false;
      const updatePermiso = Permiso_Actualizar !== undefined ? Permiso_Actualizar : false;
      const deletePermiso = Permiso_Eliminar !== undefined ? Permiso_Eliminar : false;
      const consultPermiso = Permiso_Consultar !== undefined ? Permiso_Consultar : false;

      await sequelize.query(
        'INSERT INTO tbl_permisos (Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar) VALUES (?, ?, ?, ?, ?, ?)',
        {
          replacements: [Id_Rol, Id_Objeto, insertPermiso, updatePermiso, deletePermiso, consultPermiso],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Permiso creado con éxito' });
    } catch (error) {
      console.error('Error al crear el permiso:', error);
      res.status(500).json({ error: 'Error al crear el permiso' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un permiso existente
    const { Id_Permiso, Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar } = req.body;

    // Validar que se proporcionen los campos necesarios
    if (!Id_Permiso || !Id_Rol || !Id_Objeto) {
      return res.status(400).json({ error: 'Faltan campos requeridos: Id_Permiso, Id_Rol o Id_Objeto' });
    }

    try {
      // Verificar si el Id_Rol existe
      const rolExists = await sequelize.query('SELECT COUNT(*) as count FROM tbl_roles WHERE Id_Rol = ?', {
        replacements: [Id_Rol],
        type: QueryTypes.SELECT,
      });

      if (rolExists[0].count === 0) {
        return res.status(400).json({ error: 'El Id_Rol proporcionado no existe' });
      }

      // Verificar si el Id_Objeto existe
      const objetoExists = await sequelize.query('SELECT COUNT(*) as count FROM tbl_objetos WHERE Id_Objeto = ?', {
        replacements: [Id_Objeto],
        type: QueryTypes.SELECT,
      });

      if (objetoExists[0].count === 0) {
        return res.status(400).json({ error: 'El Id_Objeto proporcionado no existe' });
      }

      // Asignar valores por defecto a los permisos si no se proporcionan
      const insertPermiso = Permiso_Insertar !== undefined ? Permiso_Insertar : false;
      const updatePermiso = Permiso_Actualizar !== undefined ? Permiso_Actualizar : false;
      const deletePermiso = Permiso_Eliminar !== undefined ? Permiso_Eliminar : false;
      const consultPermiso = Permiso_Consultar !== undefined ? Permiso_Consultar : false;

      await sequelize.query(
        'UPDATE tbl_permisos SET Id_Rol = ?, Id_Objeto = ?, Permiso_Insertar = ?, Permiso_Actualizar = ?, Permiso_Eliminar = ?, Permiso_Consultar = ? WHERE Id_Permiso = ?',
        {
          replacements: [Id_Rol, Id_Objeto, insertPermiso, updatePermiso, deletePermiso, consultPermiso, Id_Permiso],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Permiso actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el permiso:', error);
      res.status(500).json({ error: 'Error al actualizar el permiso' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar un permiso
    const { Id_Permiso } = req.body;

    // Validar que se proporciona el Id_Permiso
    if (!Id_Permiso) {
      return res.status(400).json({ error: 'Falta el Id_Permiso' });
    }

    try {
      await sequelize.query('DELETE FROM tbl_permisos WHERE Id_Permiso = ?', {
        replacements: [Id_Permiso],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Permiso eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el permiso:', error);
      res.status(500).json({ error: 'Error al eliminar el permiso' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
