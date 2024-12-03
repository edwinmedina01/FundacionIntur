import jwt from 'jsonwebtoken';
import Instituto from '../../../../models/Instituto';
import Area from '../../../../models/Area';
import Beneficio from '../../../../models/Beneficio';
import TipoPersona from '../../../../models/TipoPersona';
import Matricula from '../../../../models/Matricula';
import Modalidad from '../../../../models/modalidad';
import Grado from '../../../../models/grado';
import Seccion from '../../../../models/seccion';




const Persona = require('../../../../models/Persona');
const Municipio = require('../../../../models/Municipio');
const Relacion = require('../../../../models/Relacion');
const Departamento = require('../../../../models/Departamento');




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
          const _matricula = await Matricula.findByPk(id, {
            include: [{ model: Persona, as: 'Persona' }],
          });
          if (!_matricula) {
            return res.status(404).json({ message: 'Matricula no encontrado' });
          }
          return res.status(200).json(_matricula);
        } else {
          const estudiantes = await _matricula.findAll({
            
          });
          console.log(estudiantes);
          return res.status(200).json(estudiantes);
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener Matricula' });
      }
    case 'POST':
      try {
        const { personaData, estudianteData } = req.body;
        personaData.Creado_Por = decodedUser.nombre;
        
        


          const matriculaData = {
          
            Id_Estudiante : estudianteData.Id_Estudiante  , // ID del estudiante recibido en el cuerpo de la solicitud
            Id_Modalidad: estudianteData.Id_Modalidad, // Tipo de relación proporcionado
            Creado_Por: decodedUser.id, 
            Id_Grado:estudianteData.Id_Grado,// ID del usuario autenticado
            Id_Seccion:estudianteData.Id_Seccion,// ID del usuario autenticado
            Observaciones: estudianteData.observaciones || 'Sin observaciones', // Observaciones o valor por defecto
            Fecha_Matricula: new Date(),
            Fecha_Creacion: new Date(),
            Estado: 1, // Estado inicial de la relación
          };
      
          // Insertar la Relación en la base de datos
          const relacion = await Matricula.create(matriculaData);

          //CREAR RELACION
          return res.status(201).json(new Matricula());
       // }

      
    
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error al crear matricula y persona' });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
