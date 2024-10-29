'use strict';
const bcrypt = require('bcryptjs');

//node init.js //crear base de datos
//npx sequelize-cli db:seed:all // crear usuarios

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash('password1', 10); // Ajusta 'password1' con la contraseña deseada
    const hashedPassword2 = await bcrypt.hash('password2', 10); // Ajusta 'password2' con la contraseña deseada
    const hashedPassword3 = await bcrypt.hash('password3', 10);
    
    return queryInterface.bulkInsert('tbl_usuario', [
      {
        Id_Rol: 1,
        Id_EstadoUsuario: 1,
        Id_Persona: 1,
        Usuario: 'usuario1',
        Nombre_Usuario: 'Usuario Uno',
        Contrasena: hashedPassword1, // Asegúrate de usar una contraseña hasheada en producción
        Intentos_Fallidos: 0,
        Fecha_Ultima_Conexion: '2024-10-01 10:00:00',
        Preguntas_Contestadas: '3',
        Primer_Ingreso: '2024-10-01 10:00:00',
        Fecha_Vencimiento: '2024-12-31',
        Correo: 'usuario1@example.com',
        Creado_Por: 'admin',
        Fecha_Creacion: new Date(),
        Modificado_Por: 'admin',
        Fecha_Modificacion: new Date(),
      },
      {
        Id_Rol: 2,
        Id_EstadoUsuario: 1,
        Id_Persona: 2,
        Usuario: 'usuario2',
        Nombre_Usuario: 'Usuario Dos',
        Contrasena: hashedPassword2, // Asegúrate de usar una contraseña hasheada en producción
        Intentos_Fallidos: 1,
        Fecha_Ultima_Conexion: '2024-10-02 12:30:00',
        Preguntas_Contestadas: '2',
        Primer_Ingreso: '2024-10-02 12:30:00',
        Fecha_Vencimiento: '2024-12-31',
        Correo: 'usuario2@example.com',
        Creado_Por: 'admin',
        Fecha_Creacion: new Date(),
        Modificado_Por: 'admin',
        Fecha_Modificacion: new Date(),
      },
      {
        Id_Rol: 3,
        Id_EstadoUsuario: 2,
        Id_Persona: 3,
        Usuario: 'usuario3',
        Nombre_Usuario: 'Usuario Tres',
        Contrasena: hashedPassword3, // Asegúrate de usar una contraseña hasheada en producción
        Intentos_Fallidos: 2,
        Fecha_Ultima_Conexion: '2024-10-03 15:45:00',
        Preguntas_Contestadas: '1',
        Primer_Ingreso: '2024-10-03 15:45:00',
        Fecha_Vencimiento: '2024-12-31',
        Correo: 'usuario3@example.com',
        Creado_Por: 'admin',
        Fecha_Creacion: new Date(),
        Modificado_Por: 'admin',
        Fecha_Modificacion: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tbl_Usuario', null, {});
  }
};