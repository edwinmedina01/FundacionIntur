// pages/dashboard.js

import Layout from '../components/Layout';
import UsersManagement from '../components/manteusuarios'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const Dashboard = () => {
    useEffect(() => {
        document.title = "Gestión Académica - Mantenimiento de Usuarios";
    }, []);

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <br />
                <h1 className="text-3xl font-bold mb-4">Gestión Académica - Mantenimiento de Usuarios</h1>
                <br /><br />
                <UsersManagement /> {/* Componente de gestión de usuarios */}
            </div>
        </Layout>
    );
};

export const getServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies.token || '';

    try {
        jwt.verify(token, SECRET_KEY);
        return { props: {} };
    } catch (error) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};

export default Dashboard;
