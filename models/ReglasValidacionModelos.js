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

  Sexo: { tipo: "int", requerido: false, opciones: [0, 1] }, // 0 = Femenino, 1 = Masculino

  Fecha_Nacimiento: { ...reglasGenerales.Fecha(), requerido: true },
  Lugar_Nacimiento: { ...reglasGenerales.NombreGeneral(3, 100), requerido: true },

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

  Estado: { tipo: "int", requerido: false, opciones: [0, 1] }, // 0 = Inactivo, 1 = Activo

  Telefono: { ...reglasGenerales.Telefono(), requerido: true },
  Direccion: { ...reglasGenerales.Direccion(5, 255), requerido: true },
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
  
    Sexo: { tipo: "int", requerido: false, opciones: [0, 1] }, // 0 = Femenino, 1 = Masculino
  
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
  
     Estado: { tipo: "int", requerido: false, opciones: [0, 1] }, // 0 = Inactivo, 1 = Activo
  
    Telefono: { ...reglasGenerales.Telefono(), requerido: true },
    Direccion: { ...reglasGenerales.Direccion(5, 255), requerido: true },
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

  //Estado: { tipo: "int", requerido: false, opciones: [0, 1] }, // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionModalidadold = {
  //Id_Modalidad: { tipo: "int", requerido: true },

  Nombre: { ...reglasGenerales.NombreGeneral(5, 75), requerido: true },
  Descripcion: { ...reglasGenerales.Descripciones(10 ,80), requerido: true },

  Duracion: { ...reglasGenerales.DuracionMeses(1, 45), requerido: true },
  Horario: { ...reglasGenerales.Horario(1, 45), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

 // Estado: { tipo: "int", requerido: false, opciones: [0, 1] }, // 0 = Inactivo, 1 = Activo
};



export const reglasValidacionModalidad = {
  Nombre: { ...reglasGenerales.NombreGeneral(5, 75), requerido: true },
  Descripcion: { ...reglasGenerales.Descripciones(10 ,80), requerido: true },

  Duracion: { ...reglasGenerales.DuracionMeses(1, 60), requerido: true },
  Hora_Inicio: { ...reglasGenerales.HoraMilitar(), requerido: true },
  Hora_Final: {
    ...reglasGenerales.HoraMilitar(),
    requerido: true,
    validaciones: [
      {
        label: "La hora final debe ser mayor que la hora de inicio.",
        test: (valor, formData) => {
          if (!formData?.Hora_Inicio) return true;
          return valor > formData.Hora_Inicio;
        },
      },
    ],
  },

  Creado_Por: { tipo: "int", requerido: true },
  //Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
 // Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

 // Estado: { tipo: "int", requerido: true, opciones: [1, 2, 3] } // 1 = Activo, 2 = Inactivo, 3 = Eliminado
};


