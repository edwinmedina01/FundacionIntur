export const validatePasswordDetails = (password, confirmPassword = null, current = null) => {
    const checks = [
        { label: "Al menos 8 caracteres", test: /.{8,}/ },
        { label: "Máximo 100 caracteres", test: /^.{1,100}$/ },
        { label: "Al menos una letra mayúscula", test: /[A-Z]/ },
        { label: "Al menos una letra minúscula", test: /[a-z]/ },
        { label: "Al menos un número", test: /[0-9]/ },
        { label: "Al menos un carácter especial", test: /[^A-Za-z0-9]/ },
        // { label: "No debe contener espacios en blanco", test: /^[^\s]+$/ }
    ];

    // ✅ Validar si la nueva contraseña es igual a la actual
    if (current !== null) {
        checks.push({
            label: "La nueva contraseña no puede ser la misma que la actual",
            test: password !== current // ❌ Fallará si son iguales
        });
    }

    // ✅ Validar si la confirmación de contraseña coincide
    if (confirmPassword !== null) {
        checks.push({
            label: "Las contraseñas deben coincidir",
            test: password === confirmPassword // ✅ Deben ser iguales
        });
    }

    return checks.map(({ label, test }) => ({
        label,
        passed: typeof test === "boolean" ? test : test.test(password)
    }));
};
