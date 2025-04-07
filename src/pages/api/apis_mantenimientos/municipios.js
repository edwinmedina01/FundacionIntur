// pages/api/apis_mantenimientos/municipios.js

const sequelize = require('../../../../database/database'); // Asegúrate de que la ruta de la base de datos sea correcta
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener municipios con su nombre de departamento
    try {
      const municipios = await sequelize.query(
        `SELECT m.Fecha_Creacion, m.Id_Municipio, m.Id_Departamento, m.Nombre_Municipio, d.Nombre_Departamento, m.Estado
         FROM tbl_municipio m
         JOIN tbl_departamento d ON m.Id_Departamento = d.Id_Departamento
         order by m.Fecha_creacion desc`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).json(municipios);
    } catch (error) {
      console.error('Error al obtener los municipios:', error);
      res.status(500).json({ error: 'Error al obtener los municipios' });
    }
  } else if (req.method === 'POST') {
    // Crear un nuevo municipio
    const { Id_Departamento, Nombre_Municipio, Estado } = req.body;
    
    // Validar que los datos requeridos estén presentes
    if (!Id_Departamento || !Nombre_Municipio) {
      return res.status(400).json({ error: 'Faltan datos para crear el municipio' });
    }
  
    try {
      // Insertar el nuevo municipio con las fechas de creación y modificación
      await sequelize.query(
        'INSERT INTO tbl_municipio (Id_Departamento, Nombre_Municipio, Estado, Fecha_Creacion, Fecha_Modificacion) VALUES (?, ?, ?, NOW(), NOW())',
        {
          replacements: [Id_Departamento, Nombre_Municipio, Estado],
          type: QueryTypes.INSERT,
        }
      );
      res.status(201).json({ message: 'Municipio creado con éxito' });
    } catch (error) {
      console.error('Error al crear el municipio:', error);
      res.status(500).json({ error: 'Error al crear el municipio' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un municipio existente
    const { Id_Municipio, Id_Departamento, Nombre_Municipio, Estado } = req.body;
    
    // Validar que los datos requeridos estén presentes
    if (!Id_Municipio || !Id_Departamento || !Nombre_Municipio) {
      return res.status(400).json({ error: 'Faltan datos para actualizar el municipio' });
    }
  
    try {
      // Actualizar el municipio, incluyendo el estado y la fecha de modificación
      await sequelize.query(
        'UPDATE tbl_municipio SET Id_Departamento = ?, Nombre_Municipio = ?, Estado = ?, Fecha_Modificacion = NOW() WHERE Id_Municipio = ?',
        {
          replacements: [Id_Departamento, Nombre_Municipio, Estado, Id_Municipio],
          type: QueryTypes.UPDATE,
        }
      );
      res.status(200).json({ message: 'Municipio actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el municipio:', error);
      res.status(500).json({ error: 'Error al actualizar el municipio' });
    }
  }
   else if (req.method === 'DELETE') {
    // Eliminar un municipio
    const { Id_Municipio } = req.body;
    
    // Validar que el Id_Municipio esté presente
    if (!Id_Municipio) {
      return res.status(400).json({ error: 'Falta el ID del municipio para eliminar' });
    }

    try {
      await sequelize.query('DELETE FROM tbl_municipio WHERE Id_Municipio = ?', {
        replacements: [Id_Municipio],
        type: QueryTypes.DELETE,
      });
      res.status(200).json({ message: 'Municipio eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el municipio:', error);
      res.status(500).json({ error: 'Error al eliminar el municipio' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
