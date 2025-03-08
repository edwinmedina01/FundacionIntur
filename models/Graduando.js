const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Ajusta la ruta según tu configuración
const Estudiante = require('./Estudiante');
const Graduando = sequelize.define('Graduando', {
  Id_Graduando: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Anio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Fecha_Inicio: {
    type: DataTypes.DATEONLY, // Solo fecha (YYYY-MM-DD)
    allowNull: false,
  },
  Fecha_Final: {
    type: DataTypes.DATEONLY, // Solo fecha (YYYY-MM-DD)
    allowNull: true, // Permitir nulo si no siempre está definido
  },
  Creado_Por: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser nulo si no siempre se define
  },
  Fecha_Creacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW, // Fecha de creación predeterminada al momento actual
  },
  Modificado_Por: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser nulo si aún no ha sido modificado
  },
  Estado: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si aún no ha sido modificado
  },
  Fecha_Modificacion: {
    type: DataTypes.DATE,
    allowNull: true, // Puede ser nulo si aún no ha sido modificado
  },
  Id_Estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_estudiante', // Tabla referenciada
      key: 'Id_Estudiante',
    },
  },
}, {
  tableName: 'tbl_graduando', // Nombre exacto de la tabla en la base de datos
  timestamps: false, // Desactivar createdAt y updatedAt automáticos
});

Graduando.belongsTo(Estudiante, {
  foreignKey: "Id_Estudiante", // Mismo campo como clave primaria y clave foránea
  targetKey: "Id_Estudiante",

  as: "Estudiante",
});


module.exports = Graduando;
