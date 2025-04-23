import jwt from 'jsonwebtoken'; // Importar JWT
import { cryptPassword } from '../../lib/helpers';
import { enviarCorreo } from '../../utils/emailSender';
import { enviarCorreoBienvenida } from '../api/enviarCorreoBienvenida'; // Función para enviar correo

const sequelize = require('../../../database/database');
const { QueryTypes } = require('sequelize');

const SECRET_KEY = process.env.JWT_SECRET; // Clave secreta del token

// 🔒 Middleware para validar token JWT
const verificarToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  
  console.log("🔹 Token recibido en el backend:", token); 
  console.log("🔹 Clave secreta (SECRET_KEY):", SECRET_KEY);

  if (!token) throw { status: 401, message: "No autorizado: Token requerido" };

  try {
      return jwt.verify(token, SECRET_KEY);
  } catch (error) {
      console.error("🚨 Error al verificar el token:", error);  // Mostrar error en consola
      throw { status: 403, message: "Token inválido o expirado" };
  }
};


export default async function handler(req, res) {
  try {
    // Verificar y decodificar el token
    const decoded = verificarToken(req);
    const idUsuarioSolicitante = decoded.id; // Usuario autenticado

    // Obtener el correo del superusuario desde la configuración
    const superuserConfig = await sequelize.query(
      'SELECT Valor FROM tbl_configuracion WHERE Clave = "CORREO_SUPUER_USUARIO"',
      { type: QueryTypes.SELECT }
    );


    const superuserEmail = superuserConfig[0]?.Valor;
    console.log("superuserEmail:", superuserEmail);
    console.log("idUsuarioSolicitante:", idUsuarioSolicitante);
    // Obtener los datos del usuario autenticado
    const usuarioSolicitante = await sequelize.query(
      'SELECT Correo, Id_Rol FROM tbl_usuario WHERE Id_Usuario = ?',
      { replacements: [idUsuarioSolicitante], type: QueryTypes.SELECT }
    );

    if (usuarioSolicitante.length === 0) {
      return res.status(403).json({ error: "Usuario no autorizado" });
    }

    const { Correo: correoSolicitante, Id_Rol: rolSolicitante } = usuarioSolicitante[0];
    const esSuperUsuario = correoSolicitante === superuserEmail;

    if (req.method === 'GET') {
      const { usuario, correo } = req.query;

      if (usuario || correo) {
        // Buscar usuarios excluyendo superusuarios si no es superusuario
        console.log("info"," Buscar usuarios excluyendo superusuarios si no es superusuario:");
        const existingUser = await sequelize.query(
          `SELECT u.*, e.Descripcion AS EstadoDisplay
           FROM tbl_usuario u
           LEFT JOIN tbl_estado_usuario e ON u.Id_EstadoUsuario = e.Id_EstadoUsuario
           WHERE (u.Usuario = ? OR u.Correo = ?)
           ${esSuperUsuario ? '' : 'AND u.Correo <> ?'} order by u.Fecha_Creacion DESC`,
          { 
            replacements: esSuperUsuario ? [usuario, correo] : [usuario, correo, superuserEmail], 
            type: QueryTypes.SELECT 
          }
        );
        return res.status(200).json(existingUser);
      }

// Obtener todos los usuarios excluyendo superusuarios si no es superusuario
const usuarios = await sequelize.query(
  `SELECT u.*, e.Descripcion AS EstadoDisplay
   FROM tbl_usuario u
   LEFT JOIN tbl_estado_usuario e ON u.Id_EstadoUsuario = e.Id_EstadoUsuario 
   ${esSuperUsuario ? '' : 'WHERE u.Correo <> ?'}   order by u.Fecha_Creacion DESC`,
  { replacements: esSuperUsuario ? [] : [superuserEmail], type: QueryTypes.SELECT }
);


      res.status(200).json(usuarios);
    } 
    else if (req.method === 'POST') {

      
      const { Id_Rol, Id_EstadoUsuario, Usuario, Nombre_Usuario, Contrasena, Correo, Creado_Por } = req.body;
  
      try {
        console.log("✅ Datos recibidos en el backend:", req.body); // Debugging
  
        const existingUser = await sequelize.query(
          'SELECT * FROM tbl_usuario WHERE Usuario = ? and Id_EstadoUsuario <> 3',
          { replacements: [Usuario], type: QueryTypes.SELECT }
        );
  
        if (existingUser.length > 0) {
          return res.status(400).json({ error: 'El nombre de usuario ya existe' });
        }

            // Verificar si el correo ya existe
    const existingEmail = await sequelize.query(
      'SELECT * FROM tbl_usuario WHERE Correo = ? and Id_EstadoUsuario <> 3',
      { replacements: [Correo], type: QueryTypes.SELECT }
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
  
        // INSERT del nuevo usuario
        await sequelize.query(
          `INSERT INTO tbl_usuario (Id_Rol, Id_EstadoUsuario, Usuario, Nombre_Usuario, Contrasena, Correo, Creado_Por, Fecha_Creacion) 
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          { replacements: [Id_Rol, Id_EstadoUsuario, Usuario, Nombre_Usuario, Contrasena, Correo, Creado_Por], type: QueryTypes.INSERT }
        );

     // Mensaje para el correo de bienvenida
     const mensaje = `
     <h1>Bienvenido a Fundación Intur</h1>
     <p>Estimado/a <strong>${Nombre_Usuario}</strong>,</p>
     <p>Tu cuenta ha sido creada exitosamente. Tu contraseña inicial es:</p>
     <p><strong>${Contrasena}</strong></p>
     <p>Por razones de seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión.</p>
     <p>Inicia sesión en la plataforma <a href="http://localhost:3000">aquí</a>.</p>
     <p>Saludos,</p>
     <p>Equipo de Fundación Intur</p>
   `;

   // Enviar correo de bienvenida
 ///  await enviarCorreoBienvenida(Correo, 'Bienvenido a Fundación Intur', mensaje);
  
        return res.status(201).json({ message: "Usuario creado exitosamente" });
  
      } catch (error) {
        console.error("🚨 Error en la API POST:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
  }
  

    else if (req.method === 'PUT') {
      const { Id_Usuario, Id_Rol, Id_EstadoUsuario, Correo, Modificado_Por } = req.body;

      // Proteger modificación del superusuario
      if (!esSuperUsuario && Correo === superuserEmail) {
        return res.status(403).json({ error: "No tienes permisos para modificar el superusuario." });
      }

      // Actualizar usuario
      await sequelize.query(
        `UPDATE tbl_usuario SET Id_Rol = ?, Id_EstadoUsuario = ?, Correo = ?, Modificado_Por = ?, Fecha_Modificacion = NOW() 
         WHERE Id_Usuario = ?`,
        { replacements: [Id_Rol, Id_EstadoUsuario, Correo, Modificado_Por, Id_Usuario], type: QueryTypes.UPDATE }
      );

      res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } 

    else if (req.method === 'DELETE') {
      const { Id_Usuario } = req.body;

      // Obtener usuario a eliminar
      const usuarioData = await sequelize.query(
        'SELECT Correo FROM tbl_usuario WHERE Id_Usuario = ?',
        { replacements: [Id_Usuario], type: QueryTypes.SELECT }
      );

      if (usuarioData.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const correoUsuario = usuarioData[0].Correo;

      // Bloquear eliminación del superusuario por parte de un administrador normal
      if (!esSuperUsuario && correoUsuario === superuserEmail) {
        return res.status(403).json({ error: "No tienes permisos para eliminar al superusuario." });
      }

      // Cambiar el estado en lugar de eliminar físicamente
      await sequelize.query(
        'UPDATE tbl_usuario SET Id_EstadoUsuario = 3 WHERE Id_Usuario = ?',
        { replacements: [Id_Usuario], type: QueryTypes.UPDATE }
      );

      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } 

    else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
}
