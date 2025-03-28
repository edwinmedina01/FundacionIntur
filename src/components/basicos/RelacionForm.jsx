import React from "react";

const RelacionForm = ({
  tipoRelacion = "Tutor",
  personaRelacion,
  setPersonaRelacion,
  handleInputChange,
  handleSubmit,
  handleCancel,
  estados = [],
  permisos = {},
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonaRelacion({ ...personaRelacion, [name]: value });
  };

  const nombreCompleto = `${personaRelacion.Primer_Nombre || "Sin Nombre"} ${personaRelacion.Segundo_Nombre || ""} ${personaRelacion.Primer_Apellido || ""} ${personaRelacion.Segundo_Apellido || ""}`.trim();

  return (
    <div className="space-y-6 mt-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nombre Completo Estudiante
        </label>
        <input
          type="text"
          name="NombreCompleto"
          value={nombreCompleto}
          disabled
          className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="Identidad" className="text-gray-700 font-medium">Identidad</label>
          <input
            id="Identidad"
            name="Identidad"
            placeholder="Número de Identidad"
            value={personaRelacion.Identidad}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="Primer_Nombre" className="text-gray-700 font-medium">Nombre</label>
          <input
            id="Primer_Nombre"
            name="Primer_Nombre"
            placeholder="Primer Nombre"
            value={personaRelacion.Primer_Nombre}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="Primer_Apellido" className="text-gray-700 font-medium">Apellido</label>
          <input
            id="Primer_Apellido"
            name="Primer_Apellido"
            placeholder="Primer Apellido"
            value={personaRelacion.Primer_Apellido}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="Sexo" className="text-gray-700 font-medium">Sexo</label>
          <select
            id="Sexo"
            name="Sexo"
            value={personaRelacion.Sexo}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          >
            <option value="">Seleccione Sexo</option>
            <option value="1">Masculino</option>
            <option value="0">Femenino</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="Direccion" className="text-gray-700 font-medium">Dirección</label>
          <input
            id="Direccion"
            name="Direccion"
            placeholder={`Dirección del ${tipoRelacion}`}
            value={personaRelacion.Direccion}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="Estado" className="text-gray-700 font-medium">Estado</label>
          <select
            name="Estado"
            value={personaRelacion.Estado}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          >
            <option value="">Seleccione un estado</option>
            {estados.map((estado) => (
              <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
                {estado.Nombre_Estado}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="Telefono" className="text-gray-700 font-medium">Teléfono</label>
          <input
            id="Telefono"
            name="Telefono"
            placeholder={`Teléfono del ${tipoRelacion}`}
            value={personaRelacion.Telefono}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        {personaRelacion.esNuevo
          ? permisos.Permiso_Insertar === "1" && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Registrar
              </button>
            )
          : permisos.Permiso_Actualizar === "1" && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Actualizar
              </button>
            )}

        <button
          type="button"
          onClick={handleCancel}
          className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RelacionForm;