export const reglasValidacionMunicipio = {
  Id_Departamento: { tipo: "int", requerido: true },

  Nombre_Municipio: { ...reglasGenerales.NombreCompuesto(3, 80), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionInstituto = {
  Nombre_Instituto: { ...reglasGenerales.NombreConAbreviatura(10, 75), requerido: true },
  Direccion: { ...reglasGenerales.Direccion(10, 75), requerido: true },
  
  Telefono: { ...reglasGenerales.Telefono(), requerido: true },
  Correo: { ...reglasGenerales.Correo(), requerido: true },
  
  Director: { ...reglasGenerales.NombreCompuesto(3, 80), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  //Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
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

  Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};


export const reglasValidacionDepartamento = {
  Nombre_Departamento: { ...reglasGenerales.NombreCompuesto(3, 80), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  //Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionSeccion = {
  Nombre_Seccion: { ...reglasGenerales.NombreCompuestoConNumero(3, 75), requerido: true },
  Id_Grado: { tipo: "int", requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

 // Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionArea = {
  Nombre_Area: { ...reglasGenerales.NombreCompuesto(5, 80), requerido: true },
  Tipo_Area: { ...reglasGenerales.DescripcionGrado(3, 50), requerido: true },
  Responsable_Area: { ...reglasGenerales.NombreConAbreviatura(3, 75), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

  Modificado_Por: { tipo: "int", requerido: false },
  Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  //Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};

export const reglasValidacionGradoOld = {
  Nombre: { ...reglasGenerales.NombreRolMayusculas(2, 10), requerido: true }, 
  Descripcion: { ...reglasGenerales.DescripcionGrado(5, 80), requerido: true },
  Nivel_Academico: { ...reglasGenerales.TextoLibre(3, 60), requerido: true },
  Duracion: { ...reglasGenerales.DuracionAnios(1, 60), requerido: true },
  Cantidad_Materias: { ...reglasGenerales.SoloNumeros(1, 50), requerido: true },

  Creado_Por: { tipo: "int", requerido: true },
 // Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

 /// Modificado_Por: { tipo: "int", requerido: false },
  //Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

  //Estado: { ...reglasGenerales.EstadoGeneral(), requerido: true }
};
export const reglasValidacionGrado = {
  Nombre: {
    ...reglasGenerales.TextoLibre(2, 20), // Ej: "7mo", "Diurna"
    requerido: true,
  },

  Descripcion: {
    ...reglasGenerales.TextoLibre(5, 80), // Ej: "GRADO #7", "Profesor Prueba"
    requerido: true,
  },

  Nivel_Academico: {
    ...reglasGenerales.TextoLibre(5, 60), // Ej: "PRIMARIA", "SEGUNDO DE CARRERA"
    requerido: true,
  },

  Duracion: {
    ...reglasGenerales.SoloNumeros(1, 12), // Ej: "4 años", "12 meses", "1 Año"
    requerido: true,
  },

  Cantidad_Materias: {
    ...reglasGenerales.SoloNumeros(1, 50), // Ej: 2, 10, 30
    requerido: true,
  },

  // Estado: {
  //   ...reglasGenerales.EstadoGeneral(), // "Activo", "Inactivo"
  //   requerido: true,
  // },

  Creado_Por: {
    tipo: "int",
    requerido: true,
  },

  Modificado_Por: {
    tipo: "int",
    requerido: false,
  },
};



  export const reglasValidacionBeneficio = {
    Nombre_Beneficio: { ...reglasGenerales.DescripcionGrado(3, 80), requerido: true },
    Tipo_Beneficio: { ...reglasGenerales.DescripcionGrado(3, 80), requerido: true },
    Monto_Beneficio: { ...reglasGenerales.Porcentaje(0, 999999.99), requerido: true },
    Responsable_Beneficio: { ...reglasGenerales.NombreCompuesto(3, 45), requerido: true },

    Creado_Por: { tipo: "int", requerido: true },
    Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true },

    Modificado_Por: { tipo: "int", requerido: false },
    Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false },

    Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // 0 = Inactivo, 1 = Activo
};
export const reglasValidacionConfiguracion = {
  //Id_Configuracion: { tipo: "int", requerido: true }, // Clave primaria, debe ser un número entero
  
  Clave: { ...reglasGenerales.AppKeyMayusculas(3, 80), requerido: true }, // Clave alfanumérica con mínimo 3 y máximo 80 caracteres
  Valor: { ...reglasGenerales.VariableEntorno(1, 255), requerido: true }, // Valor con hasta 255 caracteres
  Descripcion: { ...reglasGenerales.Descripciones(10, 255), requerido: false }, // Descripción opcional de hasta 255 caracteres

  Creado_Por: { ...reglasGenerales.TextoLibre(1, 45), requerido: true }, // Usuario creador, limitado a 45 caracteres
 // Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true }, // Fecha en formato YYYY-MM-DD

  Modificado_Por: { ...reglasGenerales.TextoLibre(1, 45), requerido: false }, // Usuario modificador opcional
 // Fecha_Modific

};
export const reglasValidacionRoles = {
  Rol: { ...reglasGenerales.NombreRol(3, 60), requerido: true }, // ✅ Solo mayúsculas y guion bajo
  Descripcion: { ...reglasGenerales.Descripciones(3, 45), requerido: true }, // ✅ Texto libre con límite

  Creado_Por: { tipo: "int", requerido: true }, // ✅ ID del usuario que crea el rol
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true }, // ✅ Fecha en formato YYYY-MM-DD

  //Modificado_Por: { tipo: "int", requerido: false }, // ✅ Puede ser nulo si no se ha modificado
  //Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false }, // ✅ Puede ser nulo si no se ha modificado

 // Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // ✅ 0 = Inactivo, 1 = Activo
};

export const reglasValidacionUsuario = {
  Usuario: { ...reglasGenerales.NombreUnico(3, 60), requerido: true }, // ✅ Solo mayúsculas y guion bajo
  Nombre_Usuario: { ...reglasGenerales.Descripciones(3, 45), requerido: true }, // ✅ Texto libre con límite
  Correo: { ...reglasGenerales.Correo(3, 45), requerido: true }, // ✅ Texto libre con límite

  Creado_Por: { tipo: "int", requerido: true }, // ✅ ID del usuario que crea el rol
  Fecha_Creacion: { ...reglasGenerales.Fecha(), requerido: true }, // ✅ Fecha en formato YYYY-MM-DD

  //Modificado_Por: { tipo: "int", requerido: false }, // ✅ Puede ser nulo si no se ha modificado
  //Fecha_Modificacion: { ...reglasGenerales.Fecha(), requerido: false }, // ✅ Puede ser nulo si no se ha modificado

  Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // ✅ 0 = Inactivo, 1 = Activo
};
export const reglasValidacionGraduando = {
 
  Estado: { tipo: "int", requerido: false, opciones: [0, 1] } // ✅ 0 = Inactivo, 1 = Activo
};

