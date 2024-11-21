
import jwt from 'jsonwebtoken';

const Relacion = require('../../../../models/Relacion');


const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  const token = req.cookies.token || '';
  const decodedUser = jwt.verify(token, SECRET_KEY);

  console.log('Metodo PUT')
  switch (method) {

    case 'DELETE':
      try {
        const relacion = await Relacion.findByPk(id);
       
        if (!relacion ) {
          return res.status(404).json({ message: 'relacion no encontrado' });
        }
        await relacion.destroy();
      
        return res.status(200).json({ message: 'relacion eliminado' });
      } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar estudiante' });
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}