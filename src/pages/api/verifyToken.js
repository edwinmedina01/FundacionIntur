import client from "../../lib/redis";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "❌ Token no proporcionado." });
  }

  try {
    // Verificar si el token existe en Redis
    const email = await client.get(`verify:${token}`);

    if (!email) {
      return res.status(400).json({ error: "❌ Token inválido o no encontrado." });
    }

    // Verificar el tiempo de expiración restante (TTL)
    const ttl = await client.ttl(`verify:${token}`);

    if (ttl <= 0) {
      // Eliminar el token si ha expirado como precaución extra
      await client.del(`verify:${token}`);
      return res.status(400).json({ error: "⏳ Token expirado. Debes solicitar uno nuevo." });
    }

    return res.status(200).json({ message: "✅ Token válido", email, ttl });
  } catch (error) {
    console.error("Error verificando el token:", error);
    return res.status(500).json({ error: "❌ Error en el servidor." });
  }
}
