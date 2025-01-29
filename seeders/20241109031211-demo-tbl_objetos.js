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

    await queryInterface.bulkInsert('tbl_objetos', [
      { Id_Objeto: 1, Objeto: 'User', Descripcion: 'Gestión de usuarios', Tipo_Objeto: 'Módulo', Creado_Por: 'system', Fecha_Creacion: new Date(), Estado: 1 },
      { Id_Objeto: 2, Objeto: 'Product', Descripcion: 'Gestión de productos', Tipo_Objeto: 'Módulo', Creado_Por: 'system', Fecha_Creacion: new Date(), Estado: 1 },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('tbl_objetos', null, {});
  }
};
