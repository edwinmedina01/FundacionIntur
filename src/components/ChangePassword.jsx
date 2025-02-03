
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { validatePasswordDetails } from "../utils/passwordValidator";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importación correcta para Heroicons v2

export default function ChangePassword() {


 

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { token } = router.query;;
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState([]);
  const [showPasswordcurrent , setcurrentShowPassword] = useState(false);
  const [email, setEmail] = useState(null); // Guardar el email del usuario verificado
  const [ttl, setTtl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/verifyToken?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setEmail(data.email);
          setTtl(data.ttl);
        } else {
          setError(data.error || "❌ Token inválido o expirado.");
          setExpired(true);
          
        }
      })
      .catch(() => {
        setError("❌ Error verificando el token.");
        setExpired(true);
      });
  }, [token]);


    
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword); // Actualiza la contraseña
  
    // Ejecuta validación en tiempo real
    const validationResults = validatePasswordDetails(newPassword);
    setPasswordValidation(validationResults); // Guarda los resultados de la validación
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }



    // Validar nueva contraseña con las reglas definidas
    const validationResults = validatePasswordDetails(newPassword);
    setPasswordValidation(validationResults);

    // Si alguna regla no se cumple, mostrar mensaje y salir
    if (validationResults.some(rule => !rule.passed)) {
      setError('La nueva contraseña no cumple con los requisitos.');
      return;
    }

    // Aquí va la lógica para enviar la solicitud al backend
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setSuccess('Contraseña actualizada exitosamente');
        
        router.push('/inicio');
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Hubo un error al actualizar la contraseña');
      }
    } catch (err) {
      setError('Hubo un error con la solicitud');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      
      {email ? (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Cambiar Contraseña</h2>
        
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        
       
        <form onSubmit={handleChangePassword} className="space-y-4">
         {/* Actual Contraseña */}
         <div className="relative">
            <label className="block text-gray-700">Contraseña Actual*</label>
            <input
               id="currentPassword"
              type={showPasswordcurrent ? "text" : "password"}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            {/* Botón de mostrar/ocultar */}
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setcurrentShowPassword(!showPasswordcurrent)}
            >
              {showPasswordcurrent ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>

    
          </div>

           {/* Nueva Contraseña */}
     <div className="relative">
            <label className="block text-gray-700">Nueva Contraseña *</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={newPassword}
              onChange={handlePasswordChange} 
              required
            />
            {/* Botón de mostrar/ocultar */}
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>

            {/* Lista de validaciones */}
            <ul className="mt-2 text-sm">
              {passwordValidation?.map(({ label, passed }, index) => (
                <li key={index} className={passed ? "text-green-600" : "text-red-600"}>
                  {passed ? "✔️" : "❌"} {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div className="relative">
            <label className="block text-gray-700">Confirmar Nueva Contraseña *</label>
            <input
              type={showPassword2 ? "text" : "password"}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {/* Botón de mostrar/ocultar */}
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Cambiar Contraseña
          </button>
        </form>
        </div>
        ): 
           <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
           <h1 className="text-3xl font-bold text-red-600">❌ Error</h1>
           <p className="text-gray-600">El token es inválido o ha expirado.</p>

          </div>
        
        }
    
    </div>
  );
}
