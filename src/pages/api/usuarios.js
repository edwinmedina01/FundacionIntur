import { cryptPassword } from '../../lib/helpers'; // Ajusta la ruta según donde esté tu módulo
const sequelize = require('../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { usuario, correo } = req.query;

    try {

      if (usuario || correo) {
        // Si se pasa un nombre de usuario, verificar si existe
        const existingUser = await sequelize.query(
          'SELECT * FROM tbl_usuario WHERE Usuario = ? OR Correo = ?',
            {
                replacements: [usuario,correo],
                type: QueryTypes.SELECT,
            }
        );

        const userExists = existingUser.some(user => user.Usuario === usuario);
        const emailExists = existingUser.some(user => user.Correo === correo);

        return res.status(200).json({ userExists, emailExists });
    }

      const usuarios = await sequelize.query('SELECT * FROM tbl_usuario', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  } else if (req.method === 'POST') {
    const { Id_Rol, Id_EstadoUsuario, Usuario, Nombre_Usuario, Contrasena, Correo ,Creado_Por} = req.body;

    try {
      const existingUser = await sequelize.query('SELECT * FROM tbl_usuario WHERE Usuario = ?', {
        replacements: [Usuario],
        type: QueryTypes.SELECT,
      });

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe' });
      }

         // Calcular fecha de creación y fecha de vencimiento (por ejemplo, 90 días después)
         const fechaCreacion = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
         const fechaVencimiento = new Date();
         fechaVencimiento.setDate(fechaVencimiento.getDate() + 90); // Sumar 90 días
         const fechaVencimientoISO = fechaVencimiento.toISOString().split("T")[0];

      // Usar cryptPassword para hashear la contraseña
      const hashedPassword = await cryptPassword(Contrasena);

      await sequelize.query('INSERT INTO tbl_usuario (Id_EstadoUsuario, Id_Rol, Usuario, Nombre_Usuario, Contrasena, Correo,Creado_Por, Fecha_Creacion, Fecha_Vencimiento) VALUES (?, ?, ?, ?, ?, ?,?,?,?)', {
        replacements: [Id_EstadoUsuario, Id_Rol, Usuario, Nombre_Usuario, hashedPassword, Correo, Creado_Por,  fechaCreacion,     fechaVencimientoISO],
        type: QueryTypes.INSERT,
      });
      res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  } else if (req.method === 'PUT') {
    const { Id_Usuario, Id_Rol, Id_EstadoUsuario, Id_Persona, Usuario, Nombre_Usuario, Contrasena, Intentos_Fallidos, Fecha_Ultima_Conexion, Preguntas_Contestadas, Primer_Ingreso, Fecha_Vencimiento, Correo, Modificado_Por, Fecha_Modificacion } = req.body;

    try {
        const existingUser = await sequelize.query('SELECT * FROM tbl_usuario WHERE Usuario = ? AND Id_Usuario != ?', {
            replacements: [Usuario, Id_Usuario],
            type: QueryTypes.SELECT,
        });

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya existe' });
        }

        const fecha_Modificacion = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      


        await sequelize.query('UPDATE tbl_usuario SET Id_Rol = ?, Id_EstadoUsuario = ?, Id_Persona = ?,   Correo = ?, Modificado_Por = ?, Fecha_Modificacion = ? WHERE Id_Usuario = ?', {
            replacements: [Id_Rol, Id_EstadoUsuario, Id_Persona, Correo, Modificado_Por, fecha_Modificacion,Id_Usuario],
            type: QueryTypes.UPDATE,
        });
        res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Usuario } = req.body;

    try {
      await sequelize.query('Update tbl_usuario set Id_EstadoUsuario = 3  WHERE Id_Usuario = ?', {
        replacements: [Id_Usuario],
        type: QueryTypes.UPDATE,
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
