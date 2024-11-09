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

    await queryInterface.bulkInsert('tbl_municipio', [
      { Nombre_Municipio: 'La Ceiba', Id_Departamento: 1, Estado: 1 },
      { Nombre_Municipio: 'Tocoa', Id_Departamento: 2, Estado: 1 },
      { Nombre_Municipio: 'Comayagua', Id_Departamento: 3, Estado: 1 },
      { Nombre_Municipio: 'Santa Rosa de Copán', Id_Departamento: 4, Estado: 1 },
      { Nombre_Municipio: 'San Pedro Sula', Id_Departamento: 5, Estado: 1 },
      { Nombre_Municipio: 'Tegucigalpa', Id_Departamento: 17, Estado: 1 },
      { Nombre_Municipio: 'La Paz', Id_Departamento: 8, Estado: 1 },
      { Nombre_Municipio: 'Juticalpa', Id_Departamento: 16, Estado: 1 },
      { Nombre_Municipio: 'Danlí', Id_Departamento: 18, Estado: 1 },
      { Nombre_Municipio: 'Choluteca', Id_Departamento: 7, Estado: 1 },
      { Nombre_Municipio: 'Naranjal', Id_Departamento: 6, Estado: 1 },
      { Nombre_Municipio: 'Yuscarán', Id_Departamento: 18, Estado: 1 },
      { Nombre_Municipio: 'Puerto Cortés', Id_Departamento: 5, Estado: 1 },
      { Nombre_Municipio: 'Ocotepeque', Id_Departamento: 10, Estado: 1 },
      { Nombre_Municipio: 'Gracias', Id_Departamento: 9, Estado: 1 },
    ], {});

    
    //npx sequelize-cli db:seed --seed 20241109052412-municipios-seeder3.js
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('tbl_municipio', null, {});
  }
};
