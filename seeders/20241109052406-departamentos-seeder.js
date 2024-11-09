'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('tbl_departamento', [
      { Nombre_Departamento: 'Atlántida', Estado: 1 },
      { Nombre_Departamento: 'Colón', Estado: 1 },
      { Nombre_Departamento: 'Comayagua', Estado: 1 },
      { Nombre_Departamento: 'Copán', Estado: 1 },
      { Nombre_Departamento: 'Cortés', Estado: 1 },
      { Nombre_Departamento: 'Chimaltenango', Estado: 1 },
      { Nombre_Departamento: 'Intibucá', Estado: 1 },
      { Nombre_Departamento: 'La Paz', Estado: 1 },
      { Nombre_Departamento: 'Lempira', Estado: 1 },
      { Nombre_Departamento: 'Ocotepeque', Estado: 1 },
      { Nombre_Departamento: 'Olancho', Estado: 1 },
      { Nombre_Departamento: 'Santa Bárbara', Estado: 1 },
      { Nombre_Departamento: 'Valle', Estado: 1 },
      { Nombre_Departamento: 'Yoro', Estado: 1 },
      { Nombre_Departamento: 'Gracias a Dios', Estado: 1 },
      { Nombre_Departamento: 'Islas de la Bahía', Estado: 1 },
      { Nombre_Departamento: 'Francisco Morazán', Estado: 1 },
      { Nombre_Departamento: 'El Paraíso', Estado: 1 },
    ], {});

    //npx sequelize-cli db:seed --seed 20241109052406-departamentos-seeder.js
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('tbl_departamento', null, {});

    
  }
};
