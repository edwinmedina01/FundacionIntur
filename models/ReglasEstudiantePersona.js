import { reglasGenerales } from "../src/utils/reglasGenerales";
export const reglasValidacionPersona = {
  //Id_Persona: { tipo: "int", requerido: true },
  Id_Municipio: { tipo: "int", requerido: true },
  Id_Tipo_Persona: { tipo: "int", requerido: true },
  Id_Departamento: { tipo: "int", requerido: true },

  Primer_Nombre: { ...reglasGenerales.NombreGeneral(1, 60), requerido: true },
  Segundo_Nombre: { ...reglasGenerales.NombreGeneral(1, 60), requerido: false },
  Primer_Apellido: { ...reglasGenerales.NombreGeneral(1, 60), requerido: true },
  Segundo_Apellido: { ...reglasGenerales.NombreGeneral(1, 60), requerido: false },

  Sexo: { tipo: "int", requerido: true, opciones: [0, 1] }, // 0 = Femenino, 1 = Masculino

  Fecha_Nacimiento: { ...reglasGenerales.Fecha(), requerido: true },
  Lugar_Nacimiento: { ...reglasGenerales.TextoLibre(3, 100), requerido: true },

  Identidad: { 
      tipo: "string", 
      regex: /^\d{13}$/, 
      mensaje: "El número de identidad debe contener exactamente 13 dígitos.", 
      requerido: true 
  },

  Creado_Por: { tipo: "int", requerido: true },
  //Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  //Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] }, // 0 = Inactivo, 1 = Activo

  Telefono: { ...reglasGenerales.Telefono(), requerido: true },
  Direccion: { ...reglasGenerales.TextoLibre(5, 255), requerido: true },
};

export const reglasValidacionEstudiante = {
  //Id_Estudiante: { tipo: "int", requerido: true },
  //Id_Persona: { tipo: "int", requerido: true },
  Id_Beneficio: { tipo: "int", requerido: true },
  Id_Area: { tipo: "int", requerido: true },
  Id_Instituto: { tipo: "int", requerido: true },
  //Id_Graduando: { tipo: "int", requerido: false },

  Creado_Por: { tipo: "int", requerido: true },
 // Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
 // Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  //Estado: { tipo: "int", requerido: true, opciones: [0, 1] }, // 0 = Inactivo, 1 = Activo
};
