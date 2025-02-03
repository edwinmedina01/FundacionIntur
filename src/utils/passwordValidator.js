export const validatePasswordDetails = (password) => {
    const checks = [
        { label: "Al menos 8 caracteres", test: /.{8,}/ },
        { label: "Máximo 100 caracteres", test: /^.{1,100}$/ },
        { label: "Al menos una letra mayúscula", test: /[A-Z]/ },
        { label: "Al menos una letra minúscula", test: /[a-z]/ },
        { label: "Al menos un número", test: /[0-9]/ },
        { label: "Al menos un carácter especial", test: /[^A-Za-z0-9]/ },
        { label: "No debe contener espacios en blanco", test: /^[^\s]+$/ }
    ];

    return checks.map(({ label, test }) => ({
        label,
        passed: test.test(password)
    }));
};
