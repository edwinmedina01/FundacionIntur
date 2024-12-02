// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Modalidad = sequelize.define('Modalidad', {
  Id_Modalidad: {
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
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'tbl_modalidad', // Nombre exacto de la tabla
  timestamps: false, // No usa createdAt y updatedAt por defecto
});

module.exports = Modalidad;
