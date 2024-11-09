// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Persona = require('./Persona');
const Instituto = require('./Instituto');
const Beneficio = require('./Beneficio');
const Area = require('./Area');

const Estudiante = sequelize.define('Tbl_Estudiante', {
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
    }, {
      tableName: 'Tbl_Estudiante',
      timestamps: false,
    }
);
  
Estudiante.belongsTo(Persona, { foreignKey: 'Id_Persona', as: 'Persona' });
Estudiante.belongsTo(Instituto, { foreignKey: 'Id_Instituto', as: 'Instituto' });
Estudiante.belongsTo(Beneficio, { foreignKey: 'Id_Beneficio', as: 'Beneficio' });
Estudiante.belongsTo(Area, { foreignKey: 'Id_Area', as: 'Area' });

module.exports = Estudiante;
