const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener usuarios
    try {
      const usuarios = await sequelize.query('SELECT * FROM tbl_usuario', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  } else if (req.method === 'POST') {
    // Crear nuevo usuario
    const { Id_Rol, Id_EstadoUsuario, Usuario, Nombre_Usuario, Contrasena,Correo,} = req.body;
    try {
      await sequelize.query('INSERT INTO tbl_usuario (Id_EstadoUsuario,Id_Rol,Usuario, Nombre_Usuario, Contrasena, Correo) VALUES (?, ?, ?, ?, ?, ?)', {
        replacements: [Id_EstadoUsuario,Id_Rol, Usuario, Nombre_Usuario, Contrasena, Correo],
        type: QueryTypes.INSERT,
      });
      res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un usuario
    const { Id_Usuario, Id_Rol, Id_EstadoUsuario, Id_Persona, Usuario, Nombre_Usuario, Contrasena, Intentos_Fallidos, Fecha_Ultima_Conexion, Preguntas_Contestadas, Primer_Ingreso, Fecha_Vencimiento, Correo, Modificado_Por, Fecha_Modificacion } = req.body; // Destructurar los valores del cuerpo
    try {
      // Actualiza el usuario utilizando los parámetros recibidos
      await sequelize.query('UPDATE tbl_usuario SET Id_Rol = ?, Id_EstadoUsuario = ?, Id_Persona = ?, Usuario = ?, Nombre_Usuario = ?, Contrasena = ?, Intentos_Fallidos = ?, Fecha_Ultima_Conexion = ?, Preguntas_Contestadas = ?, Primer_Ingreso = ?, Fecha_Vencimiento = ?, Correo = ?, Modificado_Por = ?, Fecha_Modificacion = ? WHERE Id_Usuario = ?', {
        replacements: [Id_Rol, Id_EstadoUsuario, Id_Persona, Usuario, Nombre_Usuario, Contrasena, Intentos_Fallidos, Fecha_Ultima_Conexion, Preguntas_Contestadas, Primer_Ingreso, Fecha_Vencimiento, Correo, Modificado_Por, Fecha_Modificacion, Id_Usuario], // Asegúrate de que el orden sea correcto
        type: QueryTypes.UPDATE,
      });
      res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  } else if (req.method === 'DELETE') {                 
    // Eliminar un usuario
    const { Id_Usuario } = req.body; // Obtener el ID desde el cuerpo de la solicitud

    try {
      const result = await sequelize.query('DELETE FROM tbl_usuario WHERE Id_Usuario = ?', {
        replacements: [Id_Usuario],
        type: QueryTypes.DELETE,
      });

      return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
