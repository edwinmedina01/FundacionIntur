const sequelize = require('../../../database/database');
const { QueryTypes } = require('sequelize');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const usuarios = await sequelize.query('SELECT * FROM tbl_tutorpadre', {
        type: QueryTypes.SELECT,
      });
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  } else if (req.method === 'POST') {
    const { Id_Persona, RNE, Nombre_Completo, Sexo, Domicilio, Telefono } = req.body;

    try {
      const existingUser = await sequelize.query('SELECT * FROM tbl_tutorpadre WHERE RNE = ?', {
        replacements: [RNE],
        type: QueryTypes.SELECT,
      });

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe' });
      }

      await sequelize.query('INSERT INTO tbl_tutorpadre (Id_Persona, RNE, Nombre_Completo, Sexo, Domicilio, Telefono ) VALUES (?, ?, ?, ?, ?, ?)', {
        replacements: [Id_Persona, RNE, Nombre_Completo, Sexo, Domicilio, Telefono],
        type: QueryTypes.INSERT,
      });
      res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  } else if (req.method === 'PUT') {
    const {Id_TutorPadre, Id_Persona, RNE, Nombre_Completo, Sexo, Domicilio, Telefono } = req.body;

    try {
        const existingUser = await sequelize.query('SELECT * FROM tbl_tutorpadre WHERE Id_TutorPadre = ? AND Id_TutorPadre != ?', {
          replacements: [RNE, Id_TutorPadre],
            type: QueryTypes.SELECT,
        });

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya existe' });
        }

        await sequelize.query(
          'UPDATE tbl_tutorpadre SET Id_Persona = ?, RNE = ?, Nombre_Completo = ?, Sexo = ?, Domicilio = ?, Telefono = ? WHERE Id_TutorPadre = ?',
          {
              replacements: [Id_Persona, RNE, Nombre_Completo, Sexo, Domicilio, Telefono, Id_TutorPadre],
              type: QueryTypes.UPDATE,
          }
      );
        res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  } else if (req.method === 'DELETE') {
    const { Id_TutorPadre } = req.body;

    try {
      await sequelize.query('DELETE FROM tbl_tutorpadre WHERE Id_TutorPadre = ?', {
        replacements: [Id_TutorPadre],
        type: QueryTypes.DELETE,
      });

      return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
