
import Persona from '../../../models/Persona'; // Asegúrate de tener el modelo Persona bien configurado
import Relacion from '../../../models/Relacion'; // Asegúrate de tener el modelo Persona bien configurado
import Estudiante from '../../../models/Estudiante'; // Asegúrate de tener el modelo Persona bien configurado
const sequelize = require('../../../database/database'); 
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Obtener todas las personas con Id_Tipo_Persona = 3
        // const personas = await Persona.qu({
        //   where: {
        //     Id_Tipo_Persona: '3', // Filtro para solo obtener personas de tipo 3
        //   },
        //   attributes: [
        //     'Id_Persona',
        //     'Id_Municipio',
        //     'Id_Tipo_Persona',
        //     'Id_Departamento',
        //     'Primer_Nombre',
        //     'Segundo_Nombre',
        //     'Primer_Apellido',
        //     'Segundo_Apellido',
        //     'Sexo',
        //     'Fecha_Nacimiiento',
        //     'Lugar_Nacimiento',
        //     'Identidad',
        //     'telefono',
        //     'direccion',
        //   ], 
        //   include: [
        //     {
        //       model: Relacion, // Modelo Relacion
        //       as: 'Relaciones', // Alias definido en la asociación
        //       attributes: ['Id_estudiante'], // Solo los campos necesarios de la relación
        //       include: [
        //         {
        //           model: Estudiante, // Modelo Estudiante
        //           as: 'Estudiante', // Alias definido en la asociación
        //           attributes: ['Id_Estudiante', 'Id_Beneficio', 'Id_Area', 'Id_Instituto'], // Campos del estudiante
        //         },
        //       ],
        //     },
        //   ],
          
          
        //   // Los campos que deseas devolver
        // });


        const [personas] = await sequelize.query(
          `SELECT 
          r.Id as Id_Relacion,
  p.Id_Persona,
  p.Id_Municipio,
  p.Id_Tipo_Persona,
  p.Id_Departamento,
  p.Primer_Nombre AS Persona_Nombre,
  p.Segundo_Nombre AS Persona_Segundo_Nombre,
  p.Primer_Apellido AS Persona_Apellido,
  p.Segundo_Apellido AS Persona_Segundo_Apellido,
  p.Sexo,
  p.Fecha_Nacimiiento,
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
LEFT JOIN 
  tbl_relacion r ON p.Id_Persona = r.Id_persona
LEFT JOIN 
  tbl_estudiante e ON r.Id_estudiante = e.Id_Estudiante
LEFT JOIN 
  tbl_persona ep ON e.Id_Persona = ep.Id_Persona -- Relación para obtener los datos de la persona asociada al estudiante
WHERE 
  p.Id_Tipo_Persona = '3';
`,
          {
           
          }
        );


        console.log(personas); // Verifica la respuesta de la base de datos

        if (!personas || personas.length === 0) {
          return res.status(404).json({ message: 'No se encontraron personas con tipo 3' });
        }

        return res.status(200).json(personas);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener las personas' });
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
