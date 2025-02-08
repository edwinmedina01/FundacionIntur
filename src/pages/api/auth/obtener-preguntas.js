import PreguntaUsuario from "../../../../models/PreguntaUsuario";
import Pregunta from "../../../../models/Pregunta";
import Usuario from "../../../../models/Usuario";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {  username } = req.body;

    // if (!email) {
    //   return res.status(400).json({ message: "El correo es obligatorio." });
    // }

    try {
      // Obtener el ID del usuario con el email
      const usuario = await Usuario.findOne({ where: { Usuario: username } });

      if (!usuario) {
        return res.status(404).json({ mensaje: "El usuario no existe." });
      }


      switch(usuario.Id_EstadoUsuario){
        case 2:
         return  res.status(404).json({ mensaje: 'Usuario Inactivo.' });
        break
        case 3:
          return  res.status(404).json({ mensaje: 'Usuario Suspendido.' });
        break

}


      // Obtener las preguntas de seguridad del usuario
      const preguntasUsuario = await PreguntaUsuario.findAll({
        where: { Id_Usuario: usuario.Id_Usuario },
        include: [{ model: Pregunta, attributes: ["Id_Pregunta", "Pregunta"] }],
      });


 
      if (preguntasUsuario.length === 0) {
        return res.status(404).json({ message: "No hay preguntas de seguridad registradas para este usuario." });
      }

      res.status(200).json({
        idUsuario: usuario.Id_Usuario,
        preguntas: preguntasUsuario.map((pu) => ({
          idPregunta: pu.Id_Pregunta,
          pregunta: pu.tbl_pregunta.Pregunta,
        })),
      });
    } catch (error) {
      console.error("Error obteniendo preguntas:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
