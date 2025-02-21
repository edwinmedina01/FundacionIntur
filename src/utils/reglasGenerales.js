export const reglasGenerales = {
    // ✅ Solo números enteros positivos
    SoloNumeros: (min = 1, max = Infinity) => ({
        tipo: "int",
        regex: /^[0-9]+$/,
        mensaje: `Debe contener solo números entre ${min} y ${max} caracteres.`,
        min,
        max,
    }),

 
        NombreRol: (min = 3, max = 60) => ({
            tipo: "string",
            regex: new RegExp(`^[A-Z_]{${min},${max}}$`),
            mensaje: `El nombre del rol debe contener entre ${min} y ${max} caracteres, permitiendo solo letras mayúsculas y guiones bajos (_), sin espacios ni acentos.`,
            min,
            max,
        }),


    // ✅ Solo letras mayúsculas sin números ni símbolos (con acentos)
    SoloMayusculas: (min = 1, max = Infinity) => ({
        tipo: "string",
        regex: /^[A-ZÁÉÍÓÚÑ\s]+$/,
        mensaje: `Debe contener solo letras mayúsculas entre ${min} y ${max} caracteres.`,
        min,
        max,
    }),

    // ✅ Solo letras mayúsculas sin acentos, sin números ni símbolos
   
        NombreUnico: (min = 1, max = Infinity) => ({
            tipo: "string",
            regex: new RegExp(`^[A-Z]{${min},${max}}$`), // Solo letras mayúsculas sin acentos
            mensaje: `Debe contener solo letras mayúsculas sin acentos, sin espacios, sin números ni otros caracteres especiales. Longitud permitida: entre ${min} y ${max} caracteres.`,
            min,
            max,
        }),
   

            NombreUnico: (min = 1, max = Infinity) => ({
                tipo: "string",
                regex: new RegExp(`^[A-Z]{${min},${max}}$`), 
                mensaje: `Debe contener solo letras mayúsculas sin acentos, sin espacios, sin números ni otros caracteres especiales. Longitud permitida: entre ${min} y ${max} caracteres.`,
                min,
                max,
            }),
    
        
    
            NombreUnicoConGuion: (min = 2, max = 45) => ({
                tipo: "string",
                regex: new RegExp(`^[A-Z_]{${min},${max}}$`),
                mensaje: `Debe contener solo letras mayúsculas (A-Z) y guiones bajos (_), sin espacios, números ni acentos. Longitud permitida: entre ${min} y ${max} caracteres.`,
                min,
                max,
            }),
            

    // ✅ Alfanumérico (Letras y números, sin caracteres especiales)
    Alfanumerico: (min = 1, max = Infinity) => ({
        tipo: "string",
        regex: /^[A-Za-z0-9]+$/,
        mensaje: `Debe contener entre ${min} y ${max} caracteres, permitiendo solo letras y números.`,
        min,
        max,
    }),

    // ✅ Nombre Propio (Mayúsculas, con espacios, sin números, con acentos)
    NombrePropio: (min = 2, max = Infinity) => ({
        tipo: "string",
        regex: /^[A-ZÁÉÍÓÚÑ]+(?:\s[A-ZÁÉÍÓÚÑ]+)*$/,
        mensaje: `Debe contener al menos ${min} palabras en mayúsculas con acentos, sin números ni símbolos.`,
        min,
        max,
    }),


  
        NombreGeneral: (min = 3, max = 60) => ({
            tipo: "string",
            regex: new RegExp(`^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{${min},${max}}$`),
            mensaje: `El nombre debe contener entre ${min} y ${max} caracteres, permitiendo solo letras, números y espacios.`,
            min,
            max,
        }),
  
    

    TextoLibre: (min = 1, max = Infinity) => ({
        tipo: "string", // Permite cualquier texto
        regex: new RegExp(`^.{${min},${max}}$`), // Permite cualquier cosa dentro del rango de caracteres
        mensaje: `Debe contener entre ${min} y ${max} caracteres.`,
        min,
        max,
    }),
    

    // ✅ Correo Electrónico
    Correo: () => ({
        tipo: "string",
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        mensaje: "Debe ingresar un correo válido (ejemplo: usuario@dominio.com).",
    }),

    // ✅ Contraseña Segura (mínimo 8 caracteres, al menos una mayúscula, minúscula, número y símbolo)
    ContraseñaSegura: (min = 8, max = 100) => ({
        tipo: "string",
        regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
        mensaje: `Debe tener entre ${min} y ${max} caracteres, incluyendo mayúscula, minúscula, número y símbolo.`,
        min,
        max,
    }),

    // ✅ Fecha (Formato YYYY-MM-DD)
    Fecha: () => ({
        tipo: "date",
        regex: /^\d{4}-\d{2}-\d{2}$/,
        mensaje: "La fecha debe estar en formato YYYY-MM-DD.",
    }),

    // ✅ Valor en Moneda (Formato 1000.50)
    Moneda: (min = 0, max = Infinity) => ({
        tipo: "decimal",
        regex: /^\d+(\.\d{1,2})?$/,
        mensaje: `Debe ser un valor numérico válido con hasta dos decimales (ejemplo: 1000.50).`,
        min,
        max,
    }),

    // ✅ Teléfono (Formato internacional)
    Telefono: () => ({
        tipo: "string",
        regex: /^\+?[0-9]{7,15}$/,
        mensaje: "Debe ser un número de teléfono válido con entre 7 y 15 dígitos.",
    }),

    // ✅ Código de estudiante (Ejemplo: EST-123456)
    CodigoEstudiante: () => ({
        tipo: "string",
        regex: /^EST-\d{6}$/,
        mensaje: "Debe seguir el formato 'EST-123456'.",
    }),

    // ✅ DNI / Número de Identificación (Ejemplo: 12345678 o 12345678-X)
    DocumentoIdentidad: () => ({
        tipo: "string",
        regex: /^\d{7,9}(-[A-Z])?$/,
        mensaje: "Debe ser un número de identificación válido con o sin letra final (ejemplo: 12345678-X).",
    }),
};

