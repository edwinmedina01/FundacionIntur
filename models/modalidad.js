const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de que la ruta esté correcta

const Modalidad = sequelize.define('Modalidad', {
  Id_Modalidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Nombre: {
    type: DataTypes.STRING(75),
    allowNull: false,
  },
  Descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Duracion: {
    type: DataTypes.INTEGER, // antes era VARCHAR, ahora es INT
    allowNull: false,
  },
  Hora_Inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  Hora_Final: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  Creado_Por: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  Fecha_Creacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  Modificado_Por: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  Fecha_Modificacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Activo por defecto
  },
}, {
  tableName: 'tbl_modalidad',
  timestamps: false, // No usa createdAt ni updatedAt automáticos
});

module.exports = Modalidad;
