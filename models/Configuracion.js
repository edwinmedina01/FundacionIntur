// models/Configuracion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Configuracion = sequelize.define('tbl_configuracion', {
    Id_Configuracion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Clave: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
    },
    Valor: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    Creado_Por: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    Fecha_Creacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    Modificado_Por: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    Fecha_Modificacion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
}, {
    tableName: 'tbl_configuracion',
    timestamps: false, // No usamos 'createdAt' y 'updatedAt'
});

module.exports = Configuracion;
