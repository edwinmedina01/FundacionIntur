// components/Profile.jsx

import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/profile');
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else {
                // Manejo de error si no se puede obtener el perfil
                console.error('Error al obtener el perfil');
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div className="text-center">Cargando perfil...</div>; // Mensaje de carga
    }

    return (
<div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="p-8">
        <div className="flex justify-center items-center w-full h-36 mb-8"> {/* Aumenta la altura de la imagen */}
            <div className="w-32 h-32">
                <img 
                    src="/img/user.png" 
                    alt="user" 
                    className="w-full h-full object-cover rounded-full border-4 border-slate-950" // Añadir borde redondeado y un borde sutil
                />
            </div>
        </div>

        <h1 className="text-5xl font-bold mb-4 text-center text-slate-950 border-b-2 border-gray-300 pb-2">Perfil de Usuario</h1>

        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">Detalles del Perfil</h2>
        
        <div className="text-center space-y-4"> {/* Espaciado uniforme entre los párrafos */}
    <p className="text-gray-700 text-lg text-left"><strong>ID:</strong> {profile.id}</p>
    <p className="text-gray-700 text-lg text-left">
    <strong>Nombre:</strong> <strong className="text-red-500">{profile.nombre}</strong>
</p>
    <p className="text-gray-700 text-lg text-left"><strong>Rol:</strong> {profile.rol}</p>
    <p className="text-gray-700 text-lg text-left"><strong>Email:</strong> {profile.email}</p>
    <p className="text-gray-700 text-lg text-left"><strong>Estado:</strong> {profile.estado}</p>
</div>

    </div>
</div>



    );
};

export default Profile;
