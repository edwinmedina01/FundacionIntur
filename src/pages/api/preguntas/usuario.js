import PreguntaUsuario from "../../../../models/PreguntaUsuario";
import Pregunta from "../../../../models/Pregunta";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Email y username son obligatorios." });
    }

    try {
      const preguntasUsuario = await PreguntaUsuario.findAll({
        where: { Id_Usuario: email }, // Suponiendo que el email es el ID de usuario
        include: [{ model: Pregunta, attributes: ["Pregunta"] }],
      });

      if (preguntasUsuario.length === 0) {
        return res.status(404).json({ message: "No se encontraron preguntas." });
      }

      res.status(200).json(preguntasUsuario);
    } catch (error) {
      console.error("Error obteniendo preguntas de usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
