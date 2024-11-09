const Beneficio = require('../../../../models/Beneficio');

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const lineas = await Beneficio.findAll();
        res.status(200).json(lineas);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener líneas de beneficio' });
      }
      break;

    case 'POST':
      try {
        const newLinea = await Beneficio.create(req.body);
        res.status(201).json(newLinea);
      } catch (error) {
        res.status(500).json({ error: 'Error al crear línea de beneficio' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} no permitido`);
  }
}
