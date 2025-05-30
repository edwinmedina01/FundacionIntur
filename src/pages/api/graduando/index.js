import Estudiante from '../../../../models/Estudiante';
import Persona from '../../../../models/Persona';
import {deepSort} from '../../../utils/deepSort';
const Graduando = require('../../../../models/Graduando');
import { registrarBitacora } from '../../../utils/bitacoraHelper';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const graduandos = await Graduando.findAll({



          include: [
            {
              model: Estudiante,
              as: "Estudiante", // Alias definido en la relación
              include: [
                {
                  model: Persona,
                  as: "Persona", // Alias definido en la relación
                
                },
              ],
    
            },
          ],


        });
      //  res.status(200).json(graduandos);
        
      //    console.log(estudiantes);
      const estudiantesOrdenados = deepSort(graduandos, 'Id_Graduando', false);
      console.log(estudiantesOrdenados);
        return res.status(200).json(estudiantesOrdenados);
        
      } catch (error) {
        console.log("Error al obtener los graduandos")
        console.log(error)
        res.status(500).json({ error: 'Error al obtener los graduandos' });
      }
      break;

    case 'POST':
      try {
        const graduando = await Graduando.create(req.body);


     await registrarBitacora({
          Id_Usuario: req.body.Creado_Por,
          Modulo: 'GRADUACION',
          Tipo_Accion: 'INSERT',
          Data_Antes: {},
          Data_Despues: req.body,
          Detalle: `Se Agrego el graduando al estudiante ID ${req.body.Id_Estudiante}`,
          IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          Navegador: req.headers['user-agent'],
        });


        res.status(201).json(graduando);
      } catch (error) {
        res.status(400).json({ error: 'Error al crear el graduando' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} no permitido`);
  }
}
