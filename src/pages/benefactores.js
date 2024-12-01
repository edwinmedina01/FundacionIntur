// pages/dashboard.js

import Layout from '../components/Layout';
import BenefactoresManagement from '../components/benefactores';
import UsersManagement from '../components/benefactores'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const Dashboard = () => {
useEffect(() => {
document.title = "Mantenimiento de Usuarios";
}, []);

return (
<Layout>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <BenefactoresManagement /> {/* Componente de gestión de usuarios */}
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