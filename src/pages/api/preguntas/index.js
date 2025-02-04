import Pregunta from "../../../../models/Pregunta";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const preguntas = await Pregunta.findAll();
      res.status(200).json(preguntas);
    } catch (error) {
      console.error("Error obteniendo preguntas:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
