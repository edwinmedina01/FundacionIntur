// pages/inicio.js

import Layout from "../components/Layout";
import jwt from "jsonwebtoken";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ListBulletIcon,
  PlusIcon,
  StarIcon,
  UsersIcon,
  GlobeAltIcon,
  BookmarkSquareIcon
} from "@heroicons/react/24/outline";
import AuthContext from "../context/AuthContext";
const SECRET_KEY = process.env.SECRET_KEY || "tu_clave_secreta";

const Inicio = () => {
  const [userName, setUserName] = useState("");
  const { user, loading } = useContext(AuthContext);
  const [permisos, setPermisos] = useState([]);
  const [permisosMenu, setPermisosMenu] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    document.title = "Inicio";
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded) {
        setUserName(decoded.nombre);
      }
    }
    if (!loading && user) {
      fetchPermisos(user.rol);
    }

    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Buenos días,");
    } else if (currentHour < 18) {
      setGreeting("Buenas tardes,");
    } else {
      setGreeting("Buenas noches, ");
    }

    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 15000); 

    return () => clearTimeout(timer);
  }, [user]);

  const fetchPermisos = async (rolId) => {
    try {
      const response = await axios.get(`/api/permisos?rolId=${rolId}`);
      const permisosMap = response.data.reduce((acc, permiso) => {
        acc[permiso.Id_Objeto] = {
          insertar: permiso.Permiso_Insertar === "1",
          actualizar: permiso.Permiso_Actualizar === "1",
          eliminar: permiso.Permiso_Eliminar === "1",
          consultar: permiso.Permiso_Consultar === "1",
        };
        return acc;
      }, {});
      setPermisos(permisosMap);
      setPermisosMenu(response.data);
    } catch (error) {
      console.error("Error al obtener permisos", error);
    }
  };


  const tienePermiso = (objeto, tipo = "Permiso_Consultar") => {
    console.log("tienePermiso");
    console.log(objeto);
   console.log(permisosMenu);

    return permisosMenu.find(p => p.Objeto?.toUpperCase() === objeto.toUpperCase())?.[tipo] === "1";
  };
  
  

  return (
    <Layout>
   <div className="min-h-screen bg-transparent p-8">
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold">Menú</h1>
    {showGreeting && (
      <h3 className="text-xl text-gray-900 font-semibold">{greeting} {userName || "Usuario"}</h3>
    )}
  </div>

  {/* Contenedor de Acciones Rápidas */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Botón 1 */}
    {tienePermiso("ESTUDIANTES", "Permiso_Insertar") && (
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center">
          <PlusIcon className="h-8 w-8 mr-3" />
          Nuevo Registro
        </h2>
        <p className="text-gray-600 mb-4">
          Agregar un nuevo registro al sistema sobre el alumno, su benefactor, y su tutor.
        </p>
        <Link href="/estudiante">
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
            Nuevo Registro
          </button>
        </Link>
      </div>
    )}

    {/* Botón 2 */}
    {tienePermiso("ESTUDIANTES", "Permiso_Consultar") && (
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-green-600 flex items-center">
          <ListBulletIcon className="h-8 w-8 mr-3" />
          Estudiantes
        </h2>
        <p className="text-gray-600 mb-4">
          Ver y administrar la información de los estudiantes.
        </p>
        <Link href="/estudiante/reporte">
          <button className="w-full bg-green-500 text-white py-2 rounded-lg shadow-lg hover:bg-green-600 transition duration-300">
            Ir a Estudiantes
          </button>
        </Link>
      </div>
    )}

    {/* Botón 3 */}
    {tienePermiso("BENEFACTORES", "Permiso_Consultar") && (
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-yellow-600 flex items-center">
          <StarIcon className="h-8 w-8 mr-3" />
          Benefactores
        </h2>
        <p className="text-gray-600 mb-4">
          Ver y administrar la información de los benefactores.
        </p>
        <Link href="/benefactores">
          <button className="w-full bg-yellow-500 text-white py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300">
            Ir a Benefactores
          </button>
        </Link>
      </div>
    )}

    {/* Botón 4 */}
    {tienePermiso("TUTOR/PADRE", "Permiso_Consultar") && (
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-purple-600 flex items-center">
          <UsersIcon className="h-8 w-8 mr-3" />
          Tutores/Padres
        </h2>
        <p className="text-gray-600 mb-4">
          Administra la información de los tutores/padres.
        </p>
        <Link href="/tutorpadre">
          <button className="w-full bg-purple-500 text-white py-2 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300">
            Ir a Tutores
          </button>
        </Link>
      </div>
    )}

    {/* Botón 5 */}
    {tienePermiso("MATRICULA", "Permiso_Consultar") && (
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-teal-600 flex items-center">
          <GlobeAltIcon className="h-8 w-8 mr-3" />
          Matricula General
        </h2>
        <p className="text-gray-600 mb-4">
          Aquí se presenta el registro general de matrícula.
        </p>
        <Link href="/matriculageneral">
          <button className="w-full bg-teal-500 text-white py-2 rounded-lg shadow-lg hover:bg-teal-600 transition duration-300">
            Ir a Matrícula
          </button>
        </Link>
      </div>
    )}

    {/* Botón 6 */}
    {tienePermiso("GRADUANDOS", "Permiso_Consultar") && (
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600 flex items-center">
          <BookmarkSquareIcon className="h-8 w-8 mr-3" />
          Graduandos
        </h2>
        <p className="text-gray-600 mb-4">
          Aquí se presenta el registro de graduandos.
        </p>
        <Link href="/graduandos">
          <button className="w-full bg-indigo-500 text-white py-2 rounded-lg shadow-lg hover:bg-indigo-600 transition duration-300">
            Ir a Graduandos
          </button>
        </Link>
      </div>
    )}
  </div>
</div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.token || "";

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

export default Inicio;
