import jwt from 'jsonwebtoken';
import Graduando from '../../../../models/Graduando';
import { registrarBitacora } from '../../../utils/bitacoraHelper';

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
  const { id, Id_Estudiante } = req.query;

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
        const whereClause = id ? { id } : { Id_Estudiante };
        const graduando = await Graduando.findOne({ where: whereClause });
        if (!graduando) {
          return res.status(404).json({ error: 'Graduando no encontrado' });
        }
        res.status(200).json(graduando);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el graduando' });
      }
      break;

    case 'PUT':
      try {
        const graduandoExistente = await Graduando.findOne({ where: { Id_Graduando: id } });
        if (!graduandoExistente) {
          return res.status(404).json({ error: 'Graduando no encontrado para actualizar' });
        }

        const dataAntes = graduandoExistente.toJSON();
        await graduandoExistente.update({
          ...req.body,
          Fecha_Modificacion: new Date(),
        });

        const detalle = compararCambios(dataAntes, req.body);

        await registrarBitacora({
          Id_Usuario: decodedUser.id,
          Modulo: 'GRADUACION',
          Tipo_Accion: 'UPDATE',
          Data_Antes: dataAntes,
          Data_Despues: req.body,
          Detalle: `Se actualizó el graduando con ID ${id}: ${detalle}`,
          IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          Navegador: req.headers['user-agent'],
        });

        res.status(200).json({ message: 'Graduando actualizado correctamente' });
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al actualizar el graduando' });
      }
      break;

    case 'DELETE':
      try {
        const graduando = await Graduando.findOne({ where: { Id_Graduando: id } });
        if (!graduando) {
          return res.status(404).json({ error: 'Graduando no encontrado para eliminar' });
        }

        const dataAntes = graduando.toJSON();
        await graduando.destroy();

        await registrarBitacora({
          Id_Usuario: decodedUser.id,
          Modulo: 'GRADUACION',
          Tipo_Accion: 'DELETE',
          Data_Antes: dataAntes,
          Data_Despues: null,
          Detalle: `Se eliminó el graduando con ID ${id}`,
          IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          Navegador: req.headers['user-agent'],
        });

        res.status(200).json({ message: 'Graduando eliminado correctamente' });
      } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el graduando' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} no permitido`);
  }
}
