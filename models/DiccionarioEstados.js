import { DataTypes } from "sequelize";
import sequelize from "../database/database"; // Asegúrate de que la ruta es correcta

const DiccionarioEstados = sequelize.define("tbl_diccionario_estados", {
    Id_Estado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Tabla_Referencia: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    Codigo_Estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Nombre_Estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    Descripcion: {
        type: DataTypes.TEXT,
    },
    Eliminado: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    Creado_Por: {
        type: DataTypes.INTEGER,
    },
    Fecha_Creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "tbl_diccionario_estados",
    timestamps: false,
});

export default DiccionarioEstados;
