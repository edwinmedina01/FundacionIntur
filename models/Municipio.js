// models/Municipio.js
// models/Departamento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Municipio = sequelize.define('tbl_municipio', {
    Id_Municipio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Id_Departamento: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Nombre_Municipio: {
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
    tableName: 'tbl_municipio',
    timestamps: false, // Si no tienes columnas 'createdAt' y 'updatedAt'
  });

module.exports = Municipio;