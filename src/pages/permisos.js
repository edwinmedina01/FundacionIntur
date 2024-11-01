// pages/permisos.js

import Layout from '../components/Layout';
import PermissionsManagement from '../components/mantepermisos'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const PermisosPage = () => {
    useEffect(() => {
        document.title = "Gestión de Permisos"; // Cambia el título de la página
    }, []);

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <br />
                <h1 className="text-3xl font-bold mb-4">Gestión de Permisos</h1>
                <br /><br />
                <PermissionsManagement /> {/* Componente de gestión de permisos */}
            </div>
        </Layout>
    );
};

export const getServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies.token || '';

    try {
        jwt.verify(token, SECRET_KEY);
        return { props: {} }; // Devuelve propiedades vacías si la verificación es exitosa
    } catch (error) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};

export default PermisosPage;
