// database.js
const { Sequelize } = require('sequelize');

// Crea una nueva instancia de Sequelize
const sequelize = new Sequelize('gestion_academica_db', 'root', 'MiiguelinCZ98', {
    host: 'localhost',
    dialect: 'mysql', // Cambia a 'postgres', 'sqlite', etc., si es necesario
});

// Verifica la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida con éxito.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

testConnection();

module.exports = sequelize;
