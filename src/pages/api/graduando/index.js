import Estudiante from '../../../../models/Estudiante';
import Persona from '../../../../models/Persona';

const Graduando = require('../../../../models/Graduando');

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
        res.status(200).json(graduandos);
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al obtener los graduandos' });
      }
      break;

    case 'POST':
      try {
        const graduando = await Graduando.create(req.body);
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
