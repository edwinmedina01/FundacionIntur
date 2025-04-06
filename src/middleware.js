// src/middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Obtener el token de las cookies
  //const token = req.cookies.get('token'); 
  //const token = req.cookies.token;  // Usamos directamente req.cookies.token
  const token = req.cookies.get('token')?.value; // Obtener el token de las cookies

  const baseUrl = req.nextUrl.origin;  // Esto nos da la URL base (http://localhost:3000 o la URL de producción)
  
    console.log("🔹 Token recibido en el middleware:", token);  // Mostrar el token en consola
  console.log("middleware");

  // Si la solicitud es a una ruta de la API que no es de autenticación (api/auth), entonces validar el token
  if (!req.nextUrl.pathname.startsWith('/api/auth')) {
    // Si no hay token, redirigir a la página de inicio de sesión
    if (!token) {
      console.log("⛔ No hay token. Redirigiendo a /login");
      return NextResponse.redirect(new URL('/login', req.url)); // Si no hay token, redirigir a login
    }

    try {
      // Llamar al endpoint de validación de token
      console.log(" Llamar al endpoint de validación de token");
      const res = await fetch(`${baseUrl}/api/auth/validate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`  // Incluir el token en el encabezado Authorization
        },
      });

      if (!res.ok) {
        throw new Error('Token inválido o expirado');
      }
      console.log("✅ Token validado correctamente");
      // Si la validación es exitosa, continuar con la solicitud
      return NextResponse.next();

    } catch (error) {
      console.error('🚨 Error al validar token:', error);
      return NextResponse.redirect(new URL('/login', req.url)); // Si falla la validación, redirigir a login
    }
  }

  // Si la ruta es dentro de /api/auth (no necesitamos validación de token aquí), simplemente continuar
  return NextResponse.next();
}

// Configuración del middleware
export const config = {
    runtime: 'experimental-edge', // Usa el runtime experimental para Edge

  matcher: '/api/:path*',  // Aplica solo a las rutas de la API
};
