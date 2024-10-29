const sequelize = require('../../../database/database'); 
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener roles
    try {
      const roles = await sequelize.query('SELECT * FROM Tbl_Roles', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(roles);
    } catch (error) {
      console.error('Error al obtener los roles:', error);
      res.status(500).json({ error: 'Error al obtener los roles' });
    }
  } else if (req.method === 'POST') {
    // CREA NUEVO ROL //
    const { Rol, Descripcion, Estado } = req.body;
    try {
      await sequelize.query('INSERT INTO Tbl_Roles (Rol, Descripcion, Estado) VALUES (?, ?, ?)', {
        replacements: [Rol, Descripcion, Estado],
        type: QueryTypes.INSERT,
      });
      res.status(201).json({ message: 'Rol creado con éxito' });
    } catch (error) {
      console.error('Error al crear el rol:', error);
      res.status(500).json({ error: 'Error al crear el rol' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un rol
    const { Id_Rol, Rol, Descripcion, Estado } = req.body; // Destructurar los valores del cuerpo
    try {
        // Actualiza el rol utilizando los parámetros recibidos
        await sequelize.query('UPDATE Tbl_Roles SET Rol = ?, Descripcion = ?, Estado = ? WHERE Id_Rol = ?', {
            replacements: [Rol, Descripcion, Estado, Id_Rol], // Asegúrate de que el orden sea correcto
            type: QueryTypes.UPDATE,
        });
        res.status(200).json({ message: 'Rol actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        res.status(500).json({ error: 'Error al actualizar el rol' });
    }
  } else if (req.method === 'DELETE') {                 //Ya Funciona
    // Eliminar un rol
    const { Id_Rol } = req.body; // Obtener el ID desde el cuerpo de la solicitud

    try {
        const result = await sequelize.query('DELETE FROM Tbl_Roles WHERE Id_Rol = ?', {
            replacements: [Id_Rol],
            type: QueryTypes.DELETE,
        });

        return res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        return res.status(500).json({ error: 'Error al eliminar el rol' });
    }
} else {
    res.status(405).json({ error: 'Método no permitido' });
}
}

