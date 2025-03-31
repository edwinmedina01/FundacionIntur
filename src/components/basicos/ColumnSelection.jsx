import { useState } from 'react';

const ColumnSelection = ({ onColumnChange }) => {
  // Estado para controlar las columnas visibles
  const [selectedColumns, setSelectedColumns] = useState({
    estudiante: true, // Mostrar "Estudiante" por defecto
    persona: true, // Mostrar "Persona" por defecto
    matricula: false, // "Matrícula" inicialmente oculta
    tutor: false, // "Tutor" inicialmente oculto
    benefactor: false, // "Benefactor" inicialmente oculto
    estado: true // "Estado" inicialmente oculto
  });

  // Función para manejar el cambio de visibilidad de las columnas
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedColumns((prevState) => {
      const updatedColumns = { ...prevState, [name]: checked };
      onColumnChange(updatedColumns); // Pasar los cambios al componente padre
      return updatedColumns;
    });
  };

  return (
    <div className="mb-4">
     
      <div className="flex gap-4 mt-2">
        {/* <label>
          <input
            type="checkbox"
            name="estudiante"
            checked={selectedColumns.estudiante}
            onChange={handleCheckboxChange}
          />
          Estudiante
        </label> */}

        <label>
          <input
            type="checkbox"
            name="matricula"
            checked={selectedColumns.matricula}
            onChange={handleCheckboxChange}
          />
          Matrícula
        </label>
        <label>
          <input
            type="checkbox"
            name="tutor"
            checked={selectedColumns.tutor}
            onChange={handleCheckboxChange}
          />
          Tutor
        </label>
        <label>
          <input
            type="checkbox"
            name="benefactor"
            checked={selectedColumns.benefactor}
            onChange={handleCheckboxChange}
          />
          Benefactor
        </label>

      </div>
    </div>
  );
};

export default ColumnSelection;
