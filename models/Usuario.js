// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Usuario = sequelize.define('tbl_usuario', {
    Id_Usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Id_Rol: {
      type: DataTypes.INTEGER,
    },
    Id_EstadoUsuario: {
      type: DataTypes.INTEGER,
    },
    Id_Persona: {
      type: DataTypes.INTEGER,
    },
    Usuario: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: {
          notNull: { msg: "El nombre de usuario es obligatorio." },
          len: { args: [4, 50], msg: "El nombre de usuario debe tener entre 4 y 50 caracteres." },
          isAlphanumeric: { msg: "El usuario solo puede contener letras y números." },
      },
  },
    Nombre_Usuario: {
      type: DataTypes.STRING(45),
    },
    Contrasena: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Intentos_Fallidos: {
      type: DataTypes.INTEGER,
    },
    Fecha_Ultima_Conexion: {
      type: DataTypes.STRING(45),
    },
    Preguntas_Contestadas: {
      type: DataTypes.STRING(45),
    },
    Primer_Ingreso: {
      type: DataTypes.STRING(45),
    },
    Fecha_Vencimiento: {
      type: DataTypes.DATE,
    },
    Correo: {
      type: DataTypes.STRING(45),
    },
    PassKey: {
      type: DataTypes.STRING(45),
    },
    Creado_Por: {
      type: DataTypes.STRING(45),
    },
    Fecha_Creacion: {
      type: DataTypes.DATE,
    },
    Modificado_Por: {
      type: DataTypes.STRING(45),
    },
    Fecha_Modificacion: {
      type: DataTypes.DATE,
    },
    Primer_Login: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    tableName: 'tbl_usuario',
    timestamps: false, // Desactiva los campos automáticos de createdAt y updatedAt
  });
  

module.exports = Usuario;
