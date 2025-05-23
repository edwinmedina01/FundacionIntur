// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Persona = require('./Persona');
const Instituto = require('./Instituto');
const Beneficio = require('./Beneficio');
const Area = require('./Area');
const Relacion = require('./Relacion');
const Matricula = require('./Matricula');


const Estudiante = sequelize.define('tbl_estudiante', {
    Id_Estudiante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Id_Persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Id_Beneficio: {
        type: DataTypes.INTEGER,
      },
      Id_Area: {
        type: DataTypes.INTEGER,
      },
      Id_Instituto: {
        type: DataTypes.INTEGER,
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
      Id_Graduando: {
        type: DataTypes.INTEGER,
      },
      foto_carnet: {
        type: DataTypes.TEXT('medium'), // O 'long' si quieres más de 16 MB
        allowNull: true,
      },
    }, {
      tableName: 'tbl_estudiante',
      timestamps: false,
    }
);
  
Estudiante.belongsTo(Persona, { foreignKey: 'Id_Persona', as: 'Persona' });
Estudiante.belongsTo(Instituto, { foreignKey: 'Id_Instituto', as: 'Instituto' });
Estudiante.belongsTo(Beneficio, { foreignKey: 'Id_Beneficio', as: 'Beneficio' });
Estudiante.belongsTo(Area, { foreignKey: 'Id_Area', as: 'Area' });
// Relación: Un estudiante puede tener muchas relaciones
Estudiante.hasMany(Relacion, {
  foreignKey: 'Id_estudiante', // Clave foránea en tbl_relacion
  sourceKey: 'Id_Estudiante', // Clave primaria en tbl_estudiante
  as: 'Relaciones',           // Alias para la relación
});

Estudiante.hasMany(Matricula, {
  foreignKey: 'Id_estudiante', // Clave foránea en tbl_relacion
  sourceKey: 'Id_Estudiante', // Clave primaria en tbl_estudiante
  as: 'Matriculas',           // Alias para la relación
});


// Estudiante.hasMany(Relacion, {

module.exports = Estudiante;
