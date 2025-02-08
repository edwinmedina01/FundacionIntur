import { DataTypes } from "sequelize";
import sequelize from "../database/database"; // Asegúrate de que la ruta es correcta

const LogIpFallidas = sequelize.define("tbl_log_ip_fallidas", {
    Id_Registro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    IP: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    Intentos: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    Ultimo_Intento: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "tbl_log_ip_fallidas",
    timestamps: false, // Evitar que Sequelize agregue createdAt y updatedAt
});

export default LogIpFallidas;
