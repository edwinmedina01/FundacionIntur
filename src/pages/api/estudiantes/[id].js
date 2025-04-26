import jwt from 'jsonwebtoken';
import Estudiante from '../../../../models/Estudiante';
import Persona from '../../../../models/Persona';
import { registrarBitacora } from '../../../utils/bitacoraHelper';
import Matricula from '../../../../models/Matricula';
import Graduando from '../../../../models/Graduando';
import Relacion from '../../../../models/Relacion';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

function compararCambios(original, actualizado) {
  const cambios = [];
  for (const key in actualizado) {
    if (
      Object.prototype.hasOwnProperty.call(original, key) &&
      original[key] !== actualizado[key] &&
      key !== 'Modificado_Por' && key !== 'Creado_Por'
    ) {
      cambios.push(`${key}: '${original[key]}' → '${actualizado[key]}'`);
    }
  }
  return cambios.length > 0 ? cambios.join(', ') : 'Sin cambios relevantes';
}

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
          const estudiante = await Estudiante.findByPk(id, {
            include: [{ model: Persona, as: 'Persona' }],
          });
          if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
          }
          return res.status(200).json(estudiante);
        } else {
          const estudiantes = await Estudiante.findAll({
            include: [{ model: Persona, as: 'Persona' }],
          });
          return res.status(200).json(estudiantes);
        }
      } catch (error) {
        return res.status(500).json({ error: 'Error al obtener estudiantes' });
      }

    case 'PUT':
      try {
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
          return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        const persona = await Persona.findByPk(estudiante.Id_Persona);
        if (!persona) {
          return res.status(404).json({ message: 'Persona no encontrada' });
        }

        const dataAntes = { ...estudiante.toJSON(), ...persona.toJSON() };

        await estudiante.update(req.body.estudianteData);
        await persona.update(req.body.personaData);

        const dataDespues = { ...req.body.estudianteData, ...req.body.personaData };
        const detalle = compararCambios(dataAntes, dataDespues);

        await registrarBitacora({
          Id_Usuario: decodedUser.id,
          Modulo: 'ESTUDIANTES',
          Tipo_Accion: 'UPDATE',
          Data_Antes: dataAntes,
          Data_Despues: dataDespues,
          Detalle: `Se actualizó el estudiante con ID ${id}: ${detalle}`,
          IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          Navegador: req.headers['user-agent'],
        });

        return res.status(200).json({ message: 'Estudiante actualizado correctamente' });
      } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar estudiante' });
      }

      case 'DELETE':
        try {
          const estudiante = await Estudiante.findByPk(id);
          if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
          }
      
          // 🔥 1. Eliminar relaciones
          await Relacion.destroy({
            where: { Id_estudiante: id }
          });
      
          // 🔥 2. Eliminar matrícula
          await Matricula.destroy({
            where: { Id_Estudiante: id }
          });
      
          // 🔥 3. Eliminar graduación
          await Graduando.destroy({
            where: { Id_Estudiante: id }
          });
      
          // 🔥 4. Eliminar estudiante
          await estudiante.destroy();
      
          // 🔥 5. Eliminar persona (opcional si no quieres que huérfanos queden)
          const persona = await Persona.findByPk(estudiante.Id_Persona);
          if (persona) {
            await persona.destroy();
          }
      
          return res.status(200).json({ message: 'Estudiante y datos relacionados eliminados' });
      
        } catch (error) {
          console.error('Error al eliminar estudiante y relaciones:', error);
          return res.status(500).json({ error: error.message });
        }
      

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
