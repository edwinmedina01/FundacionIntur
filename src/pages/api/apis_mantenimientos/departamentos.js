const sequelize = require('../../../../database/database'); // Asegúrate de que la ruta de la base de datos sea correcta
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener departamentos
    try {
      const departamentos = await sequelize.query('SELECT * FROM tbl_departamento', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(departamentos);
    } catch (error) {
      console.error('Error al obtener los departamentos:', error);
      res.status(500).json({ error: 'Error al obtener los departamentos' });
    }
  } else if (req.method === 'POST') {
    // Crear un nuevo departamento
    const { Nombre_Departamento } = req.body;

    // Validar que el nombre del departamento esté presente
    if (!Nombre_Departamento) {
      return res.status(400).json({ error: 'Falta el nombre del departamento' });
    }

    try {
      // Verificar si ya existe el departamento con el mismo nombre
      const existingDepartamento = await sequelize.query(
        'SELECT * FROM tbl_departamento WHERE Nombre_Departamento = ?',
        {
          replacements: [Nombre_Departamento],
          type: QueryTypes.SELECT,
        }
      );

      if (existingDepartamento.length > 0) {
        return res.status(400).json({ error: 'El departamento ya existe' });
      }

      // Si no existe, insertar el nuevo departamento
      await sequelize.query(
        'INSERT INTO tbl_departamento (Nombre_Departamento) VALUES (?)',
        {
          replacements: [Nombre_Departamento],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Departamento creado con éxito' });
    } catch (error) {
      console.error('Error al crear el departamento:', error);
      res.status(500).json({ error: 'Error al crear el departamento' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un departamento existente
    const { Id_Departamento, Nombre_Departamento } = req.body;

    // Validar que los datos requeridos estén presentes
    if (!Id_Departamento || !Nombre_Departamento) {
      return res.status(400).json({ error: 'Faltan datos para actualizar el departamento' });
    }

    try {
      await sequelize.query(
        'UPDATE tbl_departamento SET Nombre_Departamento = ? WHERE Id_Departamento = ?',
        {
          replacements: [Nombre_Departamento, Id_Departamento],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Departamento actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el departamento:', error);
      res.status(500).json({ error: 'Error al actualizar el departamento' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar un departamento
    const { Id_Departamento } = req.body;

    // Validar que el Id_Departamento esté presente
    if (!Id_Departamento) {
      return res.status(400).json({ error: 'Falta el ID del departamento para eliminar' });
    }

    try {
      await sequelize.query('DELETE FROM tbl_departamento WHERE Id_Departamento = ?', {
        replacements: [Id_Departamento],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Departamento eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el departamento:', error);
      res.status(500).json({ error: 'Error al eliminar el departamento' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
