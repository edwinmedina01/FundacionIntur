'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Institutos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Nombre_Instituto: {
        type: Sequelize.STRING
      },
      Direccion: {
        type: Sequelize.STRING
      },
      Telefono: {
        type: Sequelize.INTEGER
      },
      Correo: {
        type: Sequelize.STRING
      },
      Director: {
        type: Sequelize.STRING
      },
      Creado_Por: {
        type: Sequelize.STRING
      },
      Fecha_Creacion: {
        type: Sequelize.DATE
      },
      Modificado_Por: {
        type: Sequelize.STRING
      },
      Fecha_Modificacion: {
        type: Sequelize.DATE
      },
      Estado: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Institutos');
  }
};