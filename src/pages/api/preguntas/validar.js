import bcrypt from "bcryptjs";
import PreguntaUsuario from "../../../../models/PreguntaUsuario";
import Usuario from "../../../../models/Usuario";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { idUsuario, respuestas, nuevaContrasena } = req.body;

    if (!idUsuario || !respuestas || respuestas.length !== 3 || !nuevaContrasena) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    try {
      const respuestasGuardadas = await PreguntaUsuario.findAll({
        where: { Id_Usuario: idUsuario },
      });

      if (respuestasGuardadas.length !== 3) {
        return res.status(400).json({ message: "Error en la validación." });
      }

      const validas = respuestasGuardadas.every((row, index) => {
        return row.Respuesta.toLowerCase() === respuestas[index].toLowerCase();
      });

      if (!validas) {
        return res.status(400).json({ message: "Respuestas incorrectas." });
      }

      // Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
      await Usuario.update(
        { Contrasena: hashedPassword },
        { where: { Id_Usuario: idUsuario } }
      );

      res.status(200).json({ message: "✅ Contraseña actualizada con éxito." });
    } catch (error) {
      console.error("Error validando respuestas:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
