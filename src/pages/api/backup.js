// pages/api/backup.js
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const backupDir = path.join(process.cwd(), 'backups');
  const fileName = `backup_${Date.now()}.sql`;
  const filePath = path.join(backupDir, fileName);

  // Crear carpeta si no existe
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // Configura tus credenciales de la base de datos
  const DB_USER = process.env.DB_USER || 'root';
  const DB_PASS = process.env.DB_PASS || 'tu_contraseña';
  const DB_NAME = process.env.DB_NAME || 'nombre_de_tu_base_de_datos';

  // Generar comando mysqldump
  const command = `mysqldump -u${DB_USER} -p${DB_PASS} ${DB_NAME} > "${filePath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error al generar respaldo:', error);
      return res.status(500).json({ message: 'Error al generar respaldo', error: stderr });
    }

    // Configurar headers de descarga
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Eliminar archivo temporal después de enviar
      fs.unlinkSync(filePath);
    });
  });
}
