// pages/permisos.js

import Layout from '../components/Layout';
import ManejoObjetos from '../components/manteobjetos'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const PermisosPage = () => {
    useEffect(() => {
        document.title = "Objetos"; // Cambia el título de la página
    }, []);

    return (
        <Layout>
         
                <ManejoObjetos /> {/* Componente de gestión de permisos */}
       
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
