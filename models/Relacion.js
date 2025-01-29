// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta
const Persona = require('./Persona');
const TipoPersona = require('./TipoPersona');



const Relacion = sequelize.define(
    'tbl_relacion',
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
      tableName: 'tbl_relacion', // Nombre de la tabla en la base de datos
      timestamps: false, // Desactiva timestamps automáticos de Sequelize
    }
  );
  
  Relacion.belongsTo(Persona, {
    foreignKey: 'Id_persona', // Campo en tbl_relacion
    targetKey: 'Id_Persona', // Clave primaria en tbl_persona
    as: 'Persona',           // Alias para consultas
  });

  Relacion.belongsTo(TipoPersona, {
    foreignKey: 'Id_tipo_relacion', // Campo en tbl_relacion
    targetKey: 'Id_Tipo_Persona', // Clave primaria en tbl_persona
    as: 'TipoPersona',           // Alias para consultas
  });


  
  module.exports = Relacion;
  
