// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta
const Municipio = require('./Municipio');
//const Relacion = require('./Relacion');


const Persona = sequelize.define('Tbl_Persona', {
    Id_Persona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Id_Municipio: {
      type: DataTypes.INTEGER,
    },
    Id_Tipo_Persona: {
      type: DataTypes.INTEGER,
    },
    Id_Departamento: {
      type: DataTypes.INTEGER,
    },
    Primer_Nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    Segundo_Nombre: {
      type: DataTypes.STRING(60),
    },
    Primer_Apellido: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    Segundo_Apellido: {
      type: DataTypes.STRING(60),
    },
    Sexo: {
      type: DataTypes.INTEGER,
    },
    Fecha_Nacimiiento: {
      type: DataTypes.DATE,
    },
    Lugar_Nacimiento: {
      type: DataTypes.STRING(100),
    },
    Identidad: {
      type: DataTypes.STRING,
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
    telefono : {
      type: DataTypes.STRING,
    }, 
    direccion  : {
      type: DataTypes.STRING,
    },   
  }, {
    tableName: 'Tbl_Persona',
    timestamps: false,
  } 
  ,

);


Persona.belongsTo(Municipio, { foreignKey: 'Id_Municipio', as: 'Municipio' });



// Persona.hasMany(Relacion, {
//   foreignKey: 'Id_persona', // Clave foránea en tbl_Relacion
//   sourceKey: 'Id_Persona', // Clave primaria en Tbl_Estudiante
//   as: 'Relaciones',           // Alias para la relación
// });



module.exports = Persona;
