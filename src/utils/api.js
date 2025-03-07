import axios from "axios";

/**
 * Obtiene los estados desde la API según la tabla de referencia
 * @param {string} tabla - Nombre de la tabla para filtrar estados
 * @returns {Promise<Array>} - Lista de estados
 */
export const obtenerEstados = async (tabla) => {
    try {
        if (!tabla) throw new Error("El parámetro 'tabla' es obligatorio.");

        const response = await axios.get(`/api/estados?tabla=${tabla}`);
        return response.data; // Retorna los estados en formato JSON
    } catch (error) {
        console.error("🚨 Error al obtener estados:", error);
        return []; // Retorna un array vacío si hay error
    }
};
