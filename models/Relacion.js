// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta
const Persona = require('./Persona');
const TipoPersona = require('./TipoPersona');



const Relacion = sequelize.define(
    'tbl_Relacion',
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Id_estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Id_tipo_relacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      FechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      Estado: {
        type: DataTypes.ENUM('activo', 'desactivo'),
        allowNull: false,
      },
      Usuarioid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Observaciones: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'tbl_Relacion', // Nombre de la tabla en la base de datos
      timestamps: false, // Desactiva timestamps automáticos de Sequelize
    }
  );
  
  Relacion.belongsTo(Persona, {
    foreignKey: 'Id_persona', // Campo en tbl_Relacion
    targetKey: 'Id_Persona', // Clave primaria en Tbl_Persona
    as: 'Persona',           // Alias para consultas
  });

  Relacion.belongsTo(TipoPersona, {
    foreignKey: 'Id_tipo_relacion', // Campo en tbl_Relacion
    targetKey: 'Id_Tipo_Persona', // Clave primaria en Tbl_Persona
    as: 'TipoPersona',           // Alias para consultas
  });


  
  module.exports = Relacion;
  
