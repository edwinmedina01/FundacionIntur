import jwt from 'jsonwebtoken';
import Instituto from '../../../../models/Instituto';
import Area from '../../../../models/Area';
import Beneficio from '../../../../models/Beneficio';

const Departamento = require('../../../../models/Departamento');
const Estudiante = require('../../../../models/Estudiante');
const Persona = require('../../../../models/Persona');
const Municipio = require('../../../../models/Municipio');
//const Relacion = require('../../../../models/Relacion');

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
              { model: Beneficio, as: 'Beneficio' } ,
              // { 
              //   model: Relacion, 
              //   as: 'Relaciones',  // El alias que usaste en la relación
              //   include: [
                
              //   ]
              // },
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
if (!personaData.esEstudiante){
  personaData.Id_Persona=null;
}

        const persona = await Persona.create(personaData);
        if (personaData.esEstudiante){
          estudianteData.Creado_Por = decodedUser.nombre;
          const estudiante = await Estudiante.create({ ...estudianteData, Id_Persona: persona.Id_Persona });
          return res.status(201).json(estudiante);

        }else{
         
          const relacionData = {
            Id_persona: persona.Id_Persona, // ID de la persona recién creada
            Id_estudiante: personaData.Id_Estudiante  , // ID del estudiante recibido en el cuerpo de la solicitud
            Id_tipo_relacion: personaData.Id_Tipo_Persona, // Tipo de relación proporcionado
            Usuarioid: decodedUser.id, // ID del usuario autenticado
            Observaciones: personaData.observaciones || 'Sin observaciones', // Observaciones o valor por defecto
            Estado: 'activo', // Estado inicial de la relación
          };
      
          // Insertar la Relación en la base de datos
          const relacion = await Relacion.create(relacionData);

          //CREAR RELACION
          return res.status(201).json(new Estudiante());
        }

      
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error al crear estudiante y persona' });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
