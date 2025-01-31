export const validatePasswordDetails = (password) => {
    const checks = [
        { label: "Al menos 8 caracteres", test: /.{8,}/ },
        { label: "Al menos una letra mayúscula", test: /[A-Z]/ },
        { label: "Al menos una letra minúscula", test: /[a-z]/ },
        { label: "Al menos un número", test: /[0-9]/ },
        { label: "Al menos un carácter especial", test: /[^A-Za-z0-9]/ },
    ];

    return checks.map(({ label, test }) => ({
        label,
        passed: test.test(password)
    }));
};
