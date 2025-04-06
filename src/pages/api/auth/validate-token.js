// src/pages/api/auth/validate-token.js

import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export default function handler(req, res) {
 // const token = req.cookies.token;  // Obtener el token desde las cookies
  const token = req.headers['authorization']?.split(' ')[1];  // Obtener el token del header Authorization
  
//console.log("🔹 Token recibido en el backend:", token);  // Mostrar el token en consola
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);  // Verificar el token
    return res.status(200).json({ message: 'Token válido', user: decoded });  // Si el token es válido
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });  // Si el token es inválido
  }
}
