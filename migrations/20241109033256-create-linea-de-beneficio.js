'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LineaDeBeneficios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Nombre_Beneficio: {
        type: Sequelize.STRING
      },
      Tipo_Beneficio: {
        type: Sequelize.STRING
      },
      Monto_Beneficio: {
        type: Sequelize.STRING
      },
      Responsable_Beneficio: {
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
    await queryInterface.dropTable('LineaDeBeneficios');
  }
};