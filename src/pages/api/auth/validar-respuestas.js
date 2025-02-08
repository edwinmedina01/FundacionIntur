
import client from "../../../lib/redis"; // Asegúrate de configurar Redis
import PreguntaUsuario from "../../../../models/PreguntaUsuario";
import Usuario from "../../../../models/Usuario";
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { idUsuario, respuestas } = req.body;

    if (!idUsuario || !respuestas || respuestas.length !== 3 ) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    try {
      // Obtener las respuestas guardadas en la BD
      const respuestasGuardadas = await PreguntaUsuario.findAll({
        where: { Id_Usuario: idUsuario },
      });

      if (respuestasGuardadas.length !== 3) {
        return res.status(400).json({ message: "Error en la validación de preguntas." });
      }


      const usuario = await Usuario.findOne({
        where: { Id_Usuario: idUsuario },
      });


      // Comparar respuestas (sin diferenciar mayúsculas/minúsculas)
      const validas = respuestasGuardadas.every((row) =>
        respuestas.some((r) => r.idPregunta === row.Id_Pregunta && r.respuesta.toLowerCase() === row.Respuesta.toLowerCase())
      );

      // Generar token único para restablecimiento de contraseña
       const token = crypto.randomBytes(20).toString('hex');

      // Si el correo electrónico existe, proceder a hashear la nueva contraseña
       //         const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Almacenar el token en Redis con una expiración de 15 minutos
    await client.setEx(`verify:${token}`, 900, usuario.Correo);

      if (!validas) {
        return res.status(400).json({ message: "Las respuestas no son correctas." });
      }

      // Hashear nueva contraseña
    //   const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    //   await Usuario.update(
    //     { Contrasena: hashedPassword },
    //     { where: { Id_Usuario: idUsuario } }
    //   );

      res.status(200).json({ message: "✅Respuestas Correctas.", token: token, usuario:usuario.Usuario });
    } catch (error) {
      console.error("Error validando respuestas:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
