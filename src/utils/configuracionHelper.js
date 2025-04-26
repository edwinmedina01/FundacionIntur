import sequelize from '../../database/database'; 
import { QueryTypes } from 'sequelize';

export async function getConfiguracion(clave) {
    try {
        const resultado = await sequelize.query(
            'SELECT Valor FROM tbl_configuracion WHERE Clave = ? LIMIT 1',
            { replacements: [clave], type: QueryTypes.SELECT }
        );
        return resultado.length > 0 ? resultado[0].Valor : null;
    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        return null;
    }
}
