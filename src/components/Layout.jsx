import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import jwt from "jsonwebtoken";
import {
  HomeIcon,
  AcademicCapIcon,
  LockClosedIcon,
  WrenchScrewdriverIcon,
  UserCircleIcon,
  IdentificationIcon,
  XMarkIcon,
  QueueListIcon,
  BookmarkSquareIcon,
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  RectangleGroupIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"; // Importa íconos necesarios

const Layout = ({ children }) => {
  //  const { user } = useContext(AuthContext);

  const { user, loading } = useContext(AuthContext);
  //const [user, setUser] = useState(null); // Inicializa como null
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAcademicoNavBar, setShowAcademicoNavBar] = useState(false);
  const [showseguridadNavbar, setShowseguridadNavbar] = useState(false);
  const [showApartadoUnoNavbar, setShowApartadoUnoNavbar] = useState(false); // Nuevo
  const [showApartadoDosNavbar, setShowApartadoDosNavbar] = useState(false); // Nuevo
  const [showApartadoTresNavbar, setShowApartadoTresNavbar] = useState(false); // Nuevo
  const [permisos, setPermisos] = useState([]);

  const router = useRouter();

  const fetchPermisos = async (rolId) => {
    try {
      const response = await axios.get(`/api/permisos?rolId=${rolId}`);
      // Convierte la lista de permisos en un objeto de permisos
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
  useEffect(() => {
    if (user && user.rol) {
      fetchPermisos(user.rol);
    }
  }, [user]);

  console.log("Estado actual del usuario en el contexto:", user);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleAcademicoNavBar = () => {
    setShowAcademicoNavBar(!showAcademicoNavBar);
    if (showseguridadNavbar) setShowseguridadNavbar(false);
    if (showApartadoUnoNavbar) setShowApartadoUnoNavbar(false);
    if (showApartadoDosNavbar) setShowApartadoDosNavbar(false);
    if (showApartadoTresNavbar) setShowApartadoTresNavbar(false);
  };

  //seguridad//
  const toggleseguridadNavbar = () => {
    // Verificar si el usuario tiene el rol adecuado (por ejemplo, "admin")
    // if (user && user.rol == 1) {
      // Solo muestra si el rol es 'admin'
      setShowseguridadNavbar(!showseguridadNavbar);
      if (showAcademicoNavBar) setShowAcademicoNavBar(false);
      if (showApartadoUnoNavbar) setShowApartadoUnoNavbar(false);
      if (showApartadoDosNavbar) setShowApartadoDosNavbar(false);
      if (showApartadoTresNavbar) setShowApartadoTresNavbar(false);
    // } else {
    //   //     // Si el usuario no tiene el rol adecuado, no hacer nada o mostrar un mensaje (opcional)
    //   console.log("No tienes permisos para ver esta sección.");
    //   console.log(user);
    //   toast.error("No tienes permisos para ver esta sección.", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });
    // }
  };

  //mantenimientos//
  const toggleApartadoTresNavbar = () => {
    // if (user && user.rol == 1) {
      // Solo muestra si el rol es 'admin'
      setShowApartadoTresNavbar(!showApartadoTresNavbar);
      if (showAcademicoNavBar) setShowAcademicoNavBar(false);
      if (showseguridadNavbar) setShowseguridadNavbar(false);
      if (showApartadoUnoNavbar) setShowApartadoUnoNavbar(false);
      if (showApartadoDosNavbar) setShowApartadoDosNavbar(false);
    // } else {
    //   //     // Si el usuario no tiene el rol adecuado, no hacer nada o mostrar un mensaje (opcional)
    //   console.log("No tienes permisos para ver esta sección.");
    //   console.log(user);
    //   toast.error("No tienes permisos para ver esta sección.", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });
    // }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Menú Lateral */}
      <aside className="w-64 bg-blue-800 text-white p-4 shadow-lg fixed h-full">
        <div className="flex items-center mb-8">
          <img src="/img/intur.png" alt="logo" className="h-16 w-auto" />
        </div>
        <ul className="space-y-4">
          <li>
            <Link
              href="/inicio"
              className=" py-2 px-4 rounded hover:bg-blue-700 flex items-center"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              <strong>Inicio</strong>
            </Link>
          </li>
          {/* Academico */}
          <li>
            <button
              onClick={toggleAcademicoNavBar}
              className="w-full text-left py-2 px-4 rounded hover:bg-blue-700 flex items-center"
            >
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              <strong>Académico</strong>
            </button>
            {showAcademicoNavBar && (
              <ul className="ml-4 mt-2 space-y-2 text-blue-200">
                <li>
                  <Link
                    href="/estudiante/reporte"
                    className={`block py-1 px-4 rounded hover:bg-blue-600 ${
                      permisos[1]?.consultar === false
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                    onClick={(e) => {
                      if (permisos[1]?.consultar === false) {
                        e.preventDefault(); // Previene la navegación
                        toast.error(
                          "No tienes permiso para consultar estudiantes",
                          {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                          }
                        );
                      }
                    }}
                  >
                    <QueueListIcon className="h-5 w-5 mr-2 inline" />
                    Estudiantes
                  </Link>
                </li>{" "}
                <li>
                  <Link
                    href="/benefactores"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <QueueListIcon className="h-5 w-5 mr-1 inline" />
                    Benefactores
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tutorpadre"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <QueueListIcon className="h-5 w-5 mr-1 inline" />
                    Tutores/Padres
                  </Link>
                </li>
                <li>
                  <Link
                    href="/matriculageneral"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <BookmarkSquareIcon className="h-5 w-5 mr-2 inline" />{" "}
                    Matrícula
                  </Link>
                </li>
                <li>
                  <Link
                    href="/graduandos"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <FolderIcon className="h-5 w-5 mr-2 inline" /> Graduandos
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/*  Apartado3 */}
          <li>
            <button
              onClick={toggleApartadoTresNavbar}
              className="w-full text-left py-2 px-4 rounded hover:bg-blue-700 flex items-center"
            >
              <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
              <strong>Mantenimientos</strong>
            </button>
            {showApartadoTresNavbar && (
              <ul className="ml-4 mt-2 space-y-2 text-blue-200">
                <li>
                  <Link
                    href="/mantenimientos/modalidades"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <RectangleGroupIcon className="h-5 w-5 mr-2 inline" />
                    Modalidades
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mantenimientos/grado"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <RectangleGroupIcon className="h-5 w-5 mr-2 inline" />
                    Grados
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mantenimientos/seccion"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <RectangleGroupIcon className="h-5 w-5 mr-2 inline" />
                    Sección
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mantenimientos/instituciones"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <RectangleGroupIcon className="h-5 w-5 mr-2 inline" />
                    Instituciones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mantenimientos/area"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <RectangleGroupIcon className="h-5 w-5 mr-2 inline" />
                    Áreas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mantenimientos/departamentos"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <RectangleGroupIcon className="h-5 w-5 mr-2 inline" />
                    Departamentos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mantenimientos/municipios"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <RectangleGroupIcon className="h-5 w-5 mr-2 inline" />
                    Municipios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lineabeneficio"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <RectangleGroupIcon className="h-5 w-5 mr-2 inline" />
                    Beneficios
                  </Link>
                </li>
                {/*  <li>
                                <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                    Tipo de Persona
                                </Link>
                            </li>*/}
              </ul>
            )}
          </li>
          {/* Seguridad */}
          <li>
            <button
              onClick={toggleseguridadNavbar}
              className="w-full text-left py-2 px-4 rounded hover:bg-blue-700 flex items-center"
            >
              <LockClosedIcon className="h-5 w-5 mr-2" />
              <strong> Seguridad</strong>
            </button>
            {showseguridadNavbar && (
              <ul className="ml-4 mt-2 space-y-2 text-blue-200">
                <li>
                  <Link
                    href="/usuarios"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <UserGroupIcon className="h-5 w-5 mr-2 inline" /> Usuarios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roles"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <TagIcon className="h-5 w-5 mr-2 inline" />
                    Roles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/permisos"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5 mr-2 inline" />{" "}
                    Permisos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/objetos"
                    className="block py-1 px-4 rounded hover:bg-blue-600"
                  >
                    <CubeIcon className="h-5 w-5 mr-2 inline" /> Objetos
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Barra de navegación superior */}
        <nav className="flex justify-between items-center bg p-4 shadow-md border-b border-gray-200">
          <span className="text-black-700 font-semibold">
            Gestión Académica
          </span>
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-Black-900 focus:outline-none hover:text-black-100"
            >
              {/* Usuario:  {user.usuario} */}
              <UserCircleIcon className="w-9 h-9 inline mr-2" />
              {user ? (
                <p>
                  <strong>{user.usuario}</strong> ▼
                </p>
              ) : (
                <p>Cargando...</p>
              )}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-200">
                <Link
                  href="/perfil"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <IdentificationIcon className="h-5 w-5 mr-2 inline" /> Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5 mr-2 inline" /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Contenido */}
        <main className="flex-1 p-6 bg-blue-50 overflow-y-auto">
          {children}
        </main>

        {/* Pie de página */}
        <footer className="bg-white p-4 text-center border-t border-gray-200">
          © 2024 Sistema Académico
        </footer>
      </div>
    </div>
  );
};

export default Layout;
