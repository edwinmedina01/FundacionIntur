const sequelize = require('./database'); // Tu configuración de Sequelize


const verificarSincronizacion = async () => {
  try {
    // Sincroniza todos los modelos con la base de datos
    await sequelize.sync({ alter: true }); // `alter` ajusta la estructura sin borrar datos
    console.log('Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
  } finally {
    process.exit(); // Finaliza el proceso
  }
};

verificarSincronizacion();
