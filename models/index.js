const sequelize = require('../database/database'); // Instancia de Sequelize
const Estudiante = require('./Estudiante'); // Importa el modelo Estudiante
const Relacion = require('./Relacion'); // Importa el modelo Relacion
const Persona = require('./Persona'); // Importa el modelo Relacion

// Configuración de relaciones
Estudiante.hasMany(Relacion, {
  foreignKey: 'Id_estudiante', // Clave foránea en tbl_relacion
  sourceKey: 'Id_Estudiante',  // Clave primaria en tbl_estudiante
  as: 'Relaciones',
});

Relacion.belongsTo(Estudiante, {
  foreignKey: 'Id_estudiante', // Clave foránea en tbl_relacion
  targetKey: 'Id_Estudiante',  // Clave primaria en tbl_estudiante
  as: 'Estudiante',
});

Relacion.belongsTo(Persona, {
    foreignKey: 'Id_persona', // Campo en tbl_relacion
    targetKey: 'Id_Persona', // Clave primaria en tbl_persona
    as: 'Persona',           // Alias para consultas
  });
  

Persona.hasMany(Relacion, {
  foreignKey: 'Id_persona', // Campo en tbl_relacion que apunta a 
  sourceKey: 'Id_Persona', // Clave primaria en 
  as: 'Relaciones', // Alias para consultas
});


module.exports = {
  sequelize,
  Estudiante,
  Relacion,
  Persona
};