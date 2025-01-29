const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Area = sequelize.define('tbl_area', {
  Id_Area: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre_Area: {
    type: DataTypes.STRING(100),
    allowNull: false,
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
  tableName: 'tbl_area',
  timestamps: false,
});

module.exports = Area;
