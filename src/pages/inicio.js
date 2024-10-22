// pages/inicio.js

import Layout from '../components/Layout';
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const Inicio = () => {
  useEffect(() => {
    document.title = "Gestión Académica - Inicio";
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Gestión Académica - Inicio</h1>

        {/* Contenedor de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 justify-center">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Estudiantes</h2>
            <p className="text-4xl font-bold">0</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Profesores</h2>
            <p className="text-4xl font-bold">0</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Cursos</h2>
            <p className="text-4xl font-bold">0</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Salones Disponibles</h2>
            <p className="text-4xl font-bold">0</p>
          </div>
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
