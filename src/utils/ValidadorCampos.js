export const validateNombre = (nombre) => {
    if (nombre.trim() === "") {
      return { isValid: false, message: "El nombre no puede estar vacío." };
    }
  
    if (/^\s|\s$/.test(nombre)) {
      return { isValid: false, message: "El nombre no debe empezar ni terminar con espacios." };
    }
  
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/.test(nombre)) {
      return { isValid: false, message: "El nombre solo puede contener letras y espacios entre palabras." };
    }
  
    const palabras = nombre.trim().split(/\s+/); // Divide en palabras sin contar espacios extras
    if (palabras.length < 2) {
      return { isValid: false, message: "Debe ingresar al menos un nombre y un apellido." };
    }
  
    return { isValid: true, message: "Nombre válido." };
  };


  
  export const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{3,80}$/; // Permite solo letras y números, sin espacios, entre 3 y 80 caracteres
    return regex.test(username) && !/\s/.test(username); // Verifica que no tenga espacios
};




export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Validación de email
  return regex.test(email);
};

