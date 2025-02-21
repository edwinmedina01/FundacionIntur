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

export const reglasValidacionRelacion = {
    //Id_Persona: { tipo: "int", requerido: true },
   // Id_Municipio: { tipo: "int", requerido: true },
   // Id_Tipo_Persona: { tipo: "int", requerido: true },
  //  Id_Departamento: { tipo: "int", requerido: true },
  
    Primer_Nombre: { ...reglasGenerales.NombreGeneral(1, 60), requerido: true },
   // Segundo_Nombre: { ...reglasGenerales.NombreGeneral(1, 60), requerido: false },
    Primer_Apellido: { ...reglasGenerales.NombreGeneral(1, 60), requerido: true },
  //  Segundo_Apellido: { ...reglasGenerales.NombreGeneral(1, 60), requerido: false },
  
    Sexo: { tipo: "int", requerido: true, opciones: [0, 1] }, // 0 = Femenino, 1 = Masculino
  
    //Fecha_Nacimiento: { ...reglasGenerales.Fecha(), requerido: true },
   // Lugar_Nacimiento: { ...reglasGenerales.TextoLibre(3, 100), requerido: true },
  
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
  
   // Estado: { tipo: "int", requerido: true, opciones: [0, 1] }, // 0 = Inactivo, 1 = Activo
  
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

export const reglasValidacionModalidad = {
  //Id_Modalidad: { tipo: "int", requerido: true },

  Nombre: { ...reglasGenerales.NombreCompuesto(5, 75), requerido: true },
  Descripcion: { ...reglasGenerales.TextoLibre(10 ,80), requerido: true },

  Duracion: { ...reglasGenerales.TextoLibre(1, 45), requerido: true },
  Horario: { ...reglasGenerales.TextoLibre(1, 45), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] }, // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionMunicipio = {
  Id_Departamento: { tipo: "int", requerido: true },

  Nombre_Municipio: { ...reglasGenerales.TextoLibre(3, 80), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionInstituto = {
  Nombre_Instituto: { ...reglasGenerales.NombreCompuesto(10, 75), requerido: true },
  Direccion: { ...reglasGenerales.TextoLibre(10, 75), requerido: true },
  
  Telefono: { ...reglasGenerales.Telefono(), requerido: true },
  Correo: { ...reglasGenerales.Correo(), requerido: true },
  
  Director: { ...reglasGenerales.TextoLibre(3, 80), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionMatricula = {
  Id_Estudiante: { tipo: "int", requerido: true },
  Id_Modalidad: { tipo: "int", requerido: true },
  Id_Grado: { tipo: "int", requerido: true },
  Id_Seccion: { tipo: "int", requerido: true },

  Fecha_Matricula: { ...reglasGenerales.Fecha(), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};


export const reglasValidacionDepartamento = {
  Nombre_Departamento: { ...reglasGenerales.NombreCompuesto(3, 80), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionSeccion = {
  Nombre_Seccion: { ...reglasGenerales.TextoLibre(3, 75), requerido: true },
  Id_Grado: { tipo: "int", requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionArea = {
  Nombre_Area: { ...reglasGenerales.NombreCompuesto(5, 80), requerido: true },
  Tipo_Area: { ...reglasGenerales.NombreCompuesto(3, 50), requerido: true },
  Responsable_Area: { ...reglasGenerales.TextoLibre(3, 75), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionGrado = {
  Nombre: { ...reglasGenerales.NombrePropio(5, 50), requerido: true },
  Descripcion: { ...reglasGenerales.TextoLibre(5, 80), requerido: true },
  Nivel_Academico: { ...reglasGenerales.TextoLibre(3, 60), requerido: true },
  Duracion: { ...reglasGenerales.TextoLibre(1, 60), requerido: true },
  
  Cantidad_Materias: { tipo: "int", requerido: true, min: 1, max: 50 },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: true, opciones: [0, 1] }};

  export const reglasValidacionBeneficio = {
    Nombre_Beneficio: { ...reglasGenerales.NombreCompuesto(3, 80), requerido: true },
    Tipo_Beneficio: { ...reglasGenerales.NombreCompuesto(3, 80), requerido: true },
    Monto_Beneficio: { ...reglasGenerales.Moneda(0, 999999.99), requerido: true },
    Responsable_Beneficio: { ...reglasGenerales.TextoLibre(3, 45), requerido: true },

    Creado_Por: { tipo: "int", requerido: true },
    Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

    Modificado_Por: { tipo: "int", requerido: false },
    Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

    Estado: { tipo: "int", requerido: true, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};
