import Layout from '../components/Layout';
import UsersManagement from '../components/mantenimientotutorpadre'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const Dashboard = () => {
useEffect(() => {
document.title = "Mantenimiento de Usuarios";
}, []);

return (
<Layout>
  
        <UsersManagement /> {/* Componente de gestión de usuarios */}

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