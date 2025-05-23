import Layout from '../../components/Layout';
import GradoManagement from '../../components/otrosMantenimientos/grado'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const DashboardGrados = () => {
    useEffect(() => {
        document.title = "Mantenimiento de Grados"; // Cambiar el título de la página
    }, []);

    return (
        <Layout>
         
                <GradoManagement /> {/* Componente de gestión de grados */}
      
        </Layout>
    );
};

export const getServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies.token || '';

    try {
        jwt.verify(token, SECRET_KEY); // Verificar si el token es válido
        return { props: {} }; // Si el token es válido, mostrar la página
    } catch (error) {
        // Si el token no es válido, redirigir al usuario al inicio
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};

export default DashboardGrados;
