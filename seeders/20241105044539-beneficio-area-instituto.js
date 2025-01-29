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
    await queryInterface.bulkInsert('tbl_lineas_de_beneficio', [
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

  await queryInterface.bulkInsert('tbl_area', [
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

  await queryInterface.bulkInsert('tbl_instituto', [
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
    await queryInterface.bulkDelete('tbl_beneficio', null, {});
    await queryInterface.bulkDelete('tbl_area', null, {});
    await queryInterface.bulkDelete('tbl_instituto', null, {});

  }
};
