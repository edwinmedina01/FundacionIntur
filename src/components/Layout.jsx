import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import jwt from "jsonwebtoken";
import Image from "next/image";

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
  UserGroupIcon, Bars4Icon
} from "@heroicons/react/24/outline"; // Importa íconos necesarios

const Layout = ({ children }) => {



  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
      if (!loading && !user) {
          router.replace("/");
      }
      else{
        console.log(user)
      }
  }, [user, loading, router]);

  // if (loading) {
  //     return <p>Cargando...</p>;
  // }

  // if (!user) {
  //     return <p>Error: Usuario no encontrado. Redirigiendo...</p>;
  // }

  // return (
  //     <div>
  //         <header>Mi Aplicación</header>
  //         <main>{children}</main>
  //     </div>
  // );

  //  const { user } = useContext(AuthContext);

  //const { user, loading } = useContext(AuthContext);
  //const [user, setUser] = useState(null); // Inicializa como null
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAcademicoNavBar, setShowAcademicoNavBar] = useState(false);
  const [showseguridadNavbar, setShowseguridadNavbar] = useState(false);
  const [showApartadoUnoNavbar, setShowApartadoUnoNavbar] = useState(false); // Nuevo
  const [showApartadoDosNavbar, setShowApartadoDosNavbar] = useState(false); // Nuevo
  const [showApartadoTresNavbar, setShowApartadoTresNavbar] = useState(false); // Nuevo
  const [permisos, setPermisos] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
//  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(""); // Estado para la hora actual
 // Lee el estado de la barra lateral desde localStorage
 useEffect(() => {
  const savedSidebarState = localStorage.getItem("sidebarVisible");
  if (savedSidebarState) {
    setSidebarVisible(JSON.parse(savedSidebarState)); // Restaurar el estado guardado
  }
  setIsLoaded(true); // Indicar que la carga ha terminado
}, []);

