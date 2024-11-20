import jwt from 'jsonwebtoken';
import Persona from '../../../../models/Persona';
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
        const relacionData = req.body;

        // Validar que la Identidad sea proporcionada
        if (!relacionData.Identidad) {
          return res.status(400).json({ error: 'La Identidad es obligatoria' });
        }

        // Buscar Persona por Identidad
        const persona = await Persona.findOne({
          where: { Identidad: relacionData.Identidad },
        });

        if (!persona) {
          return res.status(404).json({ error: 'Persona no encontrada' });
        }

        // Crear la relación con los datos proporcionados
        const nuevaRelacion = await Relacion.create({
          Id_estudiante: relacionData.Id_estudiante,
          Id_persona: persona.Id_Persona, // Vincula la persona encontrada
          Id_tipo_relacion: relacionData.Id_tipo_relacion,
          Usuarioid: decodedUser.id,
          Observaciones: relacionData.Observaciones || 'Sin observaciones',
          Estado: 'activo',
        });

        return res.status(201).json(nuevaRelacion);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear la relación' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
