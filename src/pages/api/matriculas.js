const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

const Matricula = require('../../../models/Matricula'); // Asegúrate de tener la ruta correcta

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const matriculas = await sequelize.query(
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
        LEFT JOIN tbl_seccion s ON m.Id_Seccion = s.Id_Seccion;
        `,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (matriculas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron matrículas.' });
      }

      res.status(200).json(matriculas);
    } catch (error) {
      console.error('Error al obtener las matrículas:', error.message);
      res.status(500).json({ error: 'Error al obtener las matrículas.' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        Id_Estudiante,
        Id_Modalidad,
        Id_Grado,
        Id_Seccion,
        Fecha_Matricula,
        Estado,
        Creado_Por
      } = req.body;

      const nuevaMatricula = await Matricula.create({
        Id_Estudiante,
        Id_Modalidad,
        Id_Grado,
        Id_Seccion,
        Fecha_Matricula,
        Estado,
        Creado_Por,
        Fecha_Creacion: new Date().toISOString().split('T')[0]
      });

      res.status(201).json({ message: 'Matrícula creada correctamente', matricula: nuevaMatricula });
    } catch (error) {
      console.error('Error al crear la matrícula:', error.message);
      res.status(500).json({ error: 'Error al crear la matrícula.' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        Id_Matricula,
        Id_Estudiante,
        Id_Modalidad,
        Id_Grado,
        Id_Seccion,
        Fecha_Matricula,
        Estado,
        Modificado_Por
      } = req.body;

      const matricula = await Matricula.findByPk(Id_Matricula);

      if (!matricula) {
        return res.status(404).json({ error: 'Matrícula no encontrada.' });
      }

      await matricula.update({
        Id_Estudiante,
        Id_Modalidad,
        Id_Grado,
        Id_Seccion,
        Fecha_Matricula,
        Estado,
        Modificado_Por,
        Fecha_Modificacion: new Date().toISOString().split('T')[0]
      });

      res.status(200).json({ message: 'Matrícula actualizada correctamente', matricula });
    } catch (error) {
      console.error('Error al actualizar la matrícula:', error.message);
      res.status(500).json({ error: 'Error al actualizar la matrícula.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { Id_Matricula } = req.body;

      if (!Id_Matricula) {
        return res.status(400).json({ error: 'ID de matrícula es requerido.' });
      }

      const [matricula] = await sequelize.query(
        `SELECT * FROM tbl_matricula WHERE Id_Matricula = :id`,
        {
          replacements: { id: Id_Matricula },
          type: QueryTypes.SELECT,
        }
      );

      if (!matricula) {
        return res.status(404).json({ error: 'Matrícula no encontrada.' });
      }

      await sequelize.query(
        `DELETE FROM tbl_matricula WHERE Id_Matricula = :id`,
        {
          replacements: { id: Id_Matricula },
          type: QueryTypes.DELETE,
        }
      );

      res.status(200).json({ message: 'Matrícula eliminada exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar la matrícula:', error.message);
      res.status(500).json({ error: 'Error al eliminar la matrícula.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
}