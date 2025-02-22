import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";

const EstudiantesCrud = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // Estado del paso actual
  const [estudianteData, setEstudianteData] = useState({
    Primer_Nombre: "",
    Segundo_Nombre: "",
    Primer_Apellido: "",
    Segundo_Apellido: "",
    Identidad: "",
    Sexo: "",
    Fecha_Nacimiento: "",
    Lugar_Nacimiento: "",
    Telefono: "",
    Direccion: "",
    Id_Beneficio: "",
    Id_Area: "",
    Id_Instituto: "",
  });

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  // Función para regresar al paso anterior
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <Layout>
      {/* Barra de Progreso */}
      <div className="mb-6">
        <ProgressBar percent={(currentStep - 1) * 33.33} filledBackground="blue">
          <Step>{({ accomplished }) => <div className={accomplished ? "completed" : "step"}>1</div>}</Step>
          <Step>{({ accomplished }) => <div className={accomplished ? "completed" : "step"}>2</div>}</Step>
          <Step>{({ accomplished }) => <div className={accomplished ? "completed" : "step"}>3</div>}</Step>
          <Step>{({ accomplished }) => <div className={accomplished ? "completed" : "step"}>4</div>}</Step>
        </ProgressBar>
      </div>

      <form className="bg-white p-6 rounded-lg shadow-md">
        {/* Paso 1: Información Personal */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">📋 Información Personal</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700">Primer Nombre</label>
                <input
                  type="text"
                  name="Primer_Nombre"
                  value={estudianteData.Primer_Nombre}
                  onChange={(e) => setEstudianteData({ ...estudianteData, Primer_Nombre: e.target.value })}
                  className="border p-3 w-full rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-700">Primer Apellido</label>
                <input
                  type="text"
                  name="Primer_Apellido"
                  value={estudianteData.Primer_Apellido}
                  onChange={(e) => setEstudianteData({ ...estudianteData, Primer_Apellido: e.target.value })}
                  className="border p-3 w-full rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-700">Identidad</label>
                <input
                  type="text"
                  name="Identidad"
                  value={estudianteData.Identidad}
                  onChange={(e) => setEstudianteData({ ...estudianteData, Identidad: e.target.value })}
                  className="border p-3 w-full rounded"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Datos del Tutor */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">👨‍👩‍👦 Tutor/Padre</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700">Nombre del Tutor</label>
                <input type="text" className="border p-3 w-full rounded" />
              </div>
              <div>
                <label className="text-gray-700">Teléfono</label>
                <input type="text" className="border p-3 w-full rounded" />
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Datos del Benefactor */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">💰 Benefactor</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700">Nombre del Benefactor</label>
                <input type="text" className="border p-3 w-full rounded" />
              </div>
              <div>
                <label className="text-gray-700">Teléfono</label>
                <input type="text" className="border p-3 w-full rounded" />
              </div>
            </div>
          </div>
        )}

        {/* Paso 4: Confirmación */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Revisión Final</h2>
            <p>Revisa los datos antes de guardar.</p>
          </div>
        )}

        {/* Botones de Navegación */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Atrás
            </button>
          )}
          {currentStep < 4 ? (
            <button type="button" onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Siguiente
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Guardar Registro
            </button>
          )}
        </div>
      </form>
    </Layout>
  );
};

export default EstudiantesCrud;
