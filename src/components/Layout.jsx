import { useContext, useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import jwt from "jsonwebtoken";
import Image from "next/image";
import { destroyCookie } from 'nookies';  // Importar nookies para destruir cookies

// Importación de íconos de Heroicons
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
import { set } from "nprogress";

const Layout = ({ children }) => {
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [token, setToken] = useState(null); // Inicializa el token como null
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [menuWidth, setMenuWidth] = useState("w-80"); // Ancho inicial del menú
  const [contentMargin, setContentMargin] = useState("ml-80"); // Margen del contenido

  // Función para verificar si el token está expirado
  const isTokenExpired = (token) => {
    if (!token) return true;

    const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
    const expirationTime = decoded.exp * 1000; // Convertir el tiempo de expiración a milisegundos
    return Date.now() > expirationTime;
  };

  // Comprobamos el token cada 20 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        handleLogout("Token expirado. Por favor, autentíquese nuevamente."); // Si el token ha expirado, cerramos sesión
      }
    }, 20 * 60 * 1000); // 20 minutos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [token]);

  // Función para cerrar sesión
  const handleLogout = async (message) => {


    const respuesta = await axios.post('/api/auth/logout', {  });
    
    // ✅ Imprimir toda la respuesta de la API para depuración
    console.log('✅ Respuesta de la API:', respuesta);

   
    localStorage.removeItem("token"); // Eliminar el token de localStorage
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax"; // Eliminar la cookie del token

    toast.error(message || "Sesión cerrada por inactividad.", {
      position: "top-right",
      autoClose: false,  // Esto hace que el toast se quede en pantalla permanentemente
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    router.push("/login"); // Redirigir al login
  };

  // Detectar inactividad (30 minutos)
  useEffect(() => {
    const resetInactivityTimer = () => setLastActivityTime(Date.now());

    // Detectar movimiento del ratón y presionar teclas
    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keydown", resetInactivityTimer);

    // Verificar si ha pasado 30 minutos de inactividad
    const inactivityInterval = setInterval(() => {
      if (Date.now() - lastActivityTime > 30 * 60 * 1000) { // 30 minutos de inactividad
     
        handleLogout("Sesión cerrada por inactividad."); // Si ha pasado más de 30 minutos, cerramos sesión
        user=null; // Limpiar el usuario del contexto
        alert("Sesión cerrada por inactividad.");
      }
    }, 1000); // Comprobamos cada segundo

    return () => {
      document.removeEventListener("mousemove", resetInactivityTimer);
      document.removeEventListener("keydown", resetInactivityTimer);
      clearInterval(inactivityInterval); // Limpiar el intervalo de inactividad al desmontar el componente
    };
  }, [lastActivityTime]);

  // Usar useEffect para obtener el token desde localStorage cuando el componente se monta en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Esto asegura que el código solo se ejecute en el cliente
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
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
  const [permisosMenu, setPermisosMenu] = useState([]);
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
      console.log("🧠 Response de permisos:", response.data);

      const permisosMap = response.data.reduce((acc, permiso) => {
        acc[permiso.Id_Objeto] = {
          insertar: permiso.Permiso_Insertar === "1",
          actualizar: permiso.Permiso_Actualizar === "1",
          eliminar: permiso.Permiso_Eliminar === "1",
          consultar: permiso.Permiso_Consultar === "1",
        };
        return acc;
      }, {});
      setPermisosMenu(response.data); // Guardar permisos en el estado
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


  const tienePermiso = (objeto, tipo = "Permiso_Consultar") => {
    return permisosMenu.find(p => p.Objeto?.toUpperCase() === objeto.toUpperCase())?.[tipo] === "1";
  };
  
  

  //console.log("Estado actual del usuario en el contexto:", user);

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


if (!isLoaded) {
  return <div>Cargando...</div>;
  }



  if (!user) {
    return <div>No tienes permisos para ver esta página. Redirigiendo...</div>;
  }


  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Menú Lateral */}
      {sidebarVisible && (
    <aside
    className={`w-80 bg-blue-800 text-white p-6 shadow-lg fixed h-screen overflow-y-auto transform transition-all duration-500 ease-in-out ${
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
  {tienePermiso("ESTUDIANTES") || tienePermiso("BENEFACTORES") || tienePermiso("TUTOR/PADRE") || tienePermiso("MATRICULA") || tienePermiso("GRADUANDOS") ? (
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
          {tienePermiso("ESTUDIANTES") && (
            <li>
              <Link href="/estudiante/reporte" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <QueueListIcon className="h-5 w-5 mr-3 inline" /> Estudiantes
              </Link>
            </li>
          )}
          {tienePermiso("BENEFACTORES") && (
            <li>
              <Link href="/benefactores" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <QueueListIcon className="h-5 w-5 mr-3 inline" /> Benefactores
              </Link>
            </li>
          )}
          {tienePermiso("TUTOR/PADRE") && (
            <li>
              <Link href="/tutorpadre" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <QueueListIcon className="h-5 w-5 mr-3 inline" /> Tutores/Padres
              </Link>
            </li>
          )}
          {tienePermiso("MATRICULA") && (
            <li>
              <Link href="/matriculageneral" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <BookmarkSquareIcon className="h-5 w-5 mr-3 inline" /> Matrícula
              </Link>
            </li>
          )}
          {tienePermiso("GRADUANDOS") && (
            <li>
              <Link href="/graduandos" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <FolderIcon className="h-5 w-5 mr-3 inline" /> Graduandos
              </Link>
            </li>
          )}
        </ul>
      )}
    </li>
  ) : null}

  {/* Sección Mantenimientos */}
  {[
    "MODALIDADES", "GRADOS", "SECCION", "INSTITUCIONES",
    "AREAS", "DEPARTAMENTOS", "MUNICIPIOS", "LINEAS BENEFICIO"
  ].some(obj => tienePermiso(obj)) && (
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
          {tienePermiso("MODALIDADES") && (
            <li>
              <Link href="/mantenimientos/modalidades" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <RectangleGroupIcon className="h-5 w-5 mr-3 inline" /> Modalidades
              </Link>
            </li>
          )}
          {tienePermiso("GRADOS") && (
            <li>
              <Link href="/mantenimientos/grado" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <RectangleGroupIcon className="h-5 w-5 mr-3 inline" /> Grados
              </Link>
            </li>
          )}
          {tienePermiso("SECCION") && (
            <li>
              <Link href="/mantenimientos/seccion" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <RectangleGroupIcon className="h-5 w-5 mr-3 inline" /> Sección
              </Link>
            </li>
          )}
          {tienePermiso("INSTITUCIONES") && (
            <li>
              <Link href="/mantenimientos/instituciones" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <RectangleGroupIcon className="h-5 w-5 mr-3 inline" /> Instituciones
              </Link>
            </li>
          )}
          {tienePermiso("AREAS") && (
            <li>
              <Link href="/mantenimientos/area" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <RectangleGroupIcon className="h-5 w-5 mr-3 inline" /> Áreas
              </Link>
            </li>
          )}
          {tienePermiso("DEPARTAMENTOS") && (
            <li>
              <Link href="/mantenimientos/departamentos" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <RectangleGroupIcon className="h-5 w-5 mr-3 inline" /> Departamentos
              </Link>
            </li>
          )}
          {tienePermiso("MUNICIPIOS") && (
            <li>
              <Link href="/mantenimientos/municipios" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <RectangleGroupIcon className="h-5 w-5 mr-3 inline" /> Municipios
              </Link>
            </li>
          )}
          {tienePermiso("LINEAS BENEFICIO") && (
            <li>
              <Link href="/lineabeneficio" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <RectangleGroupIcon className="h-5 w-5 mr-3 inline" /> Beneficios
              </Link>
            </li>
          )}
        </ul>
      )}
    </li>
  )}

  {/* Sección Seguridad */}
  {["USUARIOS", "ROLES", "PERMISOS", "OBJETOS"].some(obj => tienePermiso(obj)) && (
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
          {tienePermiso("USUARIOS") && (
            <li>
              <Link href="/usuarios" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <UserGroupIcon className="h-5 w-5 mr-3 inline" /> Usuarios
              </Link>
            </li>
          )}
          {tienePermiso("ROLES") && (
            <li>
              <Link href="/roles" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <TagIcon className="h-5 w-5 mr-3 inline" /> Roles
              </Link>
            </li>
          )}
          {tienePermiso("PERMISOS") && (
            <li>
              <Link href="/permisos" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-3 inline" /> Permisos
              </Link>
            </li>
          )}
          {tienePermiso("OBJETOS") && (
            <li>
              <Link href="/objetos" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <CubeIcon className="h-5 w-5 mr-3 inline" /> Objetos
              </Link>
            </li>
          )}
       {tienePermiso("BITACORAACCIONES") && (
  <li>
    <Link href="/bitacora" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
      <ClipboardDocumentListIcon className="h-5 w-5 mr-3 inline" /> Bitácora
    </Link>
  </li>
)}

          {user?.nombrerol === "SuperAdministrador" && (
            <li>
              <Link href="/configuracion" className="block py-2 px-4 rounded-lg hover:bg-blue-600">
                <WrenchScrewdriverIcon className="h-5 w-5 mr-3 inline" /> Configuración
              </Link>
            </li>
          )}
        </ul>
      )}
    </li>
  )}
</ul>

</aside>

)}
      {/* Contenido principal */}
      <div className={`flex-1 flex flex-col ${sidebarVisible ? contentMargin : "ml-0"} transition-all duration-300`}>

    
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
