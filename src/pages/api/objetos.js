// objetos.js
import sequelize from '../../../database/database'; 
import { QueryTypes } from 'sequelize';
import { registrarBitacora } from '../../utils/bitacoraHelper';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const objetos = await sequelize.query('SELECT * FROM tbl_objetos ORDER BY Fecha_Creacion DESC', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(objetos);
    } catch (error) {
      console.error('Error al obtener los objetos:', error);
      res.status(500).json({ error: 'Error al obtener los objetos' });
    }
  } else if (req.method === 'POST') {
    const { Objeto, Descripcion, Tipo_Objeto, Estado, Creado_Por } = req.body;
    try {
      const objetoExistente = await sequelize.query(
        "SELECT * FROM tbl_objetos WHERE Objeto = ? LIMIT 1",
        { replacements: [Objeto], type: QueryTypes.SELECT }
      );

      if (objetoExistente.length > 0) {
        return res.status(400).json({ success: false, message: "El objeto ya existe en el sistema." });
      }

      await sequelize.query(
        'INSERT INTO tbl_objetos (Objeto, Descripcion, Tipo_Objeto, Estado) VALUES (?, ?, ?, ?)',
        { replacements: [Objeto, Descripcion, Tipo_Objeto, Estado], type: QueryTypes.INSERT }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: "OBJETOS",
        Tipo_Accion: "INSERT",
        Data_Antes: null,
        Data_Despues: { Objeto, Descripcion, Tipo_Objeto, Estado },
        Detalle: `Se ha creado el objeto: ${Objeto}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(201).json({ message: 'Objeto creado con éxito' });
    } catch (error) {
      console.error('Error al crear el objeto:', error);
      res.status(500).json({ error: 'Error al crear el objeto' });
    }
  } else if (req.method === 'PUT') {
    const { Id_Objeto, Objeto, Descripcion, Tipo_Objeto, Estado, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_objetos WHERE Id_Objeto = ?',
        { replacements: [Id_Objeto], type: QueryTypes.SELECT }
      );

      await sequelize.query(
        'UPDATE tbl_objetos SET Objeto = ?, Descripcion = ?, Tipo_Objeto = ?, Estado = ? WHERE Id_Objeto = ?',
        { replacements: [Objeto, Descripcion, Tipo_Objeto, Estado, Id_Objeto], type: QueryTypes.UPDATE }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: "OBJETOS",
        Tipo_Accion: "UPDATE",
        Data_Antes: dataAntes[0],
        Data_Despues: { Objeto, Descripcion, Tipo_Objeto, Estado },
        Detalle: `Se ha actualizado el objeto ID: ${Id_Objeto}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(200).json({ message: 'Objeto actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el objeto:', error);
      res.status(500).json({ error: 'Error al actualizar el objeto' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Objeto, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_objetos WHERE Id_Objeto = ?',
        { replacements: [Id_Objeto], type: QueryTypes.SELECT }
      );

      await sequelize.query('DELETE FROM tbl_objetos WHERE Id_Objeto = ?', {
        replacements: [Id_Objeto],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: "OBJETOS",
        Tipo_Accion: "DELETE",
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se ha eliminado el objeto ID: ${Id_Objeto}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      return res.status(200).json({ message: 'Objeto eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el objeto:', error);
      return res.status(500).json({ error: 'Error al eliminar el objeto' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
