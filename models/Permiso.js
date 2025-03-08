import { reglasGenerales } from "../src/utils/reglasGenerales";
export const reglasValidacionPermisos = {
    Id_Permiso: { tipo: "int", requerido: true }, // Clave primaria, debe ser un número entero
    Id_Rol: { tipo: "int", requerido: true }, // Debe existir un ID de rol válido
    Id_Objeto: { tipo: "int", requerido: true }, // ID del objeto al que se le asigna el permiso

    // ✅ Validaciones para permisos (Debe ser "SI" o "NO")
   // Permiso_Insertar: { tipo: "string", requerido: true, opciones: ["SI", "NO"] },
  //  Permiso_Actualizar: { tipo: "string", requerido: true, opciones: ["SI", "NO"] },
  //  Permiso_Eliminar: { tipo: "string", requerido: true, opciones: ["SI", "NO"] },
 //   Permiso_Consultar: { tipo: "string", requerido: true, opciones: ["SI", "NO"] },

    // ✅ Creado_Por y Modificado_Por deben ser enteros (ID de usuario)
    Creado_Por: { tipo: "int", requerido: true },
    Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

    //Modificado_Por: { tipo: "int", requerido: false },
   // Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

};
