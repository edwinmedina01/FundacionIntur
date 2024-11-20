const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const TipoPersona = sequelize.define('tbl_tipopersona', {
  Id_Tipo_Persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Tipo_Persona: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
 
}, {
  tableName: 'tbl_tipopersona',
  timestamps: false,
});

module.exports = TipoPersona;
