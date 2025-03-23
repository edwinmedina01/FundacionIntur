import Layout from '../../components/Layout';
import DepartamentosManagement from '../../components/otrosMantenimientos/departamentos'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const DashboardDepartamentos = () => {
    useEffect(() => {
        document.title = "Mantenimiento de Departamentos"; // Cambiar el título de la página
    }, []);

    return (
        <Layout>
       
                <DepartamentosManagement /> {/* Componente de gestión de departamentos */}
           
        </Layout>
    );
};

// Verificación de token en el servidor antes de mostrar la página
export const getServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies.token || ''; // Obtener el token desde las cookies

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

export default DashboardDepartamentos;
