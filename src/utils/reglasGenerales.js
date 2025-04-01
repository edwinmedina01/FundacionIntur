export const reglasGenerales = {
    SoloNumeros: (min = 1, max = Infinity) => ({
        tipo: "int",
        validaciones: [
          {
            label: "Debe contener solo números enteros.",
            test: (valor) => /^[0-9]+$/.test(String(valor))
          },
          {
            label: `Debe estar entre ${min} y ${max}.`,
            test: (valor) => {
              const num = parseInt(valor);
              return !isNaN(num) && num >= min && num <= max;
            }
          }
        ]
      }),
      
    Horario: (min = 10, max = 20) => ({
        tipo: "string",
        validaciones: [
            {
                label: "El horario debe estar en el formato correcto (Ejemplo: 8:00-4:00 PM)",
                test: (valor) => /^(0?[1-9]|1[0-2]):[0-5][0-9]-(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(valor)
            },
            {
                label: `Debe tener entre ${min} y ${max} caracteres.`,
                test: (valor) => valor.length >= min && valor.length <= max
            }
        ]
    }),
    NombreGrado: (min = 2, max = 10) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten números y sufijos 'mo', 'vo', o la palabra 'Diurna'.", test: (valor) => /^[0-9]*(mo|vo)?$|^Diurna$/i.test(valor) }
        ]
    }),

    // ✅ Nivel Académico (Ejemplo: "TERCER CICLO", "SEGUNDO DE CARRERA")
    NivelAcademico: (min = 3, max = 60) => ({ ...reglasGenerales.TextoLibre(min, max) }),

    // ✅ Duración en Meses (Ejemplo: "12 Meses")
    DuracionMeses: (min = 1, max = 60) => ({
        tipo: "string",
        validaciones: [
            { label: "Debe estar en el formato correcto (Ejemplo: '12 Meses').", test: (valor) => /^([1-9]|[1-5][0-9]|60) Meses$/.test(valor) },
            { label: `Debe estar entre ${min} y ${max} meses.`, test: (valor) => {
                const match = valor.match(/^(\d+) Meses$/);
                return match ? parseInt(match[1]) >= min && parseInt(match[1]) <= max : false;
            }}
        ]
    }),

    // ✅ Nombre de Rol (solo mayúsculas y guion bajo)
    NombreRolMayusculas: (min = 3, max = 60) => ({
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

DuracionMesesv1: (min = 1, max = 60) => ({
    tipo: "string",
    validaciones: [
        {
            label: "Debe estar en el formato correcto (Ejemplo: '12 Meses').",
            test: (valor) => new RegExp(`^([1-9]|[1-5][0-9]|60) Meses$`).test(valor), 
        },
        {
            label: `El número de meses debe estar entre ${min} y ${max}.`,
            test: (valor) => {
                const match = valor.match(/^(\d+) Meses$/);
                return match ? parseInt(match[1]) >= min && parseInt(match[1]) <= max : false;
            }
        }
    ]
}),


DuracionMeses: (min = 1, max = 60) => ({
    tipo: "int",
    validaciones: [
      {
        label: `Debe ser un número entre ${min} y ${max}.`,
        test: (valor) => {
          const numero = Number(valor);
          return Number.isInteger(numero) && numero >= min && numero <= max;
        }
      }
    ]
  }),
  

HoraMilitar: () => ({
    tipo: "string",
    validaciones: [
      {
        label: "Debe tener el formato de hora militar (HH:MM o HH:MM:SS).",
        test: (valor) => /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(valor),
      }
    ],
  }),
  

Duracion: (min = 1, max = 60) => ({
    tipo: "string",
    validaciones: [
        {
            label: "Debe estar en el formato correcto (Ejemplo: '12 Meses').",
            test: (valor) => new RegExp(`^([1-9]|[1-5][0-9]|60) w$`).test(valor), 
        },
        {
            label: `El número de meses debe estar entre ${min} y ${max}.`,
            test: (valor) => {
                const match = valor.match(/^(\d+) Meses$/);
                return match ? parseInt(match[1]) >= min && parseInt(match[1]) <= max : false;
            }
        }
    ]
}),


    
    

NombreCompuesto: (min = 10, max = 300) => ({
    tipo: "string",
    validaciones: [
      {
        label: `Debe contener entre ${min} y ${max} caracteres.`,
        test: (valor) =>
          typeof valor === "string" &&
          valor.trim().length >= min &&
          valor.trim().length <= max,
      },
      {
        label: "Solo se permiten letras, números y espacios.",
        test: (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(valor),
      },
      {
        label: "Debe contener al menos una vocal.",
        test: (valor) => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(valor),
      },
      {
        label: "No puede tener más de un espacio consecutivo.",
        test: (valor) => !/\s{2,}/.test(valor),
      },
      {
        label: "Cada palabra debe contener al menos una vocal o ser una sigla (ej. ONU, UTH).",
        test: (valor) =>
          valor
            .trim()
            .split(" ")
            .every(
              (palabra) =>
                /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(palabra) || /^[A-Z]{2,5}$/.test(palabra)
            ),
      },
      {
        label: "No puede ser una única letra repetida muchas veces.",
        test: (valor) => !/^([A-Za-z])\1{2,}$/.test(valor),
      },
      {
        label: "No debe tener patrones repetitivos como 'ababab', 'aabbaabb', o repeticiones exageradas.",
        test: (valor) => {
          const palabras = valor.trim().split(/\s+/);
          return !palabras.some((palabra) => {
            const repetido = /^(.+)\1{1,}$/i.test(palabra); // ababab, areareare
            const tripleLetra = /(.)\1{2,}/.test(palabra); // aaaa, eee
            const alternancia = /^(..+)\1{1,}$/.test(palabra); // abab, cdcd
            return repetido || tripleLetra || alternancia;
          });
        },
      },
    ],
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
    }),VariableEntorno: (min = 3, max = 255) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "No debe contener espacios en blanco.", test: (valor) => !/\s/.test(valor) },
            { label: "Solo se permiten letras, números, guiones, guiones bajos, puntos y @.", test: (valor) => /^[A-Za-z0-9._@-]+$/.test(valor) },
        ]
    }),
    Descripciones: (min = 10, max = 300) => ({
        tipo: "string",
        validaciones: [
            { 
                label: `Debe contener entre ${min} y ${max} caracteres.`, 
                test: (valor) => valor.length >= min && valor.length <= max 
            },
            { 
                label: "Solo se permiten letras, números, espacios y puntos en siglas.", 
                test: (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.]+$/.test(valor) 
            },
            { 
                label: "No puede tener más de un espacio consecutivo.", 
                test: (valor) => !/\s{2,}/.test(valor) 
            },
            { 
                label: "Cada palabra debe contener al menos una vocal o ser una sigla reconocida.", 
                test: (valor) => valor.split(/\s+/).every(
                    palabra => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(palabra) || /^[A-Z]{2,5}\.?$/.test(palabra)
                ) 
            },
            { 
                label: "No puede ser una única letra repetida muchas veces.", 
                test: (valor) => !/^([A-Za-z])\1+$/.test(valor) 
            },
            { 
                label: "Debe ser una oración con sentido (mínimo 1 palabras).", 
                test: (valor) => valor.split(/\s+/).length >= 1 
            }
        ]
    }),
    
    // ✅ Solo mayúsculas sin números ni símbolos
    TextoLibre: (min = 1, max = Infinity) => ({
        tipo: "string",
        validaciones: [
          {
            label: `Debe contener entre ${min} y ${max} caracteres.`,
            test: (valor) => typeof valor === "string" && valor.length >= min && valor.length <= max
          },
          {
            label: "Solo se permiten letras, números, espacios y caracteres como # y guiones.",
            test: (valor) => /^[A-ZÁÉÍÓÚÜÑa-záéíóúüñ0-9\s#\-]+$/.test(valor)
          }
        ]
      }),
      
    AppKeyGeneral: (min = 3, max = 80) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras (mayúsculas o minúsculas), números y guion bajo (_).", test: (valor) => /^[A-Za-z0-9_]+$/.test(valor) },
            { label: "Debe contener al menos 3 letras.", test: (valor) => /[A-Za-z].*[A-Za-z].*[A-Za-z]/.test(valor) },
            { label: "No debe contener espacios en blanco.", test: (valor) => !/\s/.test(valor) }
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
    NombreRol: (min = 3, max = 60) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Debe comenzar con una letra mayúscula.", test: (valor) => /^[A-ZÁÉÍÓÚÑ]/.test(valor) },
            { label: "Solo puede contener letras y espacios.", test: (valor) => /^[A-ZÁÉÍÓÚÑa-záéíóúñ\s]+$/.test(valor) },
            { label: "No puede contener números ni caracteres especiales.", test: (valor) => !/[0-9@#$%^&*()_+={}[\]:;'"<>?/\\|-]/.test(valor) },
            { label: "Debe contener al menos una vocal para asegurar que es una palabra válida.", test: (valor) => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(valor) },
            { label: "No puede tener más de 3 consonantes seguidas sin una vocal.", test: (valor) => !/[^AEIOUÁÉÍÓÚaeiouáéíóú]{4,}/.test(valor) },
            { label: "No puede tener más de un espacio consecutivo.", test: (valor) => !/\s{2,}/.test(valor) }
        ]
    }),
    
    AppKeyMayusculas: (min = 16, max = 128) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten caracteres en mayúsculas.", test: (valor) => valor === valor.toUpperCase() },
            { label: "No debe contener espacios en blanco al inicio o al final.", test: (valor) => valor.trim() === valor },
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
    Porcentaje: (min = 0, max = 100) => ({
        tipo: "decimal",
        validaciones: [
            { 
                label: `Debe ser un valor numérico entre ${min} y ${max}, con o sin el símbolo '%'.`, 
                test: (valor) => /^(\d{1,2}(\.\d{1,2})?|100(\.00?)?)%?$/.test(valor.trim()) 
            },
            { 
                label: `El valor debe estar entre ${min} y ${max}.`, 
                test: (valor) => {
                    const numero = parseFloat(valor.replace('%', ''));
                    return !isNaN(numero) && numero >= min && numero <= max;
                }
            }
        ]
    }),

    // ✅ Teléfono (Formato internacional)
    Telefono: () => ({
        tipo: "string",
        validaciones: [
            { label: "Debe ser un número de teléfono válido con entre 7 y 15 dígitos.", test: (valor) => /^\+?[0-9]{7,15}$/.test(valor) }
        ]
    }),
    NombreConAbreviatura: (min = 3, max = 60) => ({
        tipo: "string",
        validaciones: [
          {
            label: `Debe contener entre ${min} y ${max} caracteres.`,
            test: (valor) =>
              typeof valor === "string" &&
              valor.trim().length >= min &&
              valor.trim().length <= max,
          },
          {
            label: "Debe ser un nombre válido con letras, números, abreviaturas, guiones, puntos o #.",
            test: (valor) =>
              /^[A-ZÁÉÍÓÚÜÑa-záéíóúüñ0-9\s\-#\.]+$/.test(valor),
          },
          {
            label: "No debe contener caracteres especiales como @, %, $, &, etc.",
            test: (valor) =>
              !/[@%$&]/.test(valor),
          }
        ]
      }),
      

    NombreCompuestoConNumero: (min = 3, max = 60) => ({
        tipo: "string",
        validaciones: [
          {
            label: `Debe contener entre ${min} y ${max} caracteres.`,
            test: (valor) =>
              typeof valor === "string" && valor.length >= min && valor.length <= max,
          },
          {
            label: "Debe contener letras y puede tener números, pero con separación (espacio, guión o #).",
            test: (valor) =>
              /^[A-ZÁÉÍÓÚÜÑa-záéíóúüñ]+([ \-#]+[0-9A-ZÁÉÍÓÚÜÑa-záéíóúüñ]+)+$/.test(valor),
          },
          {
            label: "No debe contener caracteres especiales no permitidos como @, %, $, etc.",
            test: (valor) =>
              /^[A-ZÁÉÍÓÚÜÑa-záéíóúüñ0-9\s\-#]+$/.test(valor),
          },
        ],
      }),
      
    DescripcionGrado: (min = 5, max = 80) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
            { label: "Solo se permiten letras, números, espacios y signos de puntuación básicos (, . - #).", test: (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s,.\-#]+$/.test(valor) },
           // { label: "Cada palabra debe contener al menos una vocal.", test: (valor) => valor.split(/\s+/).every(palabra => /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(palabra)) },
            { label: "Debe ser una oración con sentido (mínimo 1 palabras).", test: (valor) => valor.trim().split(/\s+/).length >= 1 },
            { label: "No puede tener más de dos signos de puntuación consecutivos.", test: (valor) => !/([.,-]){3,}/.test(valor) },
            { label: "No puede iniciar ni terminar con un signo de puntuación.", test: (valor) => !/^[.,-]|[.,-]$/.test(valor) }
        ]
    }),
    DuracionAnios: (min = 1, max = 10) => ({
        tipo: "string",
        validaciones: [
            { label: "Debe estar en el formato correcto (Ejemplo: '4 Años').", test: (valor) => /^([1-9]|10) Años?$/.test(valor) },
            { label: `El número de años debe estar entre ${min} y ${max}.`, test: (valor) => {
                const match = valor.match(/^(\d+) Años?$/);
                return match ? parseInt(match[1]) >= min && parseInt(match[1]) <= max : false;
            }}
        ]
    }),

    Direccion: (min = 5, max = 200) => ({
        tipo: "string",
        validaciones: [
            { label: `Debe contener entre ${min} y ${max} caracteres.`, test: (valor) => valor.length >= min && valor.length <= max },
    
            { label: "Debe comenzar con una letra o número.", test: (valor) => /^[A-Za-z0-9]/.test(valor) },
    
            { label: "No debe tener más de un espacio consecutivo.", test: (valor) => !/\s{2,}/.test(valor) },
    
            { label: "Puede contener letras, números, comas, puntos, guiones y #.", test: (valor) => /^[A-Za-z0-9\s.,#-]+$/.test(valor) },
    
            { label: "Debe contener al menos un número (ejemplo: número de casa o avenida).", test: (valor) => /\d/.test(valor) },
    
            { label: "Debe contener al menos una palabra con sentido (ejemplo: nombre de calle, avenida, barrio).", test: (valor) => /[A-Za-z]+/.test(valor) },
    
            { label: "No puede contener caracteres especiales como @, $, %, &, *.", test: (valor) => !/[@$%&*]/.test(valor) },
    
            { label: "Formato válido: Calle 5 #23-45, Av. Central 123, Barrio Los Pinos, etc.", test: (valor) => true }
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