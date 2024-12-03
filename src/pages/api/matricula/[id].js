

import jwt from 'jsonwebtoken';
const Matricula = require('../../../../models/Matricula');


const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  const token = req.cookies.token || '';
  const decodedUser = jwt.verify(token, SECRET_KEY);

  console.log('Metodo PUT')
  switch (method) {
    case 'GET':
      try {
        if (id) {
          const Matricula = await Matricula.findByPk(id, {
            
          });
          if (!Matricula) {
            return res.status(404).json({ message: 'Matricula no encontrado' });
          }
          return res.status(200).json(Matricula);
        } else {
          const matriculas = await Matricula.findAll({
           
          });
          return res.status(200).json(matriculas);
        }
      } catch (error) {
        return res.status(500).json({ error: 'Error al obtener estudiantes' });
      }
    case 'PUT':
      try {
        console.log('PUT ')
       // const matricula = await Matricula.findByPk(id);

        const matricula = await Matricula.findOne({
          where: {
            Id_Matricula: id, // Asegúrate de no pasarlo como string
          },
        });
        if (!matricula) {
          return res.status(404).json({ message: 'Matricula no encontrado' });
        }

        console.log('PUT matricula')
        await matricula.update(req.body.estudianteData);

        return res.status(200).json(matricula);
      } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error al actualizar Matricula' });
    }
    case 'DELETE':
      try {
        const Matricula = await Matricula.findByPk(id);
        const persona = await Persona.findByPk(Matricula.Id_Persona);
        if (!Matricula || !persona) {
          return res.status(404).json({ message: 'Matricula no encontrado' });
        }
        await Matricula.destroy();
        await persona.destroy();
        return res.status(200).json({ message: 'Matricula eliminado' });
      } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar Matricula' });
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}