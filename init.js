// init.js
const sequelize = require('./database/database');
const Usuario = require('./models/Usuario');

const initDb = async () => {
    try {
        // Sincroniza los modelos con la base de datos
        await sequelize.sync({ force: true }); // Usar force: true solo para desarrollo, eliminar en producción
        console.log('Base de datos sincronizada.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

initDb();
