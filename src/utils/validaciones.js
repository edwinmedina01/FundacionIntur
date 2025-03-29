export const validarFormulario = (formData, reglasValidacion, formularioId = null) => {
    const scope = formularioId ? document.getElementById(formularioId) : document;
    

    if (!scope) {
        console.warn(`⚠️ Formulario con ID '${formularioId}' no encontrado. Verifica si ya está en el DOM.`);
      }

    Object.keys(reglasValidacion).forEach((campo) => {
        const reglas = reglasValidacion[campo];
        const valor = formData[campo];
        const input = scope.querySelector(`[name="${campo}"]`);

        if (!input) return;

        let errorContainer = scope.querySelector(`#error-${campo}`);
        if (errorContainer) {
            errorContainer.remove();
        }

        errorContainer = document.createElement("div");
        errorContainer.id = `error-${campo}`;
        errorContainer.style.color = "red";
        errorContainer.style.fontSize = "12px";
        errorContainer.style.marginTop = "4px";

        let errores = [];

        if (reglas.requerido && (!valor || valor.toString().trim() === "")) {
            errores.push(`El campo "${campo}" es obligatorio.`);
        } else {
            if (reglas.opciones && !reglas.opciones.includes(valor)) {
                errores.push(`El campo "${campo}" solo puede tener los valores: ${reglas.opciones.join(", ")}.`);
            }

            if (reglas.tipo === "int") {
                const numero = Number(valor);
                if (isNaN(numero) || !Number.isInteger(numero)) {
                    errores.push(`El campo "${campo}" debe ser un número entero válido.`);
                } else {
                    formData[campo] = numero;
                }
            }

            if (reglas.validaciones) {
                reglas.validaciones.forEach(({ label, test }) => {
                    if (!test(valor)) {
                        errores.push(label);
                    }
                });
            }

            if (reglas.regexLista && Array.isArray(reglas.regexLista)) {
                reglas.regexLista.forEach(({ label, regex }) => {
                    if (!regex.test(valor)) {
                        errores.push(label);
                    }
                });
            }
        }

        if (errores.length > 0) {
            input.style.border = "1px solid red";

            errores.forEach((error) => {
                const errorElement = document.createElement("p");
                errorElement.textContent = error;
                errorContainer.appendChild(errorElement);
            });

            input.insertAdjacentElement("afterend", errorContainer);
        } else {
            input.style.border = "";
        }

        input.addEventListener("input", () => {
            if (errorContainer) {
                errorContainer.remove();
                input.style.border = "";
            }
        });
    });

    const erroresEnDOM = scope.querySelectorAll("[id^=error-]");
    return erroresEnDOM;
};
