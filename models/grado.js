// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Grado = sequelize.define('Grado', {
  Id_Grado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  }

}, {
  tableName: 'tbl_grado', // Nombre exacto de la tabla en la base de datos
  timestamps: false, // Si no usas createdAt y updatedAt
});

module.exports = Grado;
