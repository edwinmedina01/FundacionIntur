// pages/inicio.js

import Layout from '../components/Layout';
import jwt from 'jsonwebtoken';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
          <h1 className="text-4xl font-bold">Bienvenido</h1>
        </div>

        {/* Contenedor de Acciones Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Botón 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">+ Nuevo Registro</h2>
            <p className="text-gray-600 mb-4">Agregar un Nuevo Registro al Sistema acerca de el alumno,su benefactor,su tutor.</p>
            <Link href="/nuevoregistro">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Nuevo Registro
              </button>
            </Link>
          </div>

          {/* Botón 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Estudiantes</h2>
            <p className="text-gray-600 mb-4">Ver y administrar la información de los estudiantes.</p>
            <Link href="/">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Estudiantes
              </button>
            </Link>
          </div>

          {/* Botón 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Benefactores</h2>
            <p className="text-gray-600 mb-4">Ver y Administrar la informacion de los benefactores</p>
            <Link href="/usuarios">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Usuarios
              </button>
            </Link>
          </div>

          {/* Botón 4 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Roles</h2>
            <p className="text-gray-600 mb-4">Administra los roles y permisos.</p>
            <Link href="/roles">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Roles
              </button>
            </Link>
          </div>

          {/* Botón 5 
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Reportes</h2>
            <p className="text-gray-600 mb-4">Generar y ver reportes del sistema.</p>
            <Link href="/reportes">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Reportes
              </button>
            </Link>
          </div>*/}

          {/* Botón 6 
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Configuración</h2>
            <p className="text-gray-600 mb-4">Ajustes del sistema y preferencias.</p>
            <Link href="/configuracion">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Configuración
              </button>
            </Link>
          </div>*/}
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
