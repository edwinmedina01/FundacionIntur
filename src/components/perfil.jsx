import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify'; // Importar toast

// Asegúrate de tener el CSS de react-toastify en tu archivo principal
import 'react-toastify/dist/ReactToastify.css';
const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
 //   const [message, setMessage] = useState('');

 useEffect(() => {
    const fetchProfile = async () => {
        const response = await fetch('/api/profile');
        if (response.ok) {
            const data = await response.json();
            setProfile(data);
        } else {
            console.error('Error al obtener el perfil');
        }
    };

    fetchProfile();
}, []);

const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        toast.info("Las contraseñas no coinciden."); // Usar toast.info
        return;
    }

    const response = await fetch('/api/change-password', {
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
        <img
            src="/img/user.png"
            alt="user"
            className="w-28 h-28 object-cover rounded-full border-4 border-blue-600 shadow-xl"
        />
        <h1 className="text-4xl font-bold text-blue-800 mt-6">Perfil de Usuario</h1>
    </div>

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
                <div className="flex justify-between items-center text-lg font-medium text-gray-600">
                    <p>Rol:</p>
                    <p className="text-red-700 font-semibold">{profile.rol}</p>
                </div>
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
                <div>
                    <label className="block text-gray-700 font-medium" htmlFor="currentPassword">Contraseña Actual</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-3 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium" htmlFor="newPassword">Nueva Contraseña</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-3 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium" htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-3 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        required
                    />
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
