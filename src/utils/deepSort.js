/**
 * Ordena una lista de objetos alfabéticamente por una clave (puede estar anidada)
 * 
 * @param {Array} lista - Lista de objetos a ordenar.
 * @param {string} keyPath - Ruta de la propiedad para ordenar, puede ser anidada (ej. "Persona.Primer_Nombre").
 * @param {boolean} asc - Orden ascendente (true) o descendente (false).
 * @returns {Array} - Lista ordenada.
 */
export const deepSort = (lista, keyPath, asc = true) => {
  if (!Array.isArray(lista) || !keyPath) return lista;

  const getValueByPath = (obj, path) =>
    path.split('.').reduce((acc, part) => acc && acc[part], obj);

  return [...lista].sort((a, b) => {
    const valA = getValueByPath(a, keyPath);
    const valB = getValueByPath(b, keyPath);

    // Si alguno es null o undefined
    if (valA == null && valB != null) return asc ? 1 : -1;
    if (valB == null && valA != null) return asc ? -1 : 1;
    if (valA == null && valB == null) return 0;

    // Si son fechas válidas
    const dateA = new Date(valA);
    const dateB = new Date(valB);
    const sonFechasValidas = !isNaN(dateA) && !isNaN(dateB);

    if (sonFechasValidas) {
      return asc ? dateA - dateB : dateB - dateA;
    }

    // Si son números
    if (!isNaN(valA) && !isNaN(valB)) {
      return asc ? valA - valB : valB - valA;
    }

    // Si son strings
    if (typeof valA === 'string' && typeof valB === 'string') {
      return asc
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0; // No se puede comparar
  });
};
