import { useState, useEffect } from "react";
import axios from "axios";

const PreguntasSeguridad = ({ idUsuario, onSave }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPreguntas();
  }, []);

  const fetchPreguntas = async () => {
    try {
      const response = await axios.get("/api/preguntas");
      setPreguntas(response.data);
    } catch (error) {
      setError("Error al obtener las preguntas de seguridad.");
    }
  };

  const handleSeleccionarPregunta = (index, preguntaId) => {
    const nuevasSeleccionadas = [...preguntasSeleccionadas];
    nuevasSeleccionadas[index] = preguntaId;
    setPreguntasSeleccionadas(nuevasSeleccionadas);
  };

  const handleRespuestaChange = (preguntaId, respuesta) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: respuesta }));
  };

  const handleGuardarRespuestas = async () => {
    if (preguntasSeleccionadas.length !== 3 || preguntasSeleccionadas.includes(undefined)) {
      setError("Debes seleccionar exactamente 3 preguntas.");
      return;
    }

    const respuestasFinales = preguntasSeleccionadas.map((id) => ({
      idPregunta: id,
      respuesta: respuestas[id] || "",
    }));

    if (respuestasFinales.some((r) => r.respuesta.trim() === "")) {
      setError("Todas las respuestas deben ser completadas.");
      return;
    }

    try {
      await axios.post("/api/preguntas/asignar", {
        idUsuario,
        respuestas: respuestasFinales,
      });

      setSuccess("Preguntas y respuestas guardadas correctamente.");
      if (onSave) onSave();
    } catch (error) {
      setError("Error al guardar respuestas.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Preguntas de Seguridad</h2>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      {success && <p className="text-green-500 text-center mt-2">{success}</p>}

      {[0, 1, 2].map((index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 mb-1">Pregunta {index + 1}</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            onChange={(e) => handleSeleccionarPregunta(index, e.target.value)}
            value={preguntasSeleccionadas[index] || ""}
          >
            <option value="" disabled>Selecciona una pregunta</option>
            {preguntas.map((pregunta) => (
              <option key={pregunta.Id_Pregunta} value={pregunta.Id_Pregunta}>
                {pregunta.Pregunta}
              </option>
            ))}
          </select>

          {preguntasSeleccionadas[index] && (
            <input
              type="text"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Tu respuesta"
              value={respuestas[preguntasSeleccionadas[index]] || ""}
              onChange={(e) => handleRespuestaChange(preguntasSeleccionadas[index], e.target.value)}
              required
            />
          )}
        </div>
      ))}

      <button
        onClick={handleGuardarRespuestas}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Guardar Preguntas y Respuestas
      </button>
    </div>
  );
};

export default PreguntasSeguridad;
