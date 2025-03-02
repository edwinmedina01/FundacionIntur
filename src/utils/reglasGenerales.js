export const reglasGenerales = {
    // ✅ Solo números enteros positivos
    SoloNumeros: (min = 1, max = Infinity) => ({
        tipo: "int",
        validaciones: [
            { label: "Debe contener solo números.", test: (valor) => /^[0-9]+$/.test(valor) },
            { label: `Debe tener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max }
        ]
    }),

    // ✅ Nombre de Rol (solo mayúsculas y guion bajo)
    NombreRol: (min = 3, max = 60) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras mayúsculas y guion bajo (_).", test: (valor) => /^[A-Z_]+$/.test(valor) }
        ]
    }),
    NombreGeneral: (min = 10, max = 300) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras, números en contexto y espacios.", test: (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(valor) },
            { label: "Debe contener al menos una vocal.", test: (valor) => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(valor) },
            { label: "No puede tener más de un espacio consecutivo.", test: (valor) => !/\s{2,}/.test(valor) },
            { label: "Cada palabra debe tener al menos una vocal o ser una sigla reconocida.", test: (valor) => valor.split(" ").every(palabra => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(palabra) || /^[A-Z]{2,5}$/.test(palabra)) },
            { label: "No puede ser una única letra repetida muchas veces.", test: (valor) => !/^([A-Za-z])\1+$/.test(valor) },
            { label: "Debe ser una oración con sentido (mínimo 3 palabras).", test: (valor) => valor.split(" ").length >= 1 }
        ]
    }),
    NombreCompuesto: (min = 10, max = 300) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras, números en contexto y espacios.", test: (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(valor) },
            { label: "Debe contener al menos una vocal.", test: (valor) => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(valor) },
            { label: "No puede tener más de un espacio consecutivo.", test: (valor) => !/\s{2,}/.test(valor) },
            { label: "Cada palabra debe tener al menos una vocal o ser una sigla reconocida.", test: (valor) => valor.split(" ").every(palabra => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(palabra) || /^[A-Z]{2,5}$/.test(palabra)) },
            { label: "No puede ser una única letra repetida muchas veces.", test: (valor) => !/^([A-Za-z])\1+$/.test(valor) },
            { label: "Debe ser una oración con sentido (mínimo 2 palabras).", test: (valor) => valor.split(" ").length >= 2 }
        ]
    }),
    Descripciones: (min = 10, max = 300) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras, números en contexto y espacios.", test: (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(valor) },
            { label: "Debe contener al menos una vocal.", test: (valor) => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(valor) },
            { label: "No puede tener más de un espacio consecutivo.", test: (valor) => !/\s{2,}/.test(valor) },
            { label: "Cada palabra debe tener al menos una vocal o ser una sigla reconocida.", test: (valor) => valor.split(" ").every(palabra => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(palabra) || /^[A-Z]{2,5}$/.test(palabra)) },
            { label: "No puede ser una única letra repetida muchas veces.", test: (valor) => !/^([A-Za-z])\1+$/.test(valor) },
            { label: "Debe ser una oración con sentido (mínimo 3 palabras).", test: (valor) => valor.split(" ").length >= 3 }
        ]
    }),

    Descripciones: (min = 10, max = 300) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras, números en contexto y espacios.", test: (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(valor) },
            { label: "Debe contener al menos una vocal.", test: (valor) => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(valor) },
            { label: "No puede tener más de un espacio consecutivo.", test: (valor) => !/\s{2,}/.test(valor) },
            { label: "Cada palabra debe tener al menos una vocal o ser una sigla reconocida.", test: (valor) => valor.split(" ").every(palabra => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(palabra) || /^[A-Z]{2,5}$/.test(palabra)) },
            { label: "No puede ser una única letra repetida muchas veces.", test: (valor) => !/^([A-Za-z])\1+$/.test(valor) },
            { label: "Debe ser una oración con sentido (mínimo 3 palabras).", test: (valor) => valor.split(" ").length >= 3 }
        ]
    }),
    // ✅ Solo mayúsculas sin números ni símbolos
    TextoLibre: (min = 1, max = Infinity) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras mayúsculas y espacios.", test: (valor) => /^[A-ZÁÉÍÓÚÑ\s]+$/.test(valor) }
        ]
    }),

    NombreUnico: (min = 2, max = 80) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Debe comenzar con una letra mayúscula.", test: (valor) => /^[A-ZÁÉÍÓÚÑ]/.test(valor) },
            { label: "No debe contener caracteres especiales ni números.", test: (valor) => /^[A-ZÁÉÍÓÚÑa-záéíóúñ\s]+$/.test(valor) },
            { label: "Debe contener al menos una vocal.", test: (valor) => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(valor) },
            { label: "No puede tener más de un espacio consecutivo.", test: (valor) => !/\s{2,}/.test(valor) },
        ]
    }),

    // ✅ Nombre con Guion (solo mayúsculas y _)
    NombreUnicoConGuion: (min = 2, max = 45) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras mayúsculas y guiones bajos (_).", test: (valor) => /^[A-Z_]+$/.test(valor) }
        ]
    }),

    // ✅ Alfanumérico (letras y números, sin caracteres especiales)
    Alfanumerico: (min = 1, max = Infinity) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras y números.", test: (valor) => /^[A-Za-z0-9]+$/.test(valor) }
        ]
    }),

    // ✅ Nombre Propio (debe comenzar con mayúscula, sin números)
    NombrePropio: (min = 2, max = Infinity) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Debe comenzar con mayúscula.", test: (valor) => /^[A-ZÁÉÍÓÚÑ]/.test(valor) },
            { label: "No debe contener signos de puntuación.", test: (valor) => !/[.,;:!?]/.test(valor) }
        ]
    }),

    // ✅ Correo Electrónico
    Correo: () => ({
        tipo: "string",
        validaciones: [
            { label: "Debe seguir el formato usuario@dominio.com.", test: (valor) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor) }
        ]
    }),

    // ✅ Contraseña Segura
    ContraseñaSegura: (min = 8, max = 100) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe tener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Debe contener al menos una mayúscula.", test: (valor) => /[A-Z]/.test(valor) },
            { label: "Debe contener al menos una minúscula.", test: (valor) => /[a-z]/.test(valor) },
            { label: "Debe contener al menos un número.", test: (valor) => /[0-9]/.test(valor) },
            { label: "Debe contener al menos un carácter especial.", test: (valor) => /[@#$%^&+=!]/.test(valor) }
        ]
    }),

    // ✅ Fecha (Formato YYYY-MM-DD)
    Fecha: () => ({
        tipo: "date",
        validaciones: [
            { label: "Debe estar en formato YYYY-MM-DD.", test: (valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor) }
        ]
    }),

    // ✅ Valor en Moneda (Formato 1000.50)
    Moneda: (min = 0, max = Infinity) => ({
        tipo: "decimal",
        validaciones: [
            { label: `Debe ser un valor numérico entre ${min} y ${max}.`, test: (valor) => /^\d+(\.\d{1,2})?$/.test(valor) }
        ]
    }),

    // ✅ Teléfono (Formato internacional)
    Telefono: () => ({
        tipo: "string",
        validaciones: [
            { label: "Debe ser un número de teléfono válido con entre 7 y 15 dígitos.", test: (valor) => /^\+?[0-9]{7,15}$/.test(valor) }
        ]
    }),

    // ✅ Código de estudiante (Ejemplo: EST-123456)
    CodigoEstudiante: () => ({
        tipo: "string",
        validaciones: [
            { label: "Debe seguir el formato 'EST-123456'.", test: (valor) => /^EST-\d{6}$/.test(valor) }
        ]
    }),

    // ✅ Documento de Identidad (Ejemplo: 12345678 o 12345678-X)
    DocumentoIdentidad: () => ({
        tipo: "string",
        validaciones: [
            { label: "Debe ser un número de identificación válido con o sin letra final (ejemplo: 12345678-X).", test: (valor) => /^\d{7,9}(-[A-Z])?$/.test(valor) }
        ]
    })
};