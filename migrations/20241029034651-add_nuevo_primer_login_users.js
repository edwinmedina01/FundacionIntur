'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('tbl_Usuario', 'Primer_Login', {
      type: Sequelize.BOOLEAN,  // Define el tipo de dato
      allowNull: false,         // Configura si el campo permite valores nulos
      defaultValue: true       // Puedes definir un valor por defecto
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('tbl_Usuario', 'Primer_Login');
  }
};
