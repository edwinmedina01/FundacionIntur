// models/Beneficio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Asegúrate de tener la ruta correcta

const Beneficio = sequelize.define('Tbl_Lineas_de_Beneficio', {
    Id_Beneficio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Nombre_Beneficio: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
    Tipo_Beneficio: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
    Monto_Beneficio: {
        type: DataTypes.STRING(60),
        allowNull: true,
    },
    Responsable_Beneficio: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    Creado_Por: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    Fecha_Creacion: {
        type: DataTypes.DATE,
        allowNull: true,
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
    },
}, {
    tableName: 'Tbl_Lineas_de_Beneficio',
    timestamps: false,
});

module.exports = Beneficio;
