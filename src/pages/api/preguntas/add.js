import Pregunta from "../../../../models/Pregunta";
import { registrarBitacora } from "../../../utils/bitacoraHelper";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { pregunta, creado_por } = req.body;

    if (!pregunta) {
      return res.status(400).json({ message: "La pregunta es obligatoria." });
    }

    try {
      const nuevaPregunta = await Pregunta.create({
        Pregunta: pregunta,
        Creado_Por: creado_por || "admin",
        Fecha_Creacion: new Date(),
        Estado: 1,
      });

      await registrarBitacora({
        Id_Usuario: creado_por,
        Modulo: 'PREGUNTAS_SECRETAS',
        Tipo_Accion: 'INSERT',
        Data_Antes: null,
        Data_Despues: nuevaPregunta.toJSON(),
        Detalle: `Se creó una nueva pregunta secreta: "${pregunta}"`,
        IP_Usuario: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        Navegador: req.headers['user-agent']
      });

      res.status(201).json({ message: "Pregunta creada con éxito", pregunta: nuevaPregunta });
    } catch (error) {
      console.error("Error creando pregunta:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
