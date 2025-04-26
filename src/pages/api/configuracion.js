const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');
const { registrarBitacora } = require('../../utils/bitacoraHelper');


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
  else if (req.method === 'POST') {
    // ✅ Agregar una nueva configuración
    const { Clave, Valor, Descripcion, Creado_Por } = req.body;

    try {
      // Validar datos obligatorios
      if (!Clave || !Valor || !Creado_Por) {
        return res.status(400).json({ error: 'Clave, Valor y Creado_Por son obligatorios.' });
      }

      // Obtener fecha actual (YYYY-MM-DD)
      const fechaCreacion = new Date().toISOString().split("T")[0];

      // Verificar si la clave ya existe
      const existeConfig = await sequelize.query(
        'SELECT COUNT(*) as count FROM tbl_configuracion WHERE Clave = ?',
        { replacements: [Clave], type: QueryTypes.SELECT }
      );

      if (existeConfig[0].count > 0) {
        return res.status(400).json({ error: 'La clave de configuración ya existe.' });
      }

      // Insertar la nueva configuración
      await sequelize.query(
        `INSERT INTO tbl_configuracion (Clave, Valor, Descripcion, Creado_Por, Fecha_Creacion) 
         VALUES (?, ?, ?, ?, ?)`,
        { replacements: [Clave, Valor, Descripcion || null, Creado_Por, fechaCreacion], type: QueryTypes.INSERT }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: 'CONFIGURACION',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: req.body,
        Detalle: `Se creó el Variable de Configuracion: ${Valor}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });
      return res.status(201).json({ message: 'Configuración agregada exitosamente' });

    } catch (error) {
      console.error('Error al agregar la configuración:', error);
      return res.status(500).json({ error: 'Error al agregar la configuración' });
    }
  } 
  else if (req.method === 'DELETE') {
    // ✅ Eliminar una configuración por `Id_Configuracion`
    const { Id_Configuracion,Modificado_Por } = req.body;

    try {
      if (!Id_Configuracion) {
        return res.status(400).json({ error: 'Id_Configuracion es obligatorio para eliminar la configuración.' });
      }

      const existeConfig = await sequelize.query(
        'SELECT COUNT(*) as count FROM tbl_configuracion WHERE Id_Configuracion = ?',
        { replacements: [Id_Configuracion], type: QueryTypes.SELECT }
      );

      if (existeConfig[0].count === 0) {
        return res.status(400).json({ error: 'La configuración no existe.' });
      }

      await sequelize.query(
        'DELETE FROM tbl_configuracion WHERE Id_Configuracion = ?', 
        { replacements: [Id_Configuracion], type: QueryTypes.DELETE }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: 'CONFIGURACION',
        Tipo_Accion: 'DELETE',
        Data_Antes: null,
        Data_Despues: req.body,
        Detalle: `Se eliminino la Variable de Configuracion: ${Id_Configuracion}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      return res.status(200).json({ message: 'Configuración eliminada exitosamente' });

    } catch (error) {
      console.error('Error al eliminar la configuración:', error);
      return res.status(500).json({ error: 'Error al eliminar la configuración' });
    }
  } 

  else if (req.method === 'PUT') {
    // ✅ Actualizar una configuración
    const { Id_Configuracion, Clave, Valor, Descripcion, Modificado_Por } = req.body;

    try {
        // 🔹 Validar datos obligatorios
        if (!Id_Configuracion || !Clave || !Valor || !Modificado_Por) {
            return res.status(400).json({ error: 'Id_Configuracion, Clave, Valor y Modificado_Por son obligatorios.' });
        }

        // 🔹 Obtener la fecha de modificación actual (YYYY-MM-DD)
        const fechaModificacion = new Date().toISOString().split("T")[0];

        // 🔹 Verificar si la configuración con ese `Id_Configuracion` existe
        const existeConfig = await sequelize.query(
            'SELECT COUNT(*) as count FROM tbl_configuracion WHERE Id_Configuracion = ?',
            { replacements: [Id_Configuracion], type: QueryTypes.SELECT }
        );

        if (existeConfig[0].count === 0) {
            return res.status(400).json({ error: 'La configuración no existe.' });
        }

        // 🔹 Actualizar la configuración en la base de datos
        await sequelize.query(
            `UPDATE tbl_configuracion 
             SET Clave = ?, Valor = ?, Descripcion = ?, Modificado_Por = ?, Fecha_Modificacion = ? 
             WHERE Id_Configuracion = ?`,
            { replacements: [Clave, Valor, Descripcion || null, Modificado_Por, fechaModificacion, Id_Configuracion], type: QueryTypes.UPDATE }
        );

           await registrarBitacora({
                Id_Usuario: Modificado_Por,
                Modulo: 'CONFIGURACION',
                Tipo_Accion: 'UPDATE',
                Data_Antes: null,
                Data_Despues: req.body,
                Detalle: `Se actualizo el Variable de Configuracion: ${Valor}`,
                IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                Navegador: req.headers['user-agent'],
              });

        return res.status(200).json({ message: 'Configuración actualizada con éxito' });

    } catch (error) {
        console.error('Error al actualizar la configuración:', error);
        return res.status(500).json({ error: 'Error al actualizar la configuración' });
    }
}

  
  else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
