// pages/inicio.js

import Layout from '../components/Layout';
import jwt from 'jsonwebtoken';
import { useEffect, useState } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const Inicio = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    document.title = "Inicio";
    // Extraer el nombre de usuario del token o establecer un valor predeterminado
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded) {
        setUserName(decoded.nombre); // Asumiendo que el nombre se guarda en el token
      }
    }
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">¡Bienvenido al Sistema!</h1>
          <h2 className="text-xl text-gray-600">Hola, {userName || 'Usuario'}. Esperamos que tengas un gran día.</h2>
        </div>
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

export default Inicio;
