// permisos.js
import sequelize from '../../../database/database';
import { QueryTypes } from 'sequelize';
import { registrarBitacora } from '../../utils/bitacoraHelper';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rolId } = req.query;
    try {
      let permisos;
      if (rolId) {
        permisos = await sequelize.query(
          `SELECT p.*, o.Objeto, o.Descripcion
           FROM tbl_permisos p
           INNER JOIN tbl_objetos o ON p.Id_Objeto = o.Id_Objeto
           WHERE p.Id_Rol = ? AND p.Estado = 1`,
          { replacements: [rolId], type: QueryTypes.SELECT }
        );
      } else {
        permisos = await sequelize.query(
          'SELECT * FROM tbl_permisos ORDER BY Fecha_Creacion DESC',
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
      if (!Id_Rol || !Id_Objeto || !Creado_Por) return res.status(400).json({ error: 'Campos requeridos faltantes.' });

      const existe = await sequelize.query(
        'SELECT COUNT(*) as count FROM tbl_permisos WHERE Id_Rol = ? AND Id_Objeto = ?',
        { replacements: [Id_Rol, Id_Objeto], type: QueryTypes.SELECT }
      );
      if (existe[0].count > 0) return res.status(400).json({ error: 'Permiso ya registrado.' });

      const fecha = new Date().toISOString().split("T")[0];
      await sequelize.query(
        'INSERT INTO tbl_permisos (Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Creado_Por, Fecha_Creacion, Estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        { replacements: [Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Creado_Por, fecha, Estado], type: QueryTypes.INSERT }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: 'PERMISOS',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: req.body,
        Detalle: `Se asignaron permisos al objeto ${Id_Objeto} para el rol ${Id_Rol}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(201).json({ message: 'Permiso creado con éxito' });
    } catch (error) {
      console.error('Error al crear el permiso:', error);
      res.status(500).json({ error: 'Error al crear el permiso' });
    }
  }

  else if (req.method === 'PUT') {
    const { Id_Permiso, Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Modificado_Por, Estado } = req.body;
    try {
      if (!Id_Permiso || !Id_Rol || !Id_Objeto || !Modificado_Por) return res.status(400).json({ error: 'Campos requeridos faltantes.' });

      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_permisos WHERE Id_Permiso = ?',
        { replacements: [Id_Permiso], type: QueryTypes.SELECT }
      );

      const fecha = new Date().toISOString().split("T")[0];
      await sequelize.query(
        'UPDATE tbl_permisos SET Id_Rol = ?, Id_Objeto = ?, Permiso_Insertar = ?, Permiso_Actualizar = ?, Permiso_Eliminar = ?, Permiso_Consultar = ?, Modificado_Por = ?, Fecha_Modificacion = ?, Estado = ? WHERE Id_Permiso = ?',
        {
          replacements: [Id_Rol, Id_Objeto, Permiso_Insertar, Permiso_Actualizar, Permiso_Eliminar, Permiso_Consultar, Modificado_Por, fecha, Estado, Id_Permiso],
          type: QueryTypes.UPDATE,
        }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'PERMISOS',
        Tipo_Accion: 'UPDATE',
        Data_Antes: dataAntes[0],
        Data_Despues: req.body,
        Detalle: `Se actualizaron los permisos del rol ${Id_Rol} en el objeto ${Id_Objeto}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(200).json({ message: 'Permiso actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el permiso:', error);
      res.status(500).json({ error: 'Error al actualizar el permiso' });
    }
  }

  else if (req.method === 'DELETE') {
    const { Id_Permiso, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_permisos WHERE Id_Permiso = ?',
        { replacements: [Id_Permiso], type: QueryTypes.SELECT }
      );

      await sequelize.query('DELETE FROM tbl_permisos WHERE Id_Permiso = ?', {
        replacements: [Id_Permiso],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'PERMISOS',
        Tipo_Accion: 'DELETE',
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se eliminaron los permisos del ID ${Id_Permiso}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
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
