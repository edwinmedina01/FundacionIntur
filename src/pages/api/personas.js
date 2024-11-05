const Persona  = require('../../../models/Persona');

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  console.log('prueba')
  switch (method) {
    case 'GET':
      try {
        if (id) {
          const persona = await Persona.findByPk(id);
          if (!persona) {
            return res.status(404).json({ message: 'Persona no encontrada' });
          }
          return res.status(200).json(persona);
        } else {
          const personas = await Persona.findAll();
          return res.status(200).json(personas);
        }
      } catch (error) {
        return res.status(500).json({ error: 'Error al obtener personas' });
      }
    case 'POST':
      try {
        const persona = await Persona.create(req.body);
        return res.status(201).json(persona);
      } catch (error) {
        return res.status(500).json({ error: 'Error al crear persona' });
      }
    case 'PUT':
      try {
        const persona = await Persona.findByPk(id);
        if (!persona) {
          return res.status(404).json({ message: 'Persona no encontrada' });
        }
        await persona.update(req.body);
        return res.status(200).json(persona);
      } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar persona' });
      }
    case 'DELETE':
      try {
        const persona = await Persona.findByPk(id);
        if (!persona) {
          return res.status(404).json({ message: 'Persona no encontrada' });
        }
        await persona.destroy();
        return res.status(200).json({ message: 'Persona eliminada' });
      } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar persona' });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}