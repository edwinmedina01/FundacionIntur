const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Ajusta la ruta según tu estructura

const Rol = sequelize.define('tbl_roles', {
    Id_Rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Rol: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    Descripcion: {
        type: DataTypes.STRING(45),
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
    Estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = Activo, 0 = Inactivo
    }
}, {
    tableName: 'tbl_roles',
    timestamps: false, // No incluir createdAt y updatedAt automáticamente
});

module.exports = Rol;
