import jwt from 'jsonwebtoken';
const Persona = require('../../../../models/Persona');

import Relacion from '../../../../models/Relacion';
import TipoPersona from '../../../../models/TipoPersona';
import Estudiante from '../../../../models/Estudiante';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  const token = req.cookies.token || '';
  let decodedUser;
  try {
    decodedUser = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o no proporcionado' });
  }

  switch (method) {
    case 'GET':
      try {
        if (id) {
          // Obtener relaciones de un estudiante específico por ID
          const relaciones = await Relacion.findAll({
            where: { Id_estudiante: id },
            include: [
              {
                model: Persona,
                as: 'Persona',
                attributes: ['Identidad', 'Primer_Nombre', 'Primer_Apellido'],
              },
              {
                model: TipoPersona,
                as: 'TipoPersona',
                attributes: ['Tipo_Persona'],
              },
            ],
          });
          if (!relaciones.length) {
            return res.status(404).json({ message: 'Relaciones no encontradas para este estudiante' });
          }
          return res.status(200).json(relaciones);
        } else {
          // Obtener todas las relaciones
          const relaciones = await Relacion.findAll({
            include: [
              {
                model: Persona,
                as: 'Persona',
                attributes: ['Identidad', 'Primer_Nombre', 'Primer_Apellido'],
              },
              {
                model: TipoPersona,
                as: 'TipoPersona',
                attributes: ['Tipo_Persona'],
              },
              {
                model: Estudiante,
                as: 'Estudiante',
                attributes: ['Id_Estudiante'],
              },
            ],
          });
          return res.status(200).json(relaciones);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener relaciones' });
      }

    case 'POST':
      try {
        const personaRelacion = req.body.personaDataRelacion;

        // Validar que la Identidad sea proporcionada
        // if (personaRelacion.Identidad) {
        //   return res.status(400).json({ error: 'La Identidad es obligatoria' });
        // }

        // Buscar Persona por Identidad

        if(personaRelacion.esNuevo){
            personaRelacion.Id_Municipio=personaRelacion.Estudiante.Persona.Id_Municipio;
            personaRelacion.Id_Departamento=personaRelacion.Estudiante.Persona.Id_Departamento;
            personaRelacion.Id_estudiante=personaRelacion.Estudiante.Id_Estudiante;
            personaRelacion.Estudiante=0;
            personaRelacion.Estado=personaRelacion.Estado;
            const persona = await Persona.create(personaRelacion);

            // Crear la relación con los datos proporcionados
        const nuevaRelacion = await Relacion.create({
            Id_estudiante: personaRelacion.Id_estudiante,
            Id_persona: persona.Id_Persona, // Vincula la persona encontrada
            Id_tipo_relacion: personaRelacion.Id_Tipo_Persona,
            Usuarioid: decodedUser.id,
            Observaciones: personaRelacion.Observaciones || 'Sin observaciones',
            Estado: personaRelacion.Estado,
          });
  
          return res.status(201).json(nuevaRelacion);

        }
        else{

            const persona = await Persona.findOne({
                where: { Id_Persona: personaRelacion.Id_Persona },
              });

              const relacion = await Relacion.findOne({
                where: { Id: personaRelacion.Id },
              });
      
      
              if (!persona) {
                return res.status(404).json({ error: 'Persona no encontrada' });
              }

              if (!relacion) {
                return res.status(404).json({ error: 'relacion no encontrada' });
              }

              await persona.update(personaRelacion);
              await relacion.update(personaRelacion);

              return res.status(201).json(personaRelacion);
      
        }

       
        
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear la relación' });
      }
      case 'DELETE':
        try {
          const estudiante = await Relacion.findByPk(id);
        
          if (!estudiante ) {
            return res.status(404).json({ message: 'Relacion no encontrado' });
          }
          await estudiante.destroy();
   
          return res.status(200).json({ message: 'Relacion eliminado' });
        } catch (error) {
          return res.status(500).json({ error: 'Error al eliminar Relacion' });
        }

    default:
      res.setHeader('Allow', ['GET', 'POST','DELETE']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
