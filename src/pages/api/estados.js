import { QueryTypes } from "sequelize";
import sequelize from "../../../database/database"; // Asegúrate de importar correctamente tu conexión a la BD

export default async function handler(req, res) {
    try {
        const { tabla } = req.query; // Obtener el nombre de la tabla desde la URL

        if (!tabla) {
            return res.status(400).json({ error: "El parámetro 'tabla' es obligatorio." });
        }

        // Consulta para obtener los estados de la tabla especificada
        const estados = await sequelize.query(
            `SELECT Codigo_Estado, Nombre_Estado, Descripcion 
             FROM tbl_diccionario_estados 
             WHERE Tabla_Referencia = ? AND Eliminado = 0`,
            { replacements: [tabla], type: QueryTypes.SELECT }
        );

        return res.status(200).json(estados);
    } catch (error) {
        console.error("🚨 Error al obtener estados:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}
