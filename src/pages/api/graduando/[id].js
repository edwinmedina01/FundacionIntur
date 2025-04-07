import jwt from 'jsonwebtoken';

const Graduando = require('../../../../models/Graduando');
export default async function handler(req, res) {
  const { method } = req;
  const { id ,Id_Estudiante,Id_Graduando } = req.query;



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
        console.log('ID:', id);
        const [updated] = await Graduando.update(
          {
            ...req.body,  // Los demás campos a actualizar
            Fecha_Modificacion: new Date(),  // Establecer la fecha de modificación al momento actual
          },
          {
            where: { Id_Graduando: id },
          }
        );
        
        console.log('Updated:', updated); // Log the updated value for debugging
        if (!updated) {
          return res.status(404).json({ error: 'Graduando no encontrado para actualizar' });
        }
        res.status(200).json({ message: 'Graduando actualizado correctamente' });
      } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(400).json({ error: 'Error al actualizar el graduando' });
      }
      break;

    case 'DELETE':
      try {
        const deleted = await Graduando.destroy({
          where: { Id_Graduando: id },
        });
        if (!deleted) {
          return res.status(404).json({ error: 'Graduando no encontrado para eliminar' });
        }
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
