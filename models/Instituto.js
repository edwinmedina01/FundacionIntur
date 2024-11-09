const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Instituto = sequelize.define('Tbl_Instituto', {
  Id_Instituto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre_Instituto: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Direccion: {
    type: DataTypes.STRING(100),
  },
  Creado_Por: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  Fecha_Creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  Modificado_Por: {
    type: DataTypes.STRING(45),
  },
  Fecha_Modificacion: {
    type: DataTypes.DATE,
  },
  Estado: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'Tbl_Instituto',
  timestamps: false,
});

module.exports = Instituto;
