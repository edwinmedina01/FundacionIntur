import nodemailer from "nodemailer";

export async function enviarCorreo(destinatario, asunto, mensaje) {


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Tu usuario de email
            pass: process.env.EMAIL_APP_PASS, // Usa la contraseña de aplicación aquí
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const opcionesCorreo = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: asunto,
        text: mensaje,
    };

    try {
        await transporter.sendMail(opcionesCorreo);
        console.log(`Correo enviado a ${destinatario}`);
    } catch (error) {
        console.error("Error enviando correo:", error);
    }
}
