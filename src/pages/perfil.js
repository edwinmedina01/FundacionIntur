// pages/profile.js

import Layout from '../components/Layout';
import Profile from '../components/perfil'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';


const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const ProfilePage = () => {
    const { user } = useContext(AuthContext); // Obtén el usuario del contexto

    useEffect(() => {
        document.title = "Perfil de Usuario";
    }, []);

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-white-300">
                
                <Profile /> {/* Componente de perfil */}
            </div>
        </Layout>
    );
};

export const getServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies.token || '';

    try {
        jwt.verify(token, SECRET_KEY);
        return { props: {} }; // El token es válido
    } catch (error) {
        return {
            redirect: {
                destination: '/', // Redirige a la página de login si el token no es válido
                permanent: false,
            },
        };
    }
};

export default ProfilePage;
