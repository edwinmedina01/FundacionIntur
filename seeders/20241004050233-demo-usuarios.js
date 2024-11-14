'use strict';
const bcrypt = require('bcryptjs');

//node init.js //crear base de datos
//npx sequelize-cli db:seed:all // crear usuarios

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const hashedPassword1 = await bcrypt.hash('password1', 10); // Ajusta 'password1' con la contraseña deseada
    const hashedPassword2 = await bcrypt.hash('password2', 10); // Ajusta 'password2' con la contraseña deseada
    const hashedPassword3 = await bcrypt.hash('password3', 10);

    return queryInterface.bulkInsert('tbl_Usuario', [
      {
        Id_Rol: 1,
        Id_EstadoUsuario: 1,
        Id_Persona: 1, // Primer usuario con Id_Persona 1
        Usuario: 'usuario1',
        Nombre_Usuario: 'Usuario Uno',
        Contrasena: hashedPassword1,
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
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_Usuario', null, {});
  }
};
