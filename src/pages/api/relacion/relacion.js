import jwt from 'jsonwebtoken';
const Persona = require('../../../../models/Persona');
import Relacion from '../../../../models/Relacion';
import TipoPersona from '../../../../models/TipoPersona';
import Estudiante from '../../../../models/Estudiante';
import { registrarBitacora } from '../../../utils/bitacoraHelper';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

function compararCambios(original, actualizado) {
  const cambios = [];
  for (const key in actualizado) {
    if (
      Object.prototype.hasOwnProperty.call(original, key) &&
      original[key] !== actualizado[key] &&
      key !== 'Modificado_Por' && key !== 'Creado_Por' && key !== 'esNuevo'
    ) {
      cambios.push(`${key}: '${original[key]}' → '${actualizado[key]}'`);
    }
  }
  return cambios.length > 0 ? cambios.join(', ') : 'Sin cambios relevantes';
}

function obtenerModuloPorTipoRelacion(idTipo) {
  if (idTipo === 1) return 'ESTUDIANTES';
  if (idTipo === 2) return 'TUTORES';
  if (idTipo === 3) return 'BENEFACTORES';
  return 'RELACIONES';
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
          const relaciones = await Relacion.findAll({
            where: { Id_estudiante: id },
            include: [
              { model: Persona, as: 'Persona', attributes: ['Identidad', 'Primer_Nombre', 'Primer_Apellido'] },
              { model: TipoPersona, as: 'TipoPersona', attributes: ['Tipo_Persona'] },
            ],
          });
          if (!relaciones.length) {
            return res.status(404).json({ message: 'Relaciones no encontradas para este estudiante' });
          }
          return res.status(200).json(relaciones);
        } else {
          const relaciones = await Relacion.findAll({
            include: [
              { model: Persona, as: 'Persona', attributes: ['Identidad', 'Primer_Nombre', 'Primer_Apellido'] },
              { model: TipoPersona, as: 'TipoPersona', attributes: ['Tipo_Persona'] },
              { model: Estudiante, as: 'Estudiante', attributes: ['Id_Estudiante'] },
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
        const modulo = obtenerModuloPorTipoRelacion(personaRelacion.Id_Tipo_Persona);

        if (personaRelacion.esNuevo) {
          personaRelacion.Id_Municipio = 1;
          personaRelacion.Id_Departamento = 1;
          personaRelacion.Id_estudiante = personaRelacion.Estudiante.Id_Estudiante;
          personaRelacion.Estudiante = 0;

          const persona = await Persona.create(personaRelacion);
          const nuevaRelacion = await Relacion.create({
            Id_estudiante: personaRelacion.Id_estudiante,
            Id_persona: persona.Id_Persona,
            Id_tipo_relacion: personaRelacion.Id_Tipo_Persona,
            Usuarioid: decodedUser.id,
            Observaciones: personaRelacion.Observaciones || 'Sin observaciones',
            Estado: personaRelacion.Estado,
          });

          await registrarBitacora({
            Id_Usuario: decodedUser.id,
            Modulo: modulo,
            Tipo_Accion: 'INSERT',
            Data_Antes: null,
            Data_Despues: personaRelacion,
            Detalle: `Se registró una nueva relación con persona: ${personaRelacion.Primer_Nombre} ${personaRelacion.Primer_Apellido}`,
            IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            Navegador: req.headers['user-agent'],
          });

          return res.status(201).json(nuevaRelacion);
        } else {
          const persona = await Persona.findOne({ where: { Id_Persona: personaRelacion.Id_Persona } });
          const relacion = await Relacion.findOne({ where: { Id: personaRelacion.Id } });

          if (!persona || !relacion) {
            return res.status(404).json({ error: 'Persona o relación no encontrada' });
          }

          const dataAntesPersona = persona.toJSON();
          const dataAntesRelacion = relacion.toJSON();

          await persona.update(personaRelacion);
          await relacion.update(personaRelacion);

          const detalle = compararCambios({ ...dataAntesPersona, ...dataAntesRelacion }, personaRelacion);

          await registrarBitacora({
            Id_Usuario: decodedUser.id,
            Modulo: modulo,
            Tipo_Accion: 'UPDATE',
            Data_Antes: { ...dataAntesPersona, ...dataAntesRelacion },
            Data_Despues: personaRelacion,
            Detalle: `Se actualizaron los campos: ${detalle} en la relación con ID: ${personaRelacion.Id}`,
            IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            Navegador: req.headers['user-agent'],
          });

          return res.status(201).json(personaRelacion);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear la relación' });
      }

    case 'DELETE':
      try {
        const relacion = await Relacion.findByPk(id);

        if (!relacion) {
          return res.status(404).json({ message: 'Relación no encontrada' });
        }

        const dataAntes = relacion.toJSON();
        const modulo = obtenerModuloPorTipoRelacion(dataAntes.Id_tipo_relacion);

        await relacion.destroy();

        await registrarBitacora({
          Id_Usuario: decodedUser.id,
          Modulo: modulo,
          Tipo_Accion: 'DELETE',
          Data_Antes: dataAntes,
          Data_Despues: null,
          Detalle: `Se eliminó la relación con ID: ${id}`,
          IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          Navegador: req.headers['user-agent'],
        });

        return res.status(200).json({ message: 'Relación eliminada' });
      } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar Relación' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}