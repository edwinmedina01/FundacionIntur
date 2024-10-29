// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Usuario = sequelize.define('tbl_Usuario', {
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
      type: DataTypes.STRING(45),
      allowNull: false,
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
    tableName: 'tbl_Usuario',
    timestamps: false, // Desactiva los campos automáticos de createdAt y updatedAt
  });
  

module.exports = Usuario;
