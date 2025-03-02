import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from 'cookie';
import Usuario from "../../../../models/Usuario";
import Rol from "../../../../models/Rol";
import DiccionarioEstados from "../../../../models/DiccionarioEstados"; // Modelo actualizado
import { enviarCorreo } from "../../../utils/emailSender";
import LogIpFallidas from "../../../../models/LogIpFallidas";  

const MAX_ATTEMPTS = 5;

// Definir valores de estado como constantes
const ESTADOS = {
    ACTIVO: 1,
    SUSPENDIDO: 3,
    INACTIVO: 2,
    ELIMINADO: 4,
};

export default async function handler(req, res) {
    const { email, password } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Obtener IP del cliente
    const ahora = new Date().toISOString().slice(0, 19).replace("T", " "); // Formato YYYY-MM-DD HH:MM:SS
    const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';
    // Buscar usuario y obtener su estado
    const usuario = await Usuario.findOne({
        where: { Usuario: email },
        include: [{
            model: Rol,
            as: "Rol",
            attributes: ["Rol"]
        }]
    });

    console.log("Usuario encontrado:", usuario);
    if (!usuario) {
        return res.status(400).json({ error: "Usuario no encontrado." });
    }


const nombreRol = usuario.Rol ? usuario.Rol.dataValues.Rol : null;

console.log("Rol del usuario:", nombreRol);
    // Verificar si el usuario está suspendido o inactivo
    if (usuario.Id_EstadoUsuario === ESTADOS.SUSPENDIDO) {
        return res.status(403).json({
            error: "Cuenta suspendida por seguridad. Contacta al administrador.",
            estado: "SUSPENDIDO",
            intentos: usuario.Intentos_Fallidos,
            ip: ip,
            fecha: ahora,
        });
    }

    if (usuario.Id_EstadoUsuario === ESTADOS.INACTIVO) {
        return res.status(403).json({
            error: "Cuenta INACTIVA. Contacta al administrador.",
            estado: "INACTIVO",
            intentos: usuario.Intentos_Fallidos,
            ip: ip,
            fecha: ahora,
        });
    }

    // Validar contraseña
    if (!bcrypt.compareSync(password, usuario.Contrasena)) {
        const nuevosIntentos = usuario.Intentos_Fallidos + 1;

        // Si alcanza el máximo de intentos, suspender usuario, registrar IP y enviar correo
        if (nuevosIntentos >= MAX_ATTEMPTS) {
            await Usuario.update(
                { Id_EstadoUsuario: ESTADOS.SUSPENDIDO },
                { where: { Id_Usuario: usuario.Id_Usuario } }
            );

            await LogIpFallidas.create({ IP: ip, Intentos: 1, Ultimo_Intento: ahora });

            // Enviar correo de advertencia
            const mensaje = `Hola ${usuario.Usuario},\n\nSe ha detectado un intento de inicio de sesión con tu usuario.\n\n📅 Fecha: ${ahora}\n🌐 IP: ${ip}\n\nTu cuenta ha sido suspendida por múltiples intentos fallidos.\nPor favor, comunícate con el administrador para solicitar el desbloqueo.\n\nSaludos,\nEquipo de Seguridad`;
            await enviarCorreo(usuario.Correo, "⚠️ Cuenta suspendida", mensaje);
            return res.status(403).json({
                error: "Cuenta suspendida por seguridad. Contacta al administrador.",
                estado: "SUSPENDIDO",
                intentos: usuario.Intentos_Fallidos,
                ip: ip,
                fecha: ahora,
            });
            
        } else {
            await Usuario.update(
                { Intentos_Fallidos: nuevosIntentos },
                { where: { Id_Usuario: usuario.Id_Usuario } }
            );
        }

        return res.status(401).json({
            error: `Credenciales incorrectas. Tienes ${nuevosIntentos}/${MAX_ATTEMPTS} intentos fallidos.`,
            intentos: nuevosIntentos,
            ip: ip,
            fecha: ahora,
        });

    }

    // Si la contraseña es correcta, permitir el acceso y resetear intentos
    await Usuario.update(
        { Intentos_Fallidos: 0, Codigo_Estado: ESTADOS.ACTIVO, Fecha_Ultima_Conexion: ahora },
        { where: { Id_Usuario: usuario.Id_Usuario } }
    );

    // // Generar token
    // const token = jwt.sign({ id: usuario.Id_Usuario }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // res.status(200).json({
    //     message: "Inicio de sesión exitoso.",
    //     token: token,
    //     estado: usuario.EstadoUsuario.Nombre_Estado,
    //     ip: ip,
    //     fecha: ahora,
    // });

    console.log(SECRET_KEY)
    // Crear el token incluyendo los campos requeridos TEST
    const token = jwt.sign(
        { 
            id: usuario.Id_Usuario,
            role: usuario.Id_Rol,
            email: usuario.Correo,
            estado: usuario.Id_EstadoUsuario,
            nombre: usuario.Usuario,
            nombrerol: usuario.Rol.Rol,
        }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
    );

    const serialized = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, 
        path: '/',
    });

    res.setHeader('Set-Cookie', serialized);
    res.status(200).json({ token, role: usuario.Id_Rol, primerLogin: usuario.Primer_Login, userId: usuario.Id_Usuario, nombrerol: usuario.Rol.Rol });
}
