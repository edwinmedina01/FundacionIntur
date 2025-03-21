import Layout from '../../components/Layout';
import ModalidadesManagement from '../../components/otrosMantenimientos/Modalidades'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const DashboardModalidades = () => {
    useEffect(() => {
        document.title = "Mantenimiento de Modalidades"; // Cambiar el título de la página
    }, []);

    return (
        <Layout>
         
                <ModalidadesManagement /> {/* Componente de gestión de modalidades */}
          
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

export default DashboardModalidades;
