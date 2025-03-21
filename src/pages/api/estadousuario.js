const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener todos los estados de usuario
    try {
      const estadosUsuario = await sequelize.query('SELECT * FROM tbl_estado_usuario where eliminado=0', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(estadosUsuario);
    } catch (error) {
      console.error('Error al obtener los estados de usuario:', error);
      res.status(500).json({ error: 'Error al obtener los estados de usuario' });
    }
  } else if (req.method === 'POST') {
    // Crear un nuevo estado de usuario
    const { Rol, Descripcion, Creado_Por, Fecha_Creacion } = req.body;
    try {
      await sequelize.query('INSERT INTO tbl_estado_usuario (Rol, Descripcion, Creado_Por, Fecha_Creacion) VALUES (?, ?, ?, ?)', {
        replacements: [Rol, Descripcion, Creado_Por, Fecha_Creacion],
        type: QueryTypes.INSERT,
      });
      res.status(201).json({ message: 'Estado de usuario creado con éxito' });
    } catch (error) {
      console.error('Error al crear el estado de usuario:', error);
      res.status(500).json({ error: 'Error al crear el estado de usuario' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un estado de usuario
    const { Id_EstadoUsuario, Rol, Descripcion, Modificado_Por, Fecha_Modificacion } = req.body;
    try {
      await sequelize.query('UPDATE tbl_estado_usuario SET Rol = ?, Descripcion = ?, Modificado_Por = ?, Fecha_Modificacion = ? WHERE Id_EstadoUsuario = ?', {
        replacements: [Rol, Descripcion, Modificado_Por, Fecha_Modificacion, Id_EstadoUsuario],
        type: QueryTypes.UPDATE,
      });
      res.status(200).json({ message: 'Estado de usuario actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el estado de usuario:', error);
      res.status(500).json({ error: 'Error al actualizar el estado de usuario' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar un estado de usuario
    const { Id_EstadoUsuario } = req.body;
    try {
      await sequelize.query('DELETE FROM tbl_estado_usuario WHERE Id_EstadoUsuario = ?', {
        replacements: [Id_EstadoUsuario],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Estado de usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el estado de usuario:', error);
      res.status(500).json({ error: 'Error al eliminar el estado de usuario' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
