// src/pages/api/municipios/index.js
const Municipio = require('../../../../models/Municipio');

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { Id_Departamento } = req.query;

        let municipios;
        if (Id_Departamento) {
          municipios = await Municipio.findAll({
            where: { Id_Departamento: Id_Departamento,Estado: 1 },
          });
        } else {
          municipios = await Municipio.findAll();
        }

        res.status(200).json(municipios);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los municipios' });
      }
      break;

    case 'POST':
      try {
        const { Nombre_Municipio, Id_Departamento, Estado } = req.body;
        const newMunicipio = await Municipio.create({ Nombre_Municipio, Id_Departamento, Estado });
        res.status(201).json(newMunicipio);
      } catch (error) {
        res.status(500).json({ error: 'Error al crear el municipio' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} no permitido`);
  }
}
