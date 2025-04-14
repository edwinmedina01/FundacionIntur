import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { validatePasswordDetails } from "../utils/passwordValidator";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importación correcta para Heroicons v2
import { useRouter } from "next/router"; // Importar useRouter de Next.js

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/enviarcorreo", { email });
      setMessage(response.data.message);
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "Hubo un error, intenta nuevamente.");
      setMessage("");
    }
  };

  const handleGetSecurityQuestions = async () => {
    try {
      const response = await axios.post("/api/auth/restablecer/obtener-preguntas", { username });
      setPreguntas(response.data.preguntas);
      setIdUsuario(response.data.idUsuario);
      setShowSecurityQuestions(true);
      setMensaje("");
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al obtener preguntas.");
    }
  };
  const router = useRouter(); // Inicializar useRouter

  const handleValidateSecurityAnswers = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post("/api/auth/restablecer/validar-respuestas", {
        idUsuario,
        respuestas: preguntas.map((p) => ({
          idPregunta: p.idPregunta,
          respuesta: respuestas[p.idPregunta] || "",
        })),
      });

      setMensaje("✅ Respuestas correctas. Ahora puedes cambiar tu contraseña.");
      setQuestionsLoaded(true);
      setShowPasswordFields(true);
    } catch (error) {
      setMensaje("❌ Respuestas incorrectas. Inténtalo de nuevo.");
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordValidation(validatePasswordDetails(password,confirmPassword));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (passwordValidation.some((rule) => !rule.passed)) {
      setError("La nueva contraseña no cumple con los requisitos.");
      return;
    }

    try {
      await axios.post("/api/auth/restablecer/cambiar-contrasena", {
        idUsuario,
        nuevaContrasena: newPassword,
      });

      setMessage("✅ Contraseña cambiada con éxito.");
      setShowPasswordFields(false);

      setTimeout(() => {
        router.push("/login"); // Reemplaza con la ruta correcta de tu login
      }, 3000);
  
    } catch (error) {
      setError("❌ Error al cambiar la contraseña.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {!questionsLoaded ? "Recuperar Contraseña" : "Restablecer contraseña por preguntas secretas"}
        </h1>

        {message && <p className="mb-4 text-center text-green-600">{message}</p>}
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}

        {!showSecurityQuestions ? (
          <>
            {/* RESTABLECER POR CORREO */}
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Ingresa tu correo"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                Enviar instrucciones por correo
              </button>
            </form>

            <div className="mt-4 text-center">
              <button className="text-gray-500 hover:underline" onClick={() => setShowSecurityQuestions(true)}>
                Recuperar con preguntas secretas
              </button>
            </div>
          </>
        ) : (
          <>
            {showPasswordFields && (
              <form onSubmit={handleChangePassword} className="mt-4">
                <div className="mb-4 relative">
                  <label className="block text-gray-700 mb-2">Nueva Contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-10 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                  <ul className="mt-2 text-sm">
                    {passwordValidation.map(({ label, passed }, index) => (
                      <li key={index} className={passed ? "text-green-600" : "text-red-600"}>
                        {passed ? "✔️" : "❌"} {label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 relative">
                  <label className="block text-gray-700 mb-2">Confirmar Contraseña</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-10 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                  Cambiar Contraseña
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
