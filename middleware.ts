import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
    console.log("🔹 Middleware ejecutándose en:", req.nextUrl.pathname);

    const token = req.cookies.get('token')?.value || req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        console.log("⛔ No hay token. Redirigiendo a /login");
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("✅ Token válido:", decoded);
        return NextResponse.next();
    } catch (error) {
        console.log("⛔ Token inválido o expirado:", error.message);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// 🔹 Aplicar middleware a TODAS las rutas excepto login y API de autenticación
export const config = {
    //matcher: ["/((?!login|api/auth).*)"],
    matcher: "/:path*",
};
