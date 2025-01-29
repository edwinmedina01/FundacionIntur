// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta
const Modalidad = require('./modalidad');
const Grado = require('./grado');
const Seccion = require('./seccion');

const Matricula = sequelize.define('Matricula', {
  Id_Matricula: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Id_Estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_estudiante', // Tabla referenciada
      key: 'Id_Estudiante',
    },
  },
  Id_Modalidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_modalidad', // Tabla referenciada
      key: 'Id_Modalidad',
    },
  },
  Id_Grado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_grado', // Tabla referenciada
      key: 'Id_Grado',
    },
  },
  Id_Seccion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_seccion', // Tabla referenciada
      key: 'Id_Seccion',
    },
  },
  Fecha_Matricula: {
    type: DataTypes.DATEONLY,
    allowNull: false,
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
  tableName: 'tbl_matricula', // Nombre exacto de la tabla
  timestamps: false, // No usa createdAt y updatedAt por defecto
});

Matricula.belongsTo(Modalidad, {
  foreignKey: 'Id_Modalidad', // Campo en tbl_relacion
  targetKey: 'Id_Modalidad', // Clave primaria en tbl_persona
  as: 'Modalidad',           // Alias para consultas
});

Matricula.belongsTo(Grado, {
  foreignKey: 'Id_Grado', // Campo en tbl_relacion
  targetKey: 'Id_Grado', // Clave primaria en tbl_persona
  as: 'Grado',           // Alias para consultas
});

Matricula.belongsTo(Seccion, {
  foreignKey: 'Id_Seccion', // Campo en tbl_relacion
  targetKey: 'Id_Seccion', // Clave primaria en tbl_persona
  as: 'Seccion',           // Alias para consultas
});


module.exports = Matricula;