// Guardar el estado de la barra lateral en localStorage
useEffect(() => {
  if (isLoaded) {
    localStorage.setItem("sidebarVisible", JSON.stringify(sidebarVisible)); // Guardar el estado actual solo después de cargar
  }
}, [sidebarVisible, isLoaded]);
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

    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(time);
    };

    updateClock(); // Inicializar con la hora actual
    const intervalId = setInterval(updateClock, 1000); // Actualizar cada segundo
    return () => clearInterval(intervalId); // Limpiar intervalo al desmontar
  }, [user]);

  console.log("Estado actual del usuario en el contexto:", user);

  if(!user){

    //return res.status(400).json({ error: "Usuario no encontrado." });
  }
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
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
      localStorage.removeItem("token");
              // Eliminar la cookie del token correctamente
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

      await axios.post("/api/auth/logout");
      
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
if (!isLoaded) {
    return null; // O podrías mostrar un spinner de carga mientras se obtiene el valor de localStorage
  }
  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Menú Lateral */}
      {sidebarVisible && (
        <aside
          className={`w-64 bg-blue-800 text-white p-6 shadow-lg fixed h-full transform transition-all duration-500 ease-in-out ${
            sidebarVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
        >
  <div className="flex items-center justify-center mb-10">
    {/* <img src="/img/intur.png" alt="logo" className="h-16 w-auto" /> */}
    <Image src="/img/intur.png" alt="logo" width={150} height={50} priority />
  </div>
  <ul className="space-y-6">
    <li>
      <Link
        href="/inicio"
        className="flex items-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <HomeIcon className="h-6 w-6 mr-4" />
        <strong>Inicio</strong>
      </Link>
    </li>

    {/* Sección Académico */}
    <li>
      <button
        onClick={toggleAcademicoNavBar}
        className="w-full text-left py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
      >
        <AcademicCapIcon className="h-6 w-6 mr-4" />
        <strong>Académico</strong>
      </button>
      {showAcademicoNavBar && (
        <ul className="ml-8 mt-4 space-y-3 text-blue-200">
          <li>
            <Link
              href="/estudiante/reporte"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <QueueListIcon className="h-5 w-5 mr-3 inline" />
              Estudiantes
            </Link>
          </li>
          <li>
            <Link
              href="/benefactores"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <QueueListIcon className="h-5 w-5 mr-3 inline" />
              Benefactores
            </Link>
          </li>
          <li>
            <Link
              href="/tutorpadre"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <QueueListIcon className="h-5 w-5 mr-3 inline" />
              Tutores/Padres
            </Link>
          </li>
          <li>
            <Link
              href="/matriculageneral"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <BookmarkSquareIcon className="h-5 w-5 mr-3 inline" />
              Matrícula
            </Link>
          </li>
          <li>
            <Link
              href="/graduandos"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <FolderIcon className="h-5 w-5 mr-3 inline" />
              Graduandos
            </Link>
          </li>
        </ul>
      )}
    </li>

    {/* Sección Mantenimientos */}
    <li>
      <button
        onClick={toggleApartadoTresNavbar}
        className="w-full text-left py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
      >
        <WrenchScrewdriverIcon className="h-6 w-6 mr-4" />
        <strong>Mantenimientos</strong>
      </button>
      {showApartadoTresNavbar && (
        <ul className="ml-8 mt-4 space-y-3 text-blue-200">
          <li>
            <Link
              href="/mantenimientos/modalidades"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-3 inline" />
              Modalidades
            </Link>
          </li>
          <li>
            <Link
              href="/mantenimientos/grado"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-3 inline" />
              Grados
            </Link>
          </li>
          <li>
            <Link
              href="/mantenimientos/seccion"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-3 inline" />
              Sección
            </Link>
          </li>
          <li>
            <Link
              href="/mantenimientos/instituciones"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-3 inline" />
              Instituciones
            </Link>
          </li>
          <li>
            <Link
              href="/mantenimientos/area"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-3 inline" />
              Áreas
            </Link>
          </li>
          <li>
            <Link
              href="/mantenimientos/departamentos"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-3 inline" />
              Departamentos
            </Link>
          </li>
          <li>
            <Link
              href="/mantenimientos/municipios"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-3 inline" />
              Municipios
            </Link>
          </li>
          <li>
            <Link
              href="/lineabeneficio"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <RectangleGroupIcon className="h-5 w-5 mr-3 inline" />
              Beneficios
            </Link>
          </li>
        </ul>
      )}
    </li>

    {/* Sección Seguridad */}
    <li>
      <button
        onClick={toggleseguridadNavbar}
        className="w-full text-left py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
      >
        <LockClosedIcon className="h-6 w-6 mr-4" />
        <strong>Seguridad</strong>
      </button>
      {showseguridadNavbar && (
        <ul className="ml-8 mt-4 space-y-3 text-blue-200">
          <li>
            <Link
              href="/usuarios"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <UserGroupIcon className="h-5 w-5 mr-3 inline" />
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              href="/roles"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <TagIcon className="h-5 w-5 mr-3 inline" />
              Roles
            </Link>
          </li>
          <li>
            <Link
              href="/permisos"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <ClipboardDocumentListIcon className="h-5 w-5 mr-3 inline" />
              Permisos
            </Link>
          </li>
          <li>
            <Link
              href="/objetos"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <CubeIcon className="h-5 w-5 mr-3 inline" />
              Objetos
            </Link>
          </li>
        </ul>
      )}
    </li>
  </ul>
</aside>

)}
      {/* Contenido principal */}
      <div
        className={`flex-1 flex flex-col ${
          sidebarVisible ? "ml-64" : "ml-0"
        } transition-all duration-300`}
      >
    
        <nav className="flex justify-between items-center bg p-4 shadow-md border-b border-gray-200">
        <div className="flex items-center space-x-4">
    {/* Botón para abrir/cerrar el menú */}
    <button
      onClick={toggleSidebar}
      className="text-black-700 focus:outline-none"
    >
      <Bars4Icon className="h-5 w-5" />
    </button>

    {/* Botón de inicio solo con el icono */}
    <Link
      href="/inicio"
      className="text-black-700 focus:outline-none hover:text-black-500"
    >
      <HomeIcon className="h-6 w-6" />
    </Link>
  </div>
          
           {/* Hora actual */}
           <div className="text-black-700 font-semibold">
            Gestión Académica - {currentTime}
          </div>
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-Black-900 focus:outline-none hover:text-black-100"
            >
              <UserCircleIcon className="w-9 h-9 inline mr-2" />
              {user ? <strong>{user.usuario}</strong> : "Cargando..."} ▼
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
        <main className="flex-1 p-6 bg-blue-50 overflow-y-auto">{children}</main>
        <footer className="bg-white p-4 text-center border-t border-gray-200">
          © 2024 Sistema Académico
        </footer>
      </div>
    </div>
  );
};

export default Layout;
