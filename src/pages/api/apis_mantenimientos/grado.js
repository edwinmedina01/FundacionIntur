const sequelize = require('../../../../database/database'); 
const { QueryTypes } = require('sequelize');
const { registrarBitacora } = require('../../../utils/bitacoraHelper');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const grados = await sequelize.query(
        `SELECT * FROM tbl_grado ORDER BY Fecha_Creacion DESC`,
        { type: QueryTypes.SELECT }
      );
      res.status(200).json(grados);
    } catch (error) {
      console.error('Error al obtener los grados:', error);
      res.status(500).json({ error: 'Error al obtener los grados' });
    }
  } else if (req.method === 'POST') {
    const { Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Estado, Creado_Por } = req.body;
    try {
      await sequelize.query(
        'INSERT INTO tbl_grado (Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Fecha_Creacion, Estado) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
        {
          replacements: [Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Estado],
          type: QueryTypes.INSERT,
        }
      );

      await registrarBitacora({
        Id_Usuario: Creado_Por,
        Modulo: "GRADOS",
        Tipo_Accion: "INSERT",
        Data_Antes: null,
        Data_Despues: { Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Estado },
        Detalle: `Se ha creado el grado: ${Nombre}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(201).json({ message: 'Grado creado con éxito' });
    } catch (error) {
      console.error('Error al crear el grado:', error);
      res.status(500).json({ error: 'Error al crear el grado' });
    }
  } else if (req.method === 'PUT') {
    const { Id_Grado, Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Estado, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_grado WHERE Id_Grado = ?',
        { replacements: [Id_Grado], type: QueryTypes.SELECT }
      );

      await sequelize.query(
        'UPDATE tbl_grado SET Nombre = ?, Descripcion = ?, Nivel_Academico = ?, Duracion = ?, Cantidad_Materias = ?, Fecha_Modificacion = NOW(), Estado = ? WHERE Id_Grado = ?',
        {
          replacements: [Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Estado, Id_Grado],
          type: QueryTypes.UPDATE,
        }
      );

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: "GRADOS",
        Tipo_Accion: "UPDATE",
        Data_Antes: dataAntes[0],
        Data_Despues: { Nombre, Descripcion, Nivel_Academico, Duracion, Cantidad_Materias, Estado },
        Detalle: `Se ha actualizado el grado ID: ${Id_Grado}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(200).json({ message: 'Grado actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el grado:', error);
      res.status(500).json({ error: 'Error al actualizar el grado' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_Grado, Modificado_Por } = req.body;
    try {
      const dataAntes = await sequelize.query(
        'SELECT * FROM tbl_grado WHERE Id_Grado = ?',
        { replacements: [Id_Grado], type: QueryTypes.SELECT }
      );

      await sequelize.query('DELETE FROM tbl_grado WHERE Id_Grado = ?', {
        replacements: [Id_Grado],
        type: QueryTypes.DELETE,
      });

      await registrarBitacora({
        Id_Usuario: Modificado_Por,
        Modulo: "GRADOS",
        Tipo_Accion: "DELETE",
        Data_Antes: dataAntes[0],
        Data_Despues: null,
        Detalle: `Se ha eliminado el grado ID: ${Id_Grado}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(200).json({ message: 'Grado eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el grado:', error);
      res.status(500).json({ error: 'Error al eliminar el grado' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
