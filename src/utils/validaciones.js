export const validarFormulario = (formData, reglasValidacion) => {
    let errores = [];

    Object.keys(reglasValidacion).forEach((campo) => {
        const reglas = reglasValidacion[campo];

        // Verificar si el campo está ausente en formData
        if (!(campo in formData)) {
            errores.push(`El campo "${campo}" no está presente en los datos enviados.`);
            return; // Evita continuar con otras validaciones
        }

        const valor = formData[campo];

        // ✅ Validar si es requerido
        if (reglas.requerido && (valor === null || valor === undefined || valor.toString().trim() === "")) {
            errores.push(`El campo "${campo}" es obligatorio.`);
        }

        // ✅ Validar longitud mínima y máxima
        if (reglas.tipo === "string" && typeof valor === "string") {
            if (reglas.min && valor.length < reglas.min) {
                errores.push(`El campo "${campo}" debe tener al menos ${reglas.min} caracteres.`);
            }
            if (reglas.max && valor.length > reglas.max) {
                errores.push(`El campo "${campo}" no puede superar los ${reglas.max} caracteres.`);
            }
        }

        // ✅ Validar número entero
        if (reglas.tipo === "int" && (isNaN(parseInt(valor)) || !Number.isInteger(Number(valor)))) {
            errores.push(`El campo "${campo}" debe ser un número entero válido.`);
        }

        // ✅ Validar fecha
        if (reglas.tipo === "date" && valor && isNaN(Date.parse(valor))) {
            errores.push(`El campo "${campo}" debe ser una fecha válida en formato YYYY-MM-DD.`);
        }

        // ✅ Validar opciones permitidas (Ejemplo: Estado solo puede ser 0 o 1)
        if (reglas.opciones && !reglas.opciones.includes(parseInt(valor))) {
            errores.push(`El campo "${campo}" solo puede tener los valores: ${reglas.opciones.join(", ")}.`);
        }

        // ✅ Validar regex si existe
        if (reglas.regex && valor && !reglas.regex.test(valor)) {
            errores.push(`Error en el campo "${campo}": ${reglas.mensaje}`);
        }
    });

    return errores;
};
