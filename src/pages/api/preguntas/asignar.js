import PreguntaUsuario from "../../../../models/PreguntaUsuario";
import { registrarBitacora } from '../../../utils/bitacoraHelper';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { idUsuario, respuestas } = req.body;

    if (!idUsuario || !respuestas || respuestas.length !== 3) {
      return res.status(400).json({ message: "Se requieren 3 respuestas." });
    }

    try {
      const dataAntes = [];
      const dataDespues = [];

      await Promise.all(
        respuestas.map(async ({ idPregunta, respuesta }) => {
          const registro = await PreguntaUsuario.create({
            Id_Pregunta: idPregunta,
            Id_Usuario: idUsuario,
            Respuesta: respuesta,
            Creado_Por: "admin",
            Fecha_Creacion: new Date(),
          });
          dataDespues.push(registro.toJSON());
        })
      );

      await registrarBitacora({
        Id_Usuario: idUsuario,
        Modulo: 'PREGUNTAS_SECRETAS',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: dataDespues,
        Detalle: `Registro de respuestas a preguntas secretas para el usuario con ID ${idUsuario}`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent'],
      });

      res.status(201).json({ message: "Respuestas guardadas con éxito." });
    } catch (error) {
      console.error("Error guardando respuestas:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
