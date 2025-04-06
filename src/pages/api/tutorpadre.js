import Persona from '../../../models/Persona'; // Asegúrate de tener el modelo Persona bien configurado
const sequelize = require('../../../database/database'); 
import {deepSort} from '../../utils/deepSort';


export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Obtener todas las personas con Id_Tipo_Persona = 3 y que tengan datos de estudiantes asociados
        const [personas] = await sequelize.query(
          `SELECT 
            p.Fecha_Creacion,
            r.Id as Id_Relacion,
            r.Estado,
            p.Id_Persona,
            p.Id_Municipio,
            p.Id_Tipo_Persona,
            p.Id_Departamento,
            p.Primer_Nombre AS Persona_Nombre,
            p.Segundo_Nombre AS Persona_Segundo_Nombre,
            p.Primer_Apellido AS Persona_Apellido,
            p.Segundo_Apellido AS Persona_Segundo_Apellido,
            p.Sexo,
            p.Fecha_Nacimiento,
            p.Lugar_Nacimiento,
            p.Identidad,
            p.telefono AS Persona_Telefono,
            p.direccion AS Persona_Direccion,
            e.Id_Estudiante,
            e.Id_Beneficio,
            e.Id_Area,
            e.Id_Instituto,
            ep.Primer_Nombre AS Estudiante_Nombre,
            ep.Primer_Apellido AS Estudiante_Apellido,
            ep.Identidad AS Estudiante_Identidad,
            ep.telefono AS Estudiante_Telefono
          FROM 
            tbl_persona p
          INNER JOIN 
            tbl_relacion r ON p.Id_Persona = r.Id_persona
          INNER JOIN 
            tbl_estudiante e ON r.Id_estudiante = e.Id_Estudiante
          INNER JOIN 
            tbl_persona ep ON e.Id_Persona = ep.Id_Persona
          WHERE 
            p.Id_Tipo_Persona = '2';
          `,
          {}
        );
         const personasorden = deepSort(personas, 'Fecha_Creacion', false);
        console.log(personasorden); // Verifica la respuesta de la base de datos

        if (!personasorden || personasorden.length === 0) {
          return res.status(404).json({ message: 'No se encontraron personas con estudiantes asociados' });
        }



        return res.status(200).json(personasorden);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener las personas' });
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
