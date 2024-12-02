import { Sequelize } from 'sequelize';
import Persona from '../../../models/Persona'; // Asegúrate de tener el modelo Persona bien configurado

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Obtener todas las personas con Id_Tipo_Persona = 3
        const personas = await Persona.findAll({
          where: {
            Id_Tipo_Persona: '3', // Filtro para solo obtener personas de tipo 3
          },
          attributes: [
            'Id_Persona',
            'Id_Municipio',
            'Id_Tipo_Persona',
            'Id_Departamento',
            'Primer_Nombre',
            'Segundo_Nombre',
            'Primer_Apellido',
            'Segundo_Apellido',
            'Sexo',
            'Fecha_Nacimiiento',
            'Lugar_Nacimiento',
            'Identidad',
            'telefono',
            'direccion',
          ], // Los campos que deseas devolver
        });

        console.log(personas); // Verifica la respuesta de la base de datos

        if (!personas || personas.length === 0) {
          return res.status(404).json({ message: 'No se encontraron personas con tipo 3' });
        }

        return res.status(200).json(personas);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener las personas' });
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
