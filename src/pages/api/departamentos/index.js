// src/pages/api/departamentos/index.js
const Departamento = require('../../../../models/Departamento');

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const departamentos = await Departamento.findAll({
          where: { Estado: 1 }
        });
        res.status(200).json(departamentos);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los departamentos' });
      }
      break;

    case 'POST':
      try {
        const { Nombre_Departamento, Estado } = req.body;
        const newDepartamento = await Departamento.create({ Nombre_Departamento, Estado });
        res.status(201).json(newDepartamento);
      } catch (error) {
        res.status(500).json({ error: 'Error al crear el departamento' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} no permitido`);
  }
}
