import Layout from '../components/Layout';
import UsersManagement from '../components/mantenimientolineas'; // Asegúrate de que la ruta sea correcta
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
    destination: "/",
    permanent: false,
  },
};
}
};

export default Dashboard;