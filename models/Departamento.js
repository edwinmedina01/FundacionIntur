// models/Departamento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta
const Municipio = require('./Municipio');
const Persona = require('./Persona');

const Departamento = sequelize.define('Tbl_Departamento', {
    Id_Departamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Nombre_Departamento: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    Creado_Por: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Fecha_Creacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Modificado_Por: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Fecha_Modificacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Estado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'Tbl_Departamento',
    timestamps: false, // Si no tienes columnas 'createdAt' y 'updatedAt'
  });

Departamento.hasMany(Municipio, { foreignKey: 'Id_Municipio', as: 'Municipio' });

module.exports = Departamento;
  