

// import jwt from 'jsonwebtoken';
// import Instituto from '../../../../models/Instituto';
// import Area from '../../../../models/Area';
// import Beneficio from '../../../../models/Beneficio';
// const Departamento = require('../../../../models/Departamento');
// const Estudiante = require('../../../../models/Estudiante');
// const Persona = require('../../../../models/Persona');
// const Municipio = require('../../../../models/Municipio');

// const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

// export default async function handler(req, res) {
//   const { method } = req;
//   const { id } = req.query;

//   const token = req.cookies.token || '';
//   const decodedUser = jwt.verify(token, SECRET_KEY);

//   switch (method) {
//     case 'GET':
//       try {
//         if (id) {
//           const estudiante = await Estudiante.findByPk(id, {
//             include: [{ model: Persona, as: 'Persona' }],
//           });
//           if (!estudiante) {
//             return res.status(404).json({ message: 'Estudiante no encontrado' });
//           }
//           return res.status(200).json(estudiante);
//         } else {
//           const estudiantes = await Estudiante.findAll({
//             include: [{ 
//                 model: Persona, as: 'Persona' ,
//                 include: [
//                   {
//                     model: Municipio,
//                     as: 'Municipio',
//                   }
//                 ],
//               },
//               { model: Instituto, as: 'Instituto' },
//               { model: Area, as: 'Area' },
//               { model: Beneficio, as: 'Beneficio' }
//             ],
//           });
//           console.log(estudiantes)
//           return res.status(200).json(estudiantes);
//         }
//       } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: 'Error al obtener estudiantes' });
//       }
//     case 'POST':
//       try {
//         // Crear primero la persona y luego el estudiante
//         const { personaData, estudianteData } = req.body;
//         personaData.Creado_Por = decodedUser.nombre 
//         const persona = await Persona.create(personaData);
//         estudianteData.Creado_Por = decodedUser.nombre 
//         console.log({ ...estudianteData, Id_Persona: persona.Id_Persona })
//         const estudiante = await Estudiante.create({ ...estudianteData, Id_Persona: persona.Id_Persona });
//         return res.status(201).json(estudiante);
//       } catch (err) {
//         console.log(err);
//         return res.status(500).json({ error: 'Error al crear estudiante y persona'});
//       }
//     default:
//       res.setHeader('Allow', ['GET', 'POST']);
//       return res.status(405).end(`Método ${method} no permitido`);
//   }
// }

// handler.js (Backend API)

import jwt from 'jsonwebtoken';
import Instituto from '../../../../models/Instituto';
import Area from '../../../../models/Area';
import Beneficio from '../../../../models/Beneficio';
const Departamento = require('../../../../models/Departamento');
const Estudiante = require('../../../../models/Estudiante');
const Persona = require('../../../../models/Persona');
const Municipio = require('../../../../models/Municipio');

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  const token = req.cookies.token || '';
  const decodedUser = jwt.verify(token, SECRET_KEY);

  switch (method) {
    case 'GET':
      try {
        if (id) {
          const estudiante = await Estudiante.findByPk(id, {
            include: [{ model: Persona, as: 'Persona' }],
          });
          if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
          }
          return res.status(200).json(estudiante);
        } else {
          const estudiantes = await Estudiante.findAll({
            include: [{ 
                model: Persona, as: 'Persona' ,
                include: [
                  {
                    model: Municipio,
                    as: 'Municipio',
                  }
                ],
              },
              { model: Instituto, as: 'Instituto' },
              { model: Area, as: 'Area' },
              { model: Beneficio, as: 'Beneficio' }
            ],
          });
          console.log(estudiantes);
          return res.status(200).json(estudiantes);
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener estudiantes' });
      }
    case 'POST':
      try {
        const { personaData, estudianteData } = req.body;
        personaData.Creado_Por = decodedUser.nombre;
        const persona = await Persona.create(personaData);
        estudianteData.Creado_Por = decodedUser.nombre;
        const estudiante = await Estudiante.create({ ...estudianteData, Id_Persona: persona.Id_Persona });
        return res.status(201).json(estudiante);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error al crear estudiante y persona' });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
