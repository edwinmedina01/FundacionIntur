// database.js
const { Sequelize } = require('sequelize');
//require('dotenv').config();
try {
    require.resolve("mysql2");
    console.log("✅ mysql2 está instalado en Vercel");
  } catch (e) {
    console.error("❌ mysql2 NO está instalado en Vercel");
  }
  


//Crea una nueva instancia de Sequelize
// const sequelize = new Sequelize('sql3744863', 'sql3744863', 'LIi2cJvQgS' , {
//     host: 'sql3.freemysqlhosting.net',
//    dialect: 'mysql', // Cambia a 'postgres', 'sqlite', etc., si es necesario
// });




//Crea una nueva instancia de Sequelize
//  const sequelize = new Sequelize('gestion_academica_db', 'root', 'soren1' , {
//      host: 'localhost',
//      dialect: 'mysql', // Cambia a 'postgres', 'sqlite', etc., si es necesario
//   });


//   const sequelize = new Sequelize('gestion_academica_db', 'root', 'JjGbmRqkujBejmrjINqrYfCvzVwUxFdS' , {
//     host: 'autorack.proxy.rlwy.net',
//     dialect: 'mysql', // Cambia a 'postgres', 'sqlite', etc., si es necesario
//  });

 const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,

    logging: false,
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
