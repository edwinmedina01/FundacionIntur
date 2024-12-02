// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta
const Seccion = sequelize.define('Seccion', {
  Id_Seccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Nombre_Seccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Id_Grado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_grado', // Nombre de la tabla referenciada
      key: 'Id_Grado',
    },
  },
  Creado_Por: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Fecha_Creacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  Modificado_Por: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Fecha_Modificacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Activo por defecto
  },
}, {
  tableName: 'tbl_seccion', // Nombre exacto de la tabla
  timestamps: false, // No usa createdAt y updatedAt por defecto
});

module.exports = Seccion;
