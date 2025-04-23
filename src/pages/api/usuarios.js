import jwt from 'jsonwebtoken';
import { cryptPassword } from '../../lib/helpers';
import { enviarCorreo } from '../../utils/emailSender';
import { enviarCorreoBienvenida } from '../api/enviarCorreoBienvenida';
import { registrarBitacora } from '../../utils/bitacoraHelper';

const sequelize = require('../../../database/database');
const { QueryTypes } = require('sequelize');
const BitacoraAccion = require("../../../models/BitacoraAccion");

const SECRET_KEY = process.env.JWT_SECRET;

const verificarToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw { status: 401, message: "No autorizado: Token requerido" };
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw { status: 403, message: "Token inválido o expirado" };
  }
};

export default async function handler(req, res) {
  try {
    const decoded = verificarToken(req);
    const idUsuarioSolicitante = decoded.id;

    const superuserConfig = await sequelize.query(
      'SELECT Valor FROM tbl_configuracion WHERE Clave = "CORREO_SUPUER_USUARIO"',
      { type: QueryTypes.SELECT }
    );
    const superuserEmail = superuserConfig[0]?.Valor;

    const usuarioSolicitante = await sequelize.query(
      'SELECT Correo, Id_Rol FROM tbl_usuario WHERE Id_Usuario = ?',
      { replacements: [idUsuarioSolicitante], type: QueryTypes.SELECT }
    );

    if (usuarioSolicitante.length === 0) return res.status(403).json({ error: "Usuario no autorizado" });

    const { Correo: correoSolicitante, Id_Rol: rolSolicitante } = usuarioSolicitante[0];
    const esSuperUsuario = correoSolicitante === superuserEmail;

    if (req.method === 'GET') {
      const { usuario, correo } = req.query;
      if (usuario || correo) {
        const existingUser = await sequelize.query(
          `SELECT u.*, e.Descripcion AS EstadoDisplay FROM tbl_usuario u
           LEFT JOIN tbl_estado_usuario e ON u.Id_EstadoUsuario = e.Id_EstadoUsuario
           WHERE (u.Usuario = ? OR u.Correo = ?) ${esSuperUsuario ? '' : 'AND u.Correo <> ?'}
           ORDER BY u.Fecha_Creacion DESC`,
          { replacements: esSuperUsuario ? [usuario, correo] : [usuario, correo, superuserEmail], type: QueryTypes.SELECT }
        );
        return res.status(200).json(existingUser);
      }

      const usuarios = await sequelize.query(
        `SELECT u.*, e.Descripcion AS EstadoDisplay FROM tbl_usuario u
         LEFT JOIN tbl_estado_usuario e ON u.Id_EstadoUsuario = e.Id_EstadoUsuario
         ${esSuperUsuario ? '' : 'WHERE u.Correo <> ?'} ORDER BY u.Fecha_Creacion DESC`,
        { replacements: esSuperUsuario ? [] : [superuserEmail], type: QueryTypes.SELECT }
      );
      res.status(200).json(usuarios);
    } 

    else if (req.method === 'POST') {
      const { Id_Rol, Id_EstadoUsuario, Usuario, Nombre_Usuario, Contrasena, Correo, Creado_Por } = req.body;
      try {
        const existingUser = await sequelize.query(
          'SELECT * FROM tbl_usuario WHERE Usuario = ? and Id_EstadoUsuario <> 3',
          { replacements: [Usuario], type: QueryTypes.SELECT }
        );
        if (existingUser.length > 0) return res.status(400).json({ error: 'El nombre de usuario ya existe' });

        const existingEmail = await sequelize.query(
          'SELECT * FROM tbl_usuario WHERE Correo = ? and Id_EstadoUsuario <> 3',
          { replacements: [Correo], type: QueryTypes.SELECT }
        );
        if (existingEmail.length > 0) return res.status(400).json({ error: 'El correo electrónico ya está registrado' });

        await sequelize.query(
          `INSERT INTO tbl_usuario (Id_Rol, Id_EstadoUsuario, Usuario, Nombre_Usuario, Contrasena, Correo, Creado_Por, Fecha_Creacion) 
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          { replacements: [Id_Rol, Id_EstadoUsuario, Usuario, Nombre_Usuario, Contrasena, Correo, Creado_Por], type: QueryTypes.INSERT }
        );

        await registrarBitacora({
          Id_Usuario: idUsuarioSolicitante,
          Modulo: "USUARIO",
          Tipo_Accion: "INSERT",
          Data_Antes: null,
          Data_Despues: { Usuario, Correo, Nombre_Usuario, Id_Rol, Id_EstadoUsuario },
          Detalle: `Creación de nuevo usuario: ${Usuario}`,
          IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          Navegador: req.headers['user-agent']
        });

        return res.status(201).json({ message: "Usuario creado exitosamente" });
      } catch (error) {
        console.error("🚨 Error en la API POST:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    }

    else if (req.method === 'PUT') {
      const { Id_Usuario, Id_Rol, Id_EstadoUsuario, Correo, Modificado_Por } = req.body;

      if (!esSuperUsuario && Correo === superuserEmail) {
        return res.status(403).json({ error: "No tienes permisos para modificar el superusuario." });
      }

      const usuarioAntes = await sequelize.query('SELECT * FROM tbl_usuario WHERE Id_Usuario = ?', {
        replacements: [Id_Usuario],
        type: QueryTypes.SELECT,
      });

      await sequelize.query(
        `UPDATE tbl_usuario SET Id_Rol = ?, Id_EstadoUsuario = ?, Correo = ?, Modificado_Por = ?, Fecha_Modificacion = NOW() 
         WHERE Id_Usuario = ?`,
        { replacements: [Id_Rol, Id_EstadoUsuario, Correo, Modificado_Por, Id_Usuario], type: QueryTypes.UPDATE }
      );

      await registrarBitacora({
        Id_Usuario: idUsuarioSolicitante,
        Modulo: "USUARIO",
        Tipo_Accion: "UPDATE",
        Data_Antes: usuarioAntes[0],
        Data_Despues: { Id_Rol, Id_EstadoUsuario, Correo },
        Detalle: `Modificación de usuario ID ${Id_Usuario}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } 

    else if (req.method === 'DELETE') {
      const { Id_Usuario } = req.body;

      const usuarioData = await sequelize.query(
        'SELECT * FROM tbl_usuario WHERE Id_Usuario = ?',
        { replacements: [Id_Usuario], type: QueryTypes.SELECT }
      );

      if (usuarioData.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

      const correoUsuario = usuarioData[0].Correo;
      if (!esSuperUsuario && correoUsuario === superuserEmail) {
        return res.status(403).json({ error: "No tienes permisos para eliminar al superusuario." });
      }

      await sequelize.query(
        'UPDATE tbl_usuario SET Id_EstadoUsuario = 3 WHERE Id_Usuario = ?',
        { replacements: [Id_Usuario], type: QueryTypes.UPDATE }
      );

      await registrarBitacora({
        Id_Usuario: idUsuarioSolicitante,
        Modulo: "USUARIO",
        Tipo_Accion: "DELETE",
        Data_Antes: usuarioData[0],
        Data_Despues: null,
        Detalle: `Eliminación lógica del usuario ID ${Id_Usuario}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

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