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
    await queryInterface.bulkInsert('Tbl_Lineas_de_Beneficio', [
      {
        Id_Beneficio: 1,
        Nombre_Beneficio: 'Beca Completa',
        Tipo_Beneficio: 'Cobertura completa',
        Monto_Beneficio: '100%',
        Responsable_Beneficio: 'Ministerio de Educación',
        Estado: 1,
        Creado_Por: 'admin',
        Fecha_Creacion: new Date(),
      },
      {
        Id_Beneficio: 2,
        Nombre_Beneficio: 'Media Beca',
        Tipo_Beneficio: 'Cobertura parcial',
        Monto_Beneficio: '50%',
        Responsable_Beneficio: 'Fundación ABC',
        Estado: 1,
        Creado_Por: 'admin',
        Fecha_Creacion: new Date(),
      },
    ]);

  await queryInterface.bulkInsert('Tbl_Area', [
    {
      Id_Area: 1,
      Nombre_Area: 'Ciencias',
      Tipo_Area: 'Académica',
      Responsable_Area: 'Dr. John Doe',
      Creado_Por: 'admin',
      Fecha_Creacion: new Date(),
    },
    {
      Id_Area: 2,
      Nombre_Area: 'Humanidades',
      Tipo_Area: 'Académica',
      Responsable_Area: 'Dra. Jane Smith',
      Creado_Por: 'admin',
      Fecha_Creacion: new Date(),
    },
  ]);

  await queryInterface.bulkInsert('Tbl_Instituto', [
    {
      Id_Instituto: 1,
      Nombre_Instituto: 'Instituto Nacional',
      Direccion: 'Avenida Principal, Ciudad',
      Telefono: 12345678,
      Correo: 'contacto@institutonacional.edu',
      Director: 'Prof. Carlos Martinez',
      Estado: 1,
      Creado_Por: 'admin',
      Fecha_Creacion: new Date(),
    },
    {
      Id_Instituto: 2,
      Nombre_Instituto: 'Colegio Técnico',
      Direccion: 'Calle Secundaria, Ciudad',
      Telefono: 87654321,
      Correo: 'info@colegiotec.edu',
      Director: 'Ing. Ana Lopez',
      Estado: 1,
      Creado_Por: 'admin',
      Fecha_Creacion: new Date(),
    },
  ]);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Tbl_Beneficio', null, {});
    await queryInterface.bulkDelete('Tbl_Area', null, {});
    await queryInterface.bulkDelete('Tbl_Instituto', null, {});

  }
};
