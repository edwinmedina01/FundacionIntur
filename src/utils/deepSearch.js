export const deepSearchSimple = (data, query, depth = 0, maxDepth = 3) => {
  console.log("deepSearchSimple");
  console.log("data",data);
  
  if (depth > maxDepth || data == null) return false; // Límite de profundidad
  
    // Convertir el valor a un string para hacer la búsqueda
    let valueString = "";
  
    if (typeof data === "string") {
      valueString = data.toLowerCase();
    } else if (typeof data === "number" || typeof data === "boolean") {
      valueString = String(data).toLowerCase(); // Convertir números y booleanos a string
    } else if (data instanceof Date) {
      valueString = data.toISOString().split("T")[0]; // Convertir fecha a YYYY-MM-DD
    } else if (Array.isArray(data)) {
      return data.some((item) => deepSearch(item, query, depth + 1, maxDepth)); // Buscar dentro del array
    } else if (typeof data === "object") {
      return Object.values(data).some((value) => deepSearch(value, query, depth + 1, maxDepth)); // Buscar dentro del objeto
    }
  
    // Comparar el valor convertido con la consulta
    return valueString.includes(query.toLowerCase());
  };
  
  export const deepSearchv1 = (data, query, depth = 0, maxDepth = 3) => {
    if (depth > maxDepth || data == null) return false; // Límite de profundidad
  
    console.log("deepSearch");
  console.log("data",data,"query",query);
    if (typeof data !== "object") {
      return false; // Evita buscar en valores primitivos directamente
    }
  
    return Object.entries(query).every(([key, value]) => {
      if (!value) return true; // Si el filtro está vacío, lo ignora
  
      return Object.entries(data).some(([dataKey, dataValue]) => {
        if (depth > maxDepth) return false; // Evita sobrepasar la profundidad
  
        // Si hay una coincidencia exacta de clave, comparar el valor
        if (key === "general") {
          // Búsqueda en todos los campos
          return typeof dataValue === "string" && dataValue.toLowerCase().includes(value.toLowerCase());
        } else if (key === dataKey) {
          if (typeof dataValue === "string") {
            return dataValue.toLowerCase().includes(value.toLowerCase());
          } else if (typeof dataValue === "number" || typeof dataValue === "boolean") {
            return String(dataValue).toLowerCase().includes(value.toLowerCase());
          } else if (dataValue instanceof Date) {
            return dataValue.toISOString().split("T")[0].includes(value);
          } else if (Array.isArray(dataValue)) {
            return dataValue.some((item) => deepSearch(item, { general: value }, depth + 1, maxDepth));
          } else if (typeof dataValue === "object") {
            return deepSearch(dataValue, { general: value }, depth + 1, maxDepth);
          }
        }
  
        return false;
      });
    });
  };
  
  export const deepSearch = (data, query, depth = 0, maxDepth = 3) => {
    if (depth > maxDepth || !data) return false; // Límite de profundidad o datos vacíos
  
    if (typeof data !== "object") {
        return false; // No buscar en valores primitivos directamente
    }

    return Object.entries(query).every(([key, value]) => {
        if (!value) return true; // Si el filtro está vacío, lo ignora

        return Object.entries(data).some(([dataKey, dataValue]) => {
            if (depth > maxDepth) return false; // Límite de profundidad

            if (key === "general") {
                // 🔍 Busca en **todos** los campos y subobjetos
                if (typeof dataValue === "string") {
                    return dataValue.toLowerCase().includes(value.toLowerCase());
                } 
                else if (typeof dataValue === "number" || typeof dataValue === "boolean") {
                    return String(dataValue).includes(value);
                } 
                else if (dataValue instanceof Date) {
                    return dataValue.toISOString().split("T")[0].includes(value);
                } 
                else if (Array.isArray(dataValue)) {
                    return dataValue.some((item) => deepSearch(item, query, depth + 1, maxDepth));
                } 
                else if (typeof dataValue === "object") {
                    return deepSearch(dataValue, query, depth + 1, maxDepth);
                }
            } 
            else if (key === dataKey) {
                // 🔍 Busca en la propiedad específica indicada
                if (typeof dataValue === "string") {
                    return dataValue.toLowerCase().includes(value.toLowerCase());
                } 
                else if (typeof dataValue === "number" || typeof dataValue === "boolean") {
                    return String(dataValue).includes(value);
                } 
                else if (dataValue instanceof Date) {
                    return dataValue.toISOString().split("T")[0].includes(value);
                } 
                else if (Array.isArray(dataValue)) {
                    return dataValue.some((item) => deepSearch(item, { general: value }, depth + 1, maxDepth));
                } 
                else if (typeof dataValue === "object") {
                    return deepSearch(dataValue, { general: value }, depth + 1, maxDepth);
                }
            }

            return false;
        });
    });
};
