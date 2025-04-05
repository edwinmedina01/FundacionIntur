import React from "react";

const RelacionForm = ({
  tipoRelacion = "Tutor",
  personaDataRelacion,
  setPersonaDataRelacion,
  handleInputChange,
  handleSubmit,
  handleCancel,
  estados = [],
  permisos = {},
  formId = "formRelacion", // ID del formulario para usar en validaciones DOM si lo deseas
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonaDataRelacion({ ...personaDataRelacion, [name]: value });
  };

  const titulo = personaDataRelacion?.esNuevo
    ? `Agregar ${tipoRelacion}`
    : `Editar ${tipoRelacion}`;

  const textoBoton = personaDataRelacion?.esNuevo ? "Registrar" : "Actualizar";

  return (
    <form id={formId} className="space-y-6 mt-4">
      {/* <h2 className="text-2xl font-bold text-gray-700 mb-4">{titulo}</h2> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="Identidad" className="text-gray-700 font-medium">Identidad</label>
          <input
          type="text"
            id="Identidad"
            name="Identidad"
            typeof="text"
            placeholder="Número de Identidad"
            value={personaDataRelacion?.Identidad}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="Primer_Nombre" className="text-gray-700 font-medium">Nombres</label>
          <input
            id="Primer_Nombre"
            name="Primer_Nombre"
            placeholder="Primer Nombre"
            value={personaDataRelacion?.Primer_Nombre}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="Primer_Apellido" className="text-gray-700 font-medium">Apellidos</label>
          <input
            id="Primer_Apellido"
            name="Primer_Apellido"
            placeholder="Primer Apellido"
            value={personaDataRelacion?.Primer_Apellido}
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
            value={personaDataRelacion?.Sexo}
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

        <textarea
    id="Direccion"
    name="Direccion"
    placeholder="Dirección"
    value={personaDataRelacion?.Direccion || ''}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 resize-none text-sm overflow-hidden"
    style={{ minHeight: '2.5rem', lineHeight: '1.25rem' }}
    onInput={(e) => {
      e.target.style.height = 'auto'; // 🧼 Reset
      e.target.style.height = `${e.target.scrollHeight}px`; // 📏 Ajuste
    }}
  />
</div>


        <div className="flex flex-col">
          <label htmlFor="Estado" className="text-gray-700 font-medium">Estado</label>
          <select
            name="Estado"
            value={personaDataRelacion?.Estado}
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
            value={personaDataRelacion?.Telefono}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        {permisos?.Permiso_Insertar === "1" && personaDataRelacion?.esNuevo && (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Registrar {tipoRelacion}
          </button>
        )}

        {permisos?.Permiso_Actualizar === "1" && !personaDataRelacion?.esNuevo && (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Actualizar {tipoRelacion}
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
    </form>
  );
};

export default RelacionForm;
