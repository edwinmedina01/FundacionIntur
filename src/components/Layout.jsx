import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showMaintenanceNavbar, setShowMaintenanceNavbar] = useState(false);
    const [showseguridadNavbar, setShowseguridadNavbar] = useState(false);
    const [showApartadoUnoNavbar, setShowApartadoUnoNavbar] = useState(false); // Nuevo
    const [showApartadoDosNavbar, setShowApartadoDosNavbar] = useState(false); // Nuevo
    const [showApartadoTresNavbar, setShowApartadoTresNavbar] = useState(false); // Nuevo
    const router = useRouter();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleMaintenanceNavbar = () => {
        setShowMaintenanceNavbar(!showMaintenanceNavbar);
        if (showseguridadNavbar) setShowseguridadNavbar(false);
        if (showApartadoUnoNavbar) setShowApartadoUnoNavbar(false);
        if (showApartadoDosNavbar) setShowApartadoDosNavbar(false);
        if (showApartadoTresNavbar) setShowApartadoTresNavbar(false);
    };

    const toggleseguridadNavbar = () => {
        setShowseguridadNavbar(!showseguridadNavbar);
        if (showMaintenanceNavbar) setShowMaintenanceNavbar(false);
        if (showApartadoUnoNavbar) setShowApartadoUnoNavbar(false);
        if (showApartadoDosNavbar) setShowApartadoDosNavbar(false);
        if (showApartadoTresNavbar) setShowApartadoTresNavbar(false);
    };

    const toggleApartadoUnoNavbar = () => {
        setShowApartadoUnoNavbar(!showApartadoUnoNavbar);
        if (showMaintenanceNavbar) setShowMaintenanceNavbar(false);
        if (showseguridadNavbar) setShowseguridadNavbar(false);
        if (showApartadoDosNavbar) setShowApartadoDosNavbar(false);
        if (showApartadoTresNavbar) setShowApartadoTresNavbar(false);
    };

    const toggleApartadoDosNavbar = () => {
        setShowApartadoDosNavbar(!showApartadoDosNavbar);
        if (showMaintenanceNavbar) setShowMaintenanceNavbar(false);
        if (showseguridadNavbar) setShowseguridadNavbar(false);
        if (showApartadoUnoNavbar) setShowApartadoUnoNavbar(false);
        if (showApartadoTresNavbar) setShowApartadoTresNavbar(false);
    };

    const toggleApartadoTresNavbar = () => {
        setShowApartadoTresNavbar(!showApartadoTresNavbar);
        if (showMaintenanceNavbar) setShowMaintenanceNavbar(false);
        if (showseguridadNavbar) setShowseguridadNavbar(false);
        if (showApartadoUnoNavbar) setShowApartadoUnoNavbar(false);
        if (showApartadoDosNavbar) setShowApartadoDosNavbar(false);
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            router.push('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
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
                        <Link href="/inicio" className="block py-2 px-4 rounded hover:bg-blue-700">
                            Inicio
                        </Link>
                    </li>
                    {/* Academico */}
                    <li>
                        <button
                            onClick={toggleMaintenanceNavbar}
                            className="w-full text-left py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
                        >
                            Académico
                        </button>
                        {showMaintenanceNavbar && (
                            <ul className="ml-4 mt-2 space-y-2 text-blue-200">
                                <li>
                                    <Link href="/estudiantes" className="block py-1 px-4 rounded hover:bg-blue-600">
                                       Listado Estudiantes
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Modalidades
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Grado
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Sección
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Instituciones
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Matrícula
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Area
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Graduandos
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* Apartado1 */}
                    <li>
                        <button
                            onClick={toggleApartadoUnoNavbar}
                            className="w-full text-left py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
                        >
                            Benefactores
                        </button>
                        {showApartadoUnoNavbar && (
                            <ul className="ml-4 mt-2 space-y-2 text-blue-200">
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Listado Benefactores
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Lineas de Beneficios
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/*  Apartado2 
                    <li>
                        <button
                            onClick={toggleApartadoDosNavbar}
                            className="w-full text-left py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
                        >
                            Apartado2
                        </button>
                        {showApartadoDosNavbar && (
                            <ul className="ml-4 mt-2 space-y-2 text-blue-200">
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        1
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        2
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        3
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>*/}
                    {/*  Apartado3 */}
                    <li>
                        <button
                            onClick={toggleApartadoTresNavbar}
                            className="w-full text-left py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
                        >
                            Otros
                        </button>
                        {showApartadoTresNavbar && (
                            <ul className="ml-4 mt-2 space-y-2 text-blue-200">
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Departamentos
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Municipios
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Tipo de Persona
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* Seguridad */}
                    <li>
                        <button
                            onClick={toggleseguridadNavbar}
                            className="w-full text-left py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
                        >
                            Seguridad
                        </button>
                        {showseguridadNavbar && (
                            <ul className="ml-4 mt-2 space-y-2 text-blue-200">
                                <li>
                                    <Link href="/usuarios" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Usuarios
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/roles" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Roles
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/permisos" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Permisos
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/objetos" className="block py-1 px-4 rounded hover:bg-blue-600">
                                        Objetos
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
                            className="text-Black-900 focus:outline-none hover:text-gray-500"
                        >
                            Menú
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-200">
                                <Link href="/perfil" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    Perfil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Contenido */}
                <main className="flex-1 p-6 bg-blue-50 overflow-y-auto">{children}</main>

                {/* Pie de página */}
                <footer className="bg-white p-4 text-center border-t border-gray-200">
                    © 2024 Sistema Académico
                </footer>
            </div>
        </div>
    );
};

export default Layout;
