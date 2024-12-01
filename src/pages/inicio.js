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
} from "@heroicons/react/24/outline";
import AuthContext from "../context/AuthContext";
const SECRET_KEY = process.env.SECRET_KEY || "tu_clave_secreta";

const Inicio = () => {
  const [userName, setUserName] = useState("");
  const { user, loading } = useContext(AuthContext);
  const [permisos, setPermisos] = useState([]);
  useEffect(() => {
    document.title = "Inicio";
    // Extraer el nombre de usuario del token o establecer un valor predeterminado
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded) {
        setUserName(decoded.nombre); // Asumiendo que el nombre se guarda en el token
      }
    }
    // Llama a fetchPermisos solo si user está disponible
    if (!loading && user) {
      //  setUserName(user.usuario); // Configura el nombre de usuario desde el contexto
      fetchPermisos(user.rol); // Obtiene permisos según el rol del usuario
    }
    //fetchPermisos(user.rol);
  }, [user]);

  const fetchPermisos = async (rolId) => {
    try {
      const response = await axios.get(`/api/permisos?rolId=${rolId}`);
      // Convierte la lista de permisos en un objeto de permisos
      console.log("permisos");
      console.log(response);
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
    } catch (error) {
      console.error("Error al obtener permisos", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Menu</h1>
        </div>

        {/* Contenedor de Acciones Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Botón 1 */}
          {permisos[1]?.insertar && (
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2">
                <PlusIcon className="h-6 w-5 mr-6 inline" />
                Nuevo Registro
              </h2>
              <p className="text-gray-600 mb-4">
                Agregar un Nuevo Registro al Sistema acerca de el alumno,su
                benefactor,su tutor.
              </p>
              <Link href="/estudiante">
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                  Nuevo Registro
                </button>
              </Link>
            </div>
          )}

          {/* Botón 2 */}
          {permisos[1]?.consultar && (
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2">
                <ListBulletIcon className="h-6 w-6 mr-2 inline" />
                Estudiantes
              </h2>
              <p className="text-gray-600 mb-4">
                Ver y administrar la información de los estudiantes.
              </p>
              <br></br>
              <Link href="/estudiante/reporte">
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                  Ir a Estudiantes
                </button>
              </Link>
            </div>
          )}

          {/* Botón 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">
              <StarIcon className="h-6 w-6 mr-2 inline" />
              Benefactores
            </h2>
            <p className="text-gray-600 mb-4">
              Ver y Administrar la informacion de los benefactores
            </p>
            <Link href="/benefactores">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Benefactores
              </button>
            </Link>
          </div>

          {/* Botón 4 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Tutores/Padres</h2>
            <p className="text-gray-600 mb-4">
              Administra la informacion de los tutores/padres.
            </p>
            <Link href="/tutorpadre">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Tutores
              </button>
            </Link>
          </div>

          {/* Botón 5 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Matricula General</h2>
            <p className="text-gray-600 mb-4">
              aqui se presenta el registro general de matricula.
            </p>
            <Link href="/matriculageneral">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Matricula
              </button>
            </Link>
          </div>

          {/* Botón 6 
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Estadistica General</h2>
            <p className="text-gray-600 mb-4">
              Dashboard general de los estudiantes por modalidad
            </p>
            <Link href="/">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Ir a Estadisticas
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
