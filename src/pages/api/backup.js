import jwt from 'jsonwebtoken';
import axios from 'axios';
import { registrarBitacora } from '../../utils/bitacoraHelper';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';
const REALWAY_URL = 'https://nodedump-production.up.railway.app';

export default async function handler(req, res) {
  const method = req.method;

  const token = req.cookies.token || '';
  let decodedUser;
  try {
    decodedUser = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o no proporcionado' });
  }

  const usuarioId = decodedUser.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const navegador = req.headers['user-agent'];

  if (method === 'GET') {
    try {
      const response = await axios.get(`${REALWAY_URL}/`);

      await registrarBitacora({
        Id_Usuario: usuarioId,
        Modulo: 'BACKUP',
        Tipo_Accion: 'GENERAR',
        Detalle: `Se generó un backup con respuesta: ${response.data.file || 'sin nombre de archivo'}`,
        IP_Usuario: ip,
        Navegador: navegador,
      });

      return res.status(200).json(response.data);
    } catch (error) {
      console.error('❌ Error al generar backup:', error);
      return res.status(500).json({ error: 'Error al generar backup remoto' });
    }
  }

  if (method === 'POST') {
    try {
      const response = await axios({
        method: 'post',
        url: `${REALWAY_URL}/restore-manual`,
        headers: {
          'Content-Type': req.headers['content-type'],
        },
        data: req,
      });

      await registrarBitacora({
        Id_Usuario: usuarioId,
        Modulo: 'BACKUP',
        Tipo_Accion: 'RESTORE',
        Detalle: `Se restauró una base desde archivo cargado`,
        IP_Usuario: ip,
        Navegador: navegador,
      });

      res.status(200).json({ mensaje: '✅ Restauración enviada a Railway', response: response.data });
    } catch (error) {
      console.error('❌ Error al restaurar backup remoto:', error);
      return res.status(500).json({ error: 'Error al restaurar backup remoto' });
    }
  }

  if (method === 'PUT') {
    try {
      const response = await axios.get(`${REALWAY_URL}/download`, {
        responseType: 'stream',
      });

      await registrarBitacora({
        Id_Usuario: usuarioId,
        Modulo: 'BACKUP',
        Tipo_Accion: 'DESCARGAR',
        Detalle: `Se descargó el último backup desde Railway`,
        IP_Usuario: ip,
        Navegador: navegador,
      });

      res.setHeader('Content-Disposition', 'attachment; filename=backup.sql');
      res.setHeader('Content-Type', 'application/sql');
      response.data.pipe(res);
    } catch (error) {
      console.error('❌ Error al descargar backup:', error);
      return res.status(500).json({ error: 'Error al descargar backup remoto' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  return res.status(405).end(`Método ${method} no permitido`);
}
