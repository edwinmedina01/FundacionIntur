import Layout from '../components/Layout';
import ConfiguracionManagement from '../components/mantenerconfiguracion'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const Configuracion = () => {
    useEffect(() => {
        document.title = "Mantenimiento de Configuración";
    }, []);

    return (
        <Layout>
            <ConfiguracionManagement /> {/* Componente de gestión de configuraciones */}
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

// export const getServerSideProps = async (context) => {
//     const { req } = context;
//     const token = req.cookies.token || '';

//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);

//         // Verificar si el usuario tiene rol de superadmin para acceder a configuración
//         if (decoded.role !== 'SuperAdministrador') {
//             return {
//                 redirect: {
//                     destination: '/Inicio', // Redirigir si no es superadmin
//                     permanent: false,
//                 },
//             };
//         }

//         return { props: {} };
//     } catch (error) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false,
//             },
//         };
//     }
// };

export default Configuracion;
