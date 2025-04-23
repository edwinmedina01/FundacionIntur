import jwt from 'jsonwebtoken'; 
import { registrarBitacora } from '../../../utils/bitacoraHelper';

const sequelize = require('../../../../database/database');
const { QueryTypes } = require('sequelize');

const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta"; 
const ROL_SUPERUSUARIO = "SUPERUSUARIO";

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
    const idUsuario = decoded.id;

    if (req.method === 'GET') {
      try {
        const roles = await sequelize.query(
          `SELECT r.*, e.Nombre_Estado AS EstadoDisplay
           FROM tbl_roles r
           INNER JOIN tbl_diccionario_estados e 
             ON r.Estado = e.Codigo_Estado 
           WHERE e.Tabla_Referencia = 'GENÉRICO'  
             AND r.Rol <> ? order by r.Fecha_Creacion desc`,
          { 
            replacements: [ROL_SUPERUSUARIO], 
            type: QueryTypes.SELECT 
          }
        );
        return res.status(200).json(roles);
      } catch (error) {
        console.error('Error al obtener los roles:', error);
        return res.status(500).json({ error: 'Error al obtener los roles' });
      }
    }

    const { Rol, Id_Rol } = req.body;
    if (Rol === ROL_SUPERUSUARIO || Id_Rol === ROL_SUPERUSUARIO) {
      return res.status(403).json({ error: "No tienes permisos para modificar o eliminar el rol de SUPERUSUARIO." });
    }

    if (req.method === 'POST') {
      const { Descripcion, Estado, Creado_Por } = req.body;
      const fechaCreacion = new Date().toISOString().split("T")[0];

      const existingRole = await sequelize.query(
        `SELECT * FROM tbl_roles WHERE Rol = ?`,
        { replacements: [Rol], type: QueryTypes.SELECT }
      );

      if (existingRole.length > 0) {
        return res.status(400).json({ error: 'El nombre del rol ya existe' });
      }

      await sequelize.query(
        `INSERT INTO tbl_roles (Rol, Descripcion, Estado, Creado_Por, Fecha_Creacion) VALUES (?, ?, ?, ?, ?)`, 
        { replacements: [Rol, Descripcion, Estado, Creado_Por, fechaCreacion], type: QueryTypes.INSERT }
      );

      await registrarBitacora({
        Id_Usuario: idUsuario,
        Modulo: "ROLES",
        Tipo_Accion: "INSERT",
        Data_Antes: null,
        Data_Despues: { Rol, Descripcion, Estado },
        Detalle: `Se ha creado el rol: ${Rol}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      return res.status(201).json({ message: 'Rol creado con éxito' });
    }

    if (req.method === 'PUT') {
      const { Descripcion, Estado, Modificado_Por } = req.body;
      const fechaModificacion = new Date().toISOString().split("T")[0];

      const dataAntes = await sequelize.query(
        `SELECT * FROM tbl_roles WHERE Id_Rol = ?`,
        { replacements: [Id_Rol], type: QueryTypes.SELECT }
      );

      await sequelize.query(
        `UPDATE tbl_roles SET Rol = ?, Descripcion = ?, Estado = ?, Modificado_Por = ?, Fecha_Modificacion = ? WHERE Id_Rol = ?`, 
        { replacements: [Rol, Descripcion, Estado, Modificado_Por, fechaModificacion, Id_Rol], type: QueryTypes.UPDATE }
      );

      await registrarBitacora({
        Id_Usuario: idUsuario,
        Modulo: "ROLES",
        Tipo_Accion: "UPDATE",
        Data_Antes: dataAntes[0],
        Data_Despues: { Rol, Descripcion, Estado },
        Detalle: `Se ha actualizado el rol ID: ${Id_Rol}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      return res.status(200).json({ message: 'Rol actualizado con éxito' });
    }

    if (req.method === 'DELETE') {
      const dataAntes = await sequelize.query(
        `SELECT * FROM tbl_roles WHERE Id_Rol = ?`,
        { replacements: [Id_Rol], type: QueryTypes.SELECT }
      );

      await sequelize.query(`DELETE FROM tbl_roles WHERE Id_Rol = ?`, {
        replacements: [Id_Rol],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: idUsuario,
        Modulo: "ROLES",
        Tipo_Accion: "DELETE",
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se ha eliminado el rol ID: ${Id_Rol}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      return res.status(200).json({ message: 'Rol eliminado exitosamente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error("🚨 Error:", error);
    return res.status(error.status || 500).json({ error: error.message || "Error interno del servidor" });
  }
}
