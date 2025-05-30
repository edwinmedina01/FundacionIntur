import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify'; // Importar toast
import { validatePasswordDetails } from "../utils/passwordValidator";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importación correcta para Heroicons v2
import PreguntasSeguridad from "../components/otrosMantenimientos/PreguntasSeguridad";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
// Asegúrate de tener el CSS de react-toastify en tu archivo principal
import 'react-toastify/dist/ReactToastify.css';
const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPasswordcurrent , setcurrentShowPassword] = useState(false);
    const [mostrarPreguntas, setMostrarPreguntas] = useState(false);
    const [yaTienePreguntas, setYaTienePreguntas] = useState(false);

    const router = useRouter();
 //   const [message, setMessage] = useState('');

 useEffect(() => {
    const fetchProfile = async () => {
        const response = await fetch('/api/profile');
        if (response.ok) {
            const data = await response.json();
            setProfile(data);
            fetchPreguntas(data); // Llama a la función para obtener las preguntas de seguridad
        } else {
            console.error('Error al obtener el perfil');
        }
    };

    fetchProfile();

}, [user]);

const [preguntas, setPreguntas] = useState([]);

const fetchPreguntas = async (data) => {
  const res = await axios.post("/api/auth/obtener-preguntas", { username: data.nombre });
  
  if (res.data.yaTienePreguntas) {
    toast.warning("Ya configuraste tus preguntas. No se pueden modificar.");
    setYaTienePreguntas(res.data.yaTienePreguntas);
    return;
  }
  

  setPreguntas(res.data.preguntas);
};


const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword); // Actualiza la contraseña
  
    // Ejecuta validación en tiempo real
    const validationResults = validatePasswordDetails(newPassword);
    setPasswordValidation(validationResults); // Guarda los resultados de la validación
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
              // Eliminar la cookie del token correctamente
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

      await axios.post("/api/auth/logout");
      
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        toast.info("Las contraseñas no coinciden."); // Usar toast.info
        return;
    }


    if (newPassword === currentPassword) {
        toast.warning("La nueva contraseña no puede ser igual a la actual.");
        return;
    }


    const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.ok) {
        toast.success("Contraseña cambiada exitosamente."); // Usar toast.success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        handleLogout();

    } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al cambiar la contraseña."); // Usar toast.error
    }
};

const handleCopyEmail = () => {
    if (profile?.email) {
        navigator.clipboard.writeText(profile.email)
            .then(() => {
                toast.info("Correo copiado al portapapeles."); // Usar toast.info
            })
            .catch((err) => {
                toast.error("Error al copiar el correo."); // Usar toast.error
            });
    }
};
    if (!profile) {
        return <div className="text-center text-gray-500">Cargando perfil...</div>;
    }

    return (
<div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-10 my-8">
    <div className="flex flex-col items-center mb-8">
        {/* <img
            src="/img/user.png"
            alt="user"
            className="w-28 h-28 object-cover rounded-full border-4 border-blue-600 shadow-xl"
        /> */}

<Image src="/img/user.png"  alt="user"
            className="w-28 h-28 object-cover rounded-full border-4 border-blue-600 shadow-xl"
   width={150} height={50} priority />
    

        <h1 className="text-4xl font-bold text-blue-800 mt-6">Perfil de Usuario</h1>
    </div>
    <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={() => setMostrarPreguntas(true)}
        >
          Configurar Preguntas de Seguridad
        </button>

        {mostrarPreguntas && (
  <div className="mt-6">
  {yaTienePreguntas ? (
    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md text-center font-semibold">
      ⚠️ Ya configuraste tus preguntas de seguridad.  
      <br />No se pueden modificar.
    </div>
  ) : (
    <PreguntasSeguridad idUsuario={profile.id} onSave={() => setMostrarPreguntas(false)} />
  )}
</div>

        )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10 border-t border-gray-200 pt-10">
        {/* Columna de Detalles del Perfil */}
        <div className="space-y-10">
            <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center md:text-left">Detalles del Perfil</h2>
            <div className="space-y-8">
                <div className="flex justify-between items-center text-lg font-medium text-gray-600">
                    <p>ID:</p>
                    <p className="text-blue-900">{profile.id}</p>
                </div>
                <div className="flex justify-between items-center text-lg font-medium text-gray-600">
                    <p>Nombre:</p>
                    <p className="text-gray-900 font-semibold">{profile.nombre}</p>
                </div>
                {/* <div className="flex justify-between items-center text-lg font-medium text-gray-600">
                    <p>Rol:</p>
                    <p className="text-red-700 font-semibold">{profile.rol}</p>
                </div> */}
                <div className="flex justify-between items-center text-lg font-medium text-gray-600">
                <p>Email:</p>
                                <p className="text-blue-900">{profile.email}</p>
                                <button
                                    onClick={handleCopyEmail}
                                    className="ml-1 p-35  rounded-lg transition duration-200"
                                    title="Copiar correo"
                                >
                                    <DocumentDuplicateIcon className="h-6 w-6 mr-4" />
                                </button>
                            </div>
                <div className="flex justify-between items-center text-lg font-medium text-gray-600">
                    <p>Estado:</p>
                    <p className="text-green-700 font-semibold">{profile.estado}</p>
                </div>
            </div>
        </div>

        {/* Columna de Cambio de Contraseña */}
        <div className="space-y-8 border-l-4 border-gray-200 pl-12">
            <h3 className="text-3xl font-semibold text-blue-700 mb-6 text-center md:text-left">Cambiar Contraseña</h3>
            <form onSubmit={handleChangePassword} className="space-y-6">

       
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
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200"
                >
                    Cambiar Contraseña
                </button>
            </form>

        </div>
    </div>
</div>

    );
};

export default Profile;
