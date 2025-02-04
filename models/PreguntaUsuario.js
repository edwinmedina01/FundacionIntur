const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
import Pregunta from "./Pregunta";
import Usuario from "./Usuario"; // Modelo de usuario (debes crearlo si no existe)

const PreguntaUsuario = sequelize.define("tbl_pregunta_usuario", {
  Id_Pregunta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pregunta,
      key: "Id_Pregunta",
    },
  },
  Id_Usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: "Id_Usuario",
    },
  },
  Respuesta: {
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
}, {
  tableName: "tbl_preguntas_usuario",
  timestamps: false,
});

// Definir relaciones
PreguntaUsuario.belongsTo(Pregunta, { foreignKey: "Id_Pregunta" });
PreguntaUsuario.belongsTo(Usuario, { foreignKey: "Id_Usuario" });

export default PreguntaUsuario;
