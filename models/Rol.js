import { reglasGenerales } from "../src/utils/reglasGenerales";

export const reglasValidacionRoles = {
  //  Id_Rol: { tipo: "int", requerido: true }, // Clave primaria, debe ser un entero
    Rol: { ...reglasGenerales.NombreGeneral(3, 60), requerido: true }, // Nombre del rol con validación específica
    Descripcion: { ...reglasGenerales.TextoLibre(3, 45), requerido: true }, // Descripción opcional, máximo 45 caracteres
    Creado_Por: { ...reglasGenerales.SoloNumeros(3, 45), requerido: true }, // Usuario creador del rol
  //  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true }, // Fecha en formato YYYY-MM-DD
  //  Modificado_Por: { ...reglasGenerales.NombreUnicoConGuion(3, 45), requerido: false }, // Usuario que modificó, opcional
   // Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false }, // Fecha de modificación, opcional
    Estado: { tipo: "int", requerido: true, opciones: [0, 1] }, // Estado activo/inactivo (0 o 1)
};
