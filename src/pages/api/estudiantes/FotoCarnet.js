const Estudiante = require('../../../../models/Estudiante');

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Falta el ID del estudiante' });
      }

      try {
        const estudiante = await Estudiante.findByPk(id, {
          attributes: ['foto_carnet']
        });

        if (!estudiante) {
          return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        return res.status(200).json({ foto_carnet: estudiante.foto_carnet });
      } catch (error) {
        console.error('Error en GET FotoCarnet:', error);
        return res.status(500).json({ error: 'Error al obtener la foto del estudiante' });
      }
    }

    case 'POST': {
      const { idEstudiante, imagen } = req.body;

      if (!idEstudiante || !imagen) {
        return res.status(400).json({ error: 'Faltan datos: idEstudiante o imagen' });
      }

      // Eliminar el prefijo base64
      const imagenLimpia = imagen.replace(/^data:image\/\w+;base64,/, '');

      try {
        const estudiante = await Estudiante.findByPk(idEstudiante);

        if (!estudiante) {
          return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        estudiante.foto_carnet = imagenLimpia;
        await estudiante.save();

        return res.status(200).json({ mensaje: 'Foto carnet actualizada correctamente' });
      } catch (error) {
        console.error('Error en POST FotoCarnet:', error);
        return res.status(500).json({ error: 'Error al guardar la foto carnet' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
