// objetos.js
import sequelize from '../../../database/database'; 
import { QueryTypes } from 'sequelize';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener todos los objetos
    try {
      const objetos = await sequelize.query('SELECT * FROM tbl_objetos', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(objetos);
    } catch (error) {
      console.error('Error al obtener los objetos:', error);
      res.status(500).json({ error: 'Error al obtener los objetos' });
    }
  } else if (req.method === 'POST') {
    // Crear un nuevo objeto
    const { Objeto, Descripcion, Tipo_Objeto, Estado } = req.body; // Destructurar los valores del cuerpo
    try {


      const objetoExistente = await sequelize.query(
        "SELECT * FROM tbl_objetos WHERE Objeto = ? LIMIT 1",
        {
            replacements: [Objeto],
            type: QueryTypes.SELECT,
        }
    );

    if (objetoExistente.length > 0) {
        return res.status(400).json({
            success: false,
            message: "El objeto ya existe en el sistema.",
        });
    }


      await sequelize.query('INSERT INTO tbl_objetos (Objeto, Descripcion, Tipo_Objeto, Estado) VALUES (?, ?, ?, ?)', {
        replacements: [Objeto, Descripcion, Tipo_Objeto, Estado],
        type: QueryTypes.INSERT,
      });
      res.status(201).json({ message: 'Objeto creado con éxito' });
    } catch (error) {
      console.error('Error al crear el objeto:', error);
      res.status(500).json({ error: 'Error al crear el objeto' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un objeto
    const { Id_Objeto, Objeto, Descripcion, Tipo_Objeto, Estado } = req.body; // Destructurar los valores del cuerpo
    try {
      await sequelize.query('UPDATE tbl_objetos SET Objeto = ?, Descripcion = ?, Tipo_Objeto = ?, Estado = ? WHERE Id_Objeto = ?', {
        replacements: [Objeto, Descripcion, Tipo_Objeto, Estado, Id_Objeto],
        type: QueryTypes.UPDATE,
      });
      res.status(200).json({ message: 'Objeto actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el objeto:', error);
      res.status(500).json({ error: 'Error al actualizar el objeto' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar un objeto
    const { Id_Objeto } = req.body; // Obtener el ID desde el cuerpo de la solicitud
    try {
      await sequelize.query('DELETE FROM tbl_objetos WHERE Id_Objeto = ?', {
        replacements: [Id_Objeto],
        type: QueryTypes.DELETE,
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
