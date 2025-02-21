const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener roles
    try {
      const roles = await sequelize.query('SELECT * FROM tbl_roles', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(roles);
    } catch (error) {
      console.error('Error al obtener los roles:', error);
      res.status(500).json({ error: 'Error al obtener los roles' });
    }
  } 
  
  else if (req.method === 'POST') {
    // Crear nuevo rol
    const { Rol, Descripcion, Estado, Creado_Por } = req.body;

    try {
      // Validar que 'Creado_Por' esté presente
 

      // Obtener fecha actual del servidor (YYYY-MM-DD)
      const fechaCreacion = new Date().toISOString().split("T")[0];

      // Verificar si el nombre del rol ya existe
      const existeRol = await sequelize.query(
        'SELECT COUNT(*) as count FROM tbl_roles WHERE Rol = ?',
        { replacements: [Rol], type: QueryTypes.SELECT }
      );

      if (existeRol[0].count > 0) {
        return res.status(400).json({ error: 'El nombre del rol ya existe. Debe ser único.' });
      }

      // Insertar nuevo rol con fecha de creación y usuario creador
      await sequelize.query(
        'INSERT INTO tbl_roles (Rol, Descripcion, Estado, Creado_Por, Fecha_Creacion) VALUES (?, ?, ?, ?, ?)', 
        { replacements: [Rol, Descripcion, Estado, Creado_Por, fechaCreacion], type: QueryTypes.INSERT }
      );

      res.status(201).json({ message: 'Rol creado con éxito' });

    } catch (error) {
      console.error('Error al crear el rol:', error);
      res.status(500).json({ error: 'Error al crear el rol' });
    }
  } 
  
  else if (req.method === 'PUT') {
    // Actualizar un rol
    const { Id_Rol, Rol, Descripcion, Estado, Modificado_Por } = req.body;

    try {
      // Validar que 'Modificado_Por' esté presente
      // if (!Modificado_Por || Modificado_Por.trim() === "") {
      //   return res.status(400).json({ error: 'Debe especificar quién modifica el rol.' });
      // }

      // Obtener fecha actual del servidor (YYYY-MM-DD)
      const fechaModificacion = new Date().toISOString().split("T")[0];

      // Verificar si el nuevo nombre del rol ya existe en otro registro
      const existeRol = await sequelize.query(
        'SELECT COUNT(*) as count FROM tbl_roles WHERE Rol = ? AND Id_Rol != ?',
        { replacements: [Rol, Id_Rol], type: QueryTypes.SELECT }
      );

      if (existeRol[0].count > 0) {
        return res.status(400).json({ error: 'El nombre del rol ya existe. Debe ser único.' });
      }

      // Actualizar el rol con fecha de modificación y usuario modificador
      await sequelize.query(
        'UPDATE tbl_roles SET Rol = ?, Descripcion = ?, Estado = ?, Modificado_Por = ?, Fecha_Modificacion = ? WHERE Id_Rol = ?', 
        { replacements: [Rol, Descripcion, Estado, Modificado_Por, fechaModificacion, Id_Rol], type: QueryTypes.UPDATE }
      );

      res.status(200).json({ message: 'Rol actualizado con éxito' });

    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      res.status(500).json({ error: 'Error al actualizar el rol' });
    }
  } 
  
  else if (req.method === 'DELETE') {
    // Eliminar un rol
    const { Id_Rol } = req.body;

    try {
      await sequelize.query('DELETE FROM tbl_roles WHERE Id_Rol = ?', {
        replacements: [Id_Rol],
        type: QueryTypes.DELETE,
      });

      res.status(200).json({ message: 'Rol eliminado exitosamente' });

    } catch (error) {
      console.error('Error al eliminar el rol:', error);
      res.status(500).json({ error: 'Error al eliminar el rol' });
    }
  } 
  
  else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
