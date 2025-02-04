const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Pregunta = sequelize.define("tbl_preguntas", {
  Id_Pregunta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Pregunta: {
    type: DataTypes.STRING(80),
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
    allowNull: true,
    defaultValue: 1, // 1 = Activo, 0 = Inactivo
  },
}, {
  tableName: "tbl_preguntas",
  timestamps: false,
});

export default Pregunta;
