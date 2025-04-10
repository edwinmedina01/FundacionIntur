// pages/api/matriculabyestudianteid.js

import sequelize from '../../../database/database'; // Asegúrate de tener la ruta correcta de tu archivo de configuración
import { QueryTypes } from 'sequelize'; // Para definir el tipo de consulta

export default async function handler(req, res) {
  // Obtener matrícula por id_estudiante (GET)
  if (req.method === 'GET') {
    try {
      const { id_estudiante } = req.query; // Obtener el id_estudiante de los parámetros de la URL

      if (!id_estudiante) {
        return res.status(400).json({ error: 'El ID del estudiante es requerido.' });
      }

      // Consulta para obtener la matrícula más reciente de un estudiante por su id_estudiante
      const matricula = await sequelize.query(
        `
        SELECT 
          m.Id_Matricula,
          m.Estado,
          mo.Id_Modalidad,
          g.Id_Grado,
          s.Id_Seccion,
          CONCAT(p.Primer_Nombre, ' ', pp.Segundo_Nombre, ' ', pp.Primer_Apellido, ' ', pp.Segundo_Apellido) AS Estudiante,
          mo.Nombre AS Modalidad,
          g.Nombre AS Grado,
          s.Nombre_Seccion AS Seccion,
          m.Fecha_Matricula,
          p.Identidad,
          e.Id_Estudiante
        FROM tbl_matricula m
        LEFT JOIN tbl_estudiante e ON m.Id_Estudiante = e.Id_Estudiante
        LEFT JOIN tbl_persona p ON e.Id_Persona = p.Id_Persona
        LEFT JOIN tbl_persona pp ON e.Id_Persona = pp.Id_Persona  
        LEFT JOIN tbl_modalidad mo ON m.Id_Modalidad = mo.Id_Modalidad
        LEFT JOIN tbl_grado g ON m.Id_Grado = g.Id_Grado
        LEFT JOIN tbl_seccion s ON m.Id_Seccion = s.Id_Seccion
        WHERE e.Id_Estudiante = :id_estudiante
        ORDER BY m.Fecha_Matricula DESC
        LIMIT 1;
        `,
        {
          type: QueryTypes.SELECT,
          replacements: { id_estudiante }, // Parámetro de búsqueda
        }
      );

      // Si no se encuentra matrícula, retornar un error
      if (matricula.length === 0) {
        return res.status(404).json({ error: 'No se encontró matrícula para este estudiante.' });
      }

      // Si se encuentra matrícula, devolver la información
      res.status(200).json(matricula[0]);
    } catch (error) {
      console.error('Error al obtener la matrícula:', error.message);
      res.status(500).json({ error: 'Error al obtener la matrícula.' });
    }
  }

  // Método no permitido
  else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
}
