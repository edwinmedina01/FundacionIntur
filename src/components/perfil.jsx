import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

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
            setMessage("Las contraseñas no coinciden.");
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
            setMessage("Contraseña cambiada exitosamente.");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            const errorData = await response.json();
            setMessage(errorData.message || "Error al cambiar la contraseña.");
        }
    };

    if (!profile) {
        return <div className="text-center text-gray-500">Cargando perfil...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
            <div className="flex flex-col items-center mb-8">
                <img
                    src="/img/user.png"
                    alt="user"
                    className="w-24 h-24 object-cover rounded-full border-4 border-blue-600"
                />
                <h1 className="text-3xl font-semibold text-blue-800 mt-4">Perfil de Usuario</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 border-t border-gray-200 pt-8">
                {/* Columna de Detalles del Perfil */}  
                <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center md:text-left">Detalles del Perfil</h2>
                    <div className="space-y-6 text-center">
                        <div>
                            <p className="font-medium text-gray-600">ID:</p>
                            <p className="text-blue-900">{profile.id}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">Nombre:</p>
                            <p className="text-black font-semibold">{profile.nombre}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">Rol:</p>
                            <p className="text-red-700 font-semibold">{profile.rol}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">Email:</p>
                            <p className="text-blue-900">{profile.email}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">Estado:</p>
                            <p className="text-blue-900">{profile.estado}</p>
                        </div>
                    </div>
                </div>

                {/* Columna de Cambio de Contraseña */}
                <div className="space-y-4 border-l border-gray-200 pl-8">
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center md:text-left">Cambiar Contraseña</h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-gray-700" htmlFor="currentPassword">Contraseña Actual</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="mt-2 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700" htmlFor="newPassword">Nueva Contraseña</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-2 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700" htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-2 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                        >
                            Cambiar Contraseña
                        </button>
                    </form>
                    {message && <p className="mt-4 text-center text-red-500 font-medium">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Profile;
