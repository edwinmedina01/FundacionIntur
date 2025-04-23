// models/BitacoraAccion.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/database"); // Asegúrate de tener la ruta correcta

const BitacoraAccion = sequelize.define("tbl_bitacora_acciones", {
  Id_Bitacora: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  Id_Usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Modulo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Tipo_Accion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Data_Antes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  Data_Despues: {
    type: DataTypes.JSON,
    allowNull: true
  },
  Detalle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  IP_Usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Navegador: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "tbl_bitacora_acciones",
  timestamps: false
});

module.exports = BitacoraAccion;
