const Area = require('../../../../models/Area');

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const areas = await Area.findAll();
        res.status(200).json(areas);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener áreas' });
      }
      break;

    case 'POST':
      try {
        const newArea = await Area.create(req.body);
        res.status(201).json(newArea);
      } catch (error) {
        res.status(500).json({ error: 'Error al crear área' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} no permitido`);
  }
}
