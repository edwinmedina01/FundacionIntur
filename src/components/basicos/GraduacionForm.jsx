import React from 'react';

const GraduacionForm = ({
  personaData,
  graduacion,
  handleChange,
  handleSubmitGraduacion,
  isEditing,
  permisos,
  resetForm,
  estados
}) => {
  return (
    <div>
      <form onSubmit={handleSubmitGraduacion}>
        {/* Nombre Completo Estudiante */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Nombre Completo Estudiante
          </label>
          <input
            type="text"
            name="NombreCompleto"
            value={`${
              personaData.Primer_Nombre || "Sin Nombre"
            } ${personaData.Segundo_Nombre || ""} ${
              personaData.Primer_Apellido || ""
            } ${personaData.Segundo_Apellido || ""}`.trim()}
            disabled
            className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Año */}
        <div>
          <label htmlFor="Anio" className="block mb-2 text-sm font-medium text-gray-700">
            Año:
          </label>
          <input
            type="number"
            name="Anio"
            value={graduacion.Anio}
            onChange={handleChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el año"
          />
        </div>

        {/* Fecha de Inicio */}
        <div>
          <label htmlFor="Fecha_Inicio" className="block mb-2 text-sm font-medium text-gray-700">
            Fecha de Inicio:
          </label>
          <input
            type="date"
            name="Fecha_Inicio"
            value={graduacion.Fecha_Inicio}
            onChange={handleChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fecha de Finalización */}
        <div>
          <label htmlFor="Fecha_Final" className="block mb-2 text-sm font-medium text-gray-700">
            Fecha de Finalización:
          </label>
          <input
            type="date"
            name="Fecha_Final"
            value={graduacion.Fecha_Final}
            onChange={handleChange}
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Estado */}
        <div>
          <label>Estado:</label>
          <select
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="Estado"
            value={graduacion.Estado || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un estado</option>
            {estados.map((estado) => (
              <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
                {estado.Nombre_Estado}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end">
          {isEditing ? (
            // Mostrar botón "Actualizar" solo si tiene permisos de actualización
            permisos.Permiso_Actualizar === "1" && (
              <button
                onClick={handleSubmitGraduacion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Actualizar
              </button>
            )
          ) : (
            // Mostrar botón "Agregar" solo si tiene permisos de inserción
            permisos.Permiso_Insertar === "1" && (
              <button
                onClick={handleSubmitGraduacion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agregar
              </button>
            )
          )}

          {/* Botón de Cancelar */}
          <button
            type="button"
            onClick={resetForm}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default GraduacionForm;
