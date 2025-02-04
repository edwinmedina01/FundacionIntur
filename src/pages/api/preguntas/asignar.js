import PreguntaUsuario from "../../../../models/PreguntaUsuario";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { idUsuario, respuestas } = req.body;

    if (!idUsuario || !respuestas || respuestas.length !== 3) {
      return res.status(400).json({ message: "Se requieren 3 respuestas." });
    }

    try {
      await Promise.all(
        respuestas.map(async ({ idPregunta, respuesta }) => {
          await PreguntaUsuario.create({
            Id_Pregunta: idPregunta,
            Id_Usuario: idUsuario,
            Respuesta: respuesta,
            Creado_Por: "admin",
            Fecha_Creacion: new Date(),
          });
        })
      );

      res.status(201).json({ message: "Respuestas guardadas con éxito." });
    } catch (error) {
      console.error("Error guardando respuestas:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
