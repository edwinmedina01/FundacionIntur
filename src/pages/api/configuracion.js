const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener configuraciones
    try {
      const configuraciones = await sequelize.query('SELECT * FROM tbl_configuracion', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(configuraciones);
    } catch (error) {
      console.error('Error al obtener las configuraciones:', error);
      res.status(500).json({ error: 'Error al obtener las configuraciones' });
    }
  } 
  
  else if (req.method === 'PUT') {
    // Actualizar una configuración
    const { Clave, Valor, Modificado_Por } = req.body;

    try {
      // Obtener fecha actual del servidor (YYYY-MM-DD)
      const fechaModificacion = new Date().toISOString().split("T")[0];

      // Verificar si la clave existe
      const existeConfig = await sequelize.query(
        'SELECT COUNT(*) as count FROM tbl_configuracion WHERE Clave = ?',
        { replacements: [Clave], type: QueryTypes.SELECT }
      );

      if (existeConfig[0].count === 0) {
        return res.status(400).json({ error: 'La clave de configuración no existe.' });
      }

      // Actualizar el valor de la configuración
      await sequelize.query(
        'UPDATE tbl_configuracion SET Valor = ?, Modificado_Por = ?, Fecha_Modificacion = ? WHERE Clave = ?', 
        { replacements: [Valor, Modificado_Por, fechaModificacion, Clave], type: QueryTypes.UPDATE }
      );

      res.status(200).json({ message: 'Configuración actualizada con éxito' });

    } catch (error) {
      console.error('Error al actualizar la configuración:', error);
      res.status(500).json({ error: 'Error al actualizar la configuración' });
    }
  } 
  
  else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
