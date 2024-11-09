const Instituto = require('../../../../models/Instituto');

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const institutos = await Instituto.findAll();
        res.status(200).json(institutos);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener institutos' });
      }
      break;

    case 'POST':
      try {
        const newInstituto = await Instituto.create(req.body);
        res.status(201).json(newInstituto);
      } catch (error) {
        res.status(500).json({ error: 'Error al crear instituto' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} no permitido`);
  }
}
