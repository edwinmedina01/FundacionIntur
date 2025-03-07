export const validarFormulario = (formData, reglasValidacion) => {
    Object.keys(reglasValidacion).forEach((campo) => {
        const reglas = reglasValidacion[campo];
        const valor = formData[campo];
        const input = document.querySelector(`[name="${campo}"]`);

        if (!input) return; // Evita errores si el input no existe

        // Elimina mensajes de error previos
        let errorContainer = document.querySelector(`#error-${campo}`);
        if (errorContainer) {
            errorContainer.remove();
        }

        // Crear un nuevo contenedor de errores si hay errores
        errorContainer = document.createElement("div");
        errorContainer.id = `error-${campo}`;
        errorContainer.style.color = "red";
        errorContainer.style.fontSize = "12px";
        errorContainer.style.marginTop = "4px";

        let errores = [];

        // ✅ Verificar si el campo está vacío
        if (reglas.requerido && (!valor || valor.toString().trim() === "")) {
            errores.push(`El campo "${campo}" es obligatorio.`);
        } else {
            // ✅ Verificar si el campo tiene opciones predefinidas
            if (reglas.opciones && !reglas.opciones.includes(valor)) {
                errores.push(`El campo "${campo}" solo puede tener los valores: ${reglas.opciones.join(", ")}.`);
            }

            // ✅ Verificar si el campo debe ser un número entero
            if (reglas.tipo === "int" && (isNaN(parseInt(valor)) || !Number.isInteger(Number(valor)))) {
                errores.push(`El campo "${campo}" debe ser un número entero válido.`);
            }

            // ✅ Aplicar validaciones generales
            if (reglas.validaciones) {
                reglas.validaciones.forEach(({ label, test }) => {
                    if (!test(valor)) {
                        errores.push(label);
                    }
                });
            }

            // ✅ Aplicar validaciones específicas con regexLista si existen
            if (reglas.regexLista && Array.isArray(reglas.regexLista)) {
                reglas.regexLista.forEach(({ label, regex }) => {
                    if (!regex.test(valor)) {
                        errores.push(label);
                    }
                });
            }
        }

        // ✅ Si hay errores, insertarlos debajo del input
        if (errores.length > 0) {
            input.style.border = "1px solid red"; // Resalta el campo con error

            errores.forEach((error) => {
                const errorElement = document.createElement("p");
                errorElement.textContent = error;
                errorContainer.appendChild(errorElement);
            });

            // Insertar el contenedor después del input
            input.insertAdjacentElement("afterend", errorContainer);
        } else {
            input.style.border = ""; // Elimina el borde rojo si se corrige el error
        }

        // ✅ Evento para eliminar errores cuando se corrige el valor
        input.addEventListener("input", () => {
            if (errorContainer) {
                errorContainer.remove();
                input.style.border = "";
            }
        });
    });

    // Verifica si aún hay errores visibles en el DOM
    const erroresEnDOM = document.querySelectorAll("[id^=error-]");
    return erroresEnDOM ; // Devuelve listado si el formulario es válido
};
