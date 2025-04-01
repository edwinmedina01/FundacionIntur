import Layout from '../components/Layout';
import MatriculaManagement from '../components/matricula'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const Dashboard = () => {
  useEffect(() => {
    document.title = "Matrícula General"; // Título actualizado para Matriculas
  }, []);

  return (
    <Layout>
    <MatriculaManagement /> {/* Componente de gestión de matriculas */}
    
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.token || '';

  try {
    // Verifica el token JWT para garantizar que el usuario tiene acceso
    jwt.verify(token, SECRET_KEY);
    return { props: {} };
  } catch (error) {
    // Si no es válido, redirige al usuario a la página de inicio
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default Dashboard;
