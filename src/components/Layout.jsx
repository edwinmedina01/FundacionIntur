import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; //usuario


const Layout = ({ children }) => {
    const { user } = useContext(AuthContext); // usuario desde el contexto de autenticación
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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
        <div>
            <nav className="flex justify-between items-center bg-blue-700 p-4 shadow-md">
                <img 
                    src="/img/intur.png" 
                    alt="logo" 
                />
                <ul className="flex space-x-8 text-white mx-auto">
                    <li>
                        <Link href="/inicio" className="hover:text-blue-300 transition duration-300">Inicio</Link>
                    </li>

                    <li className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="text-white focus:outline-none hover:text-blue-300 transition duration-300"
                        >
                            Seguridad <span className="ml-2">▼</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                                <Link href="/roles" className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300">
                                    Roles
                                </Link>
                                <Link href="/usuarios" className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300">
                                    Usuarios
                                </Link>
                            </div>
                        )}
                    </li>
                </ul>
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none hover:text-blue-300 transition duration-300"
                    >
                        {/* Mostrar el nombre del usuario, o 'Usuario' si no está logueado */}
                        {user?.nombre || 'Usuario'} <span className="ml-2">▼</span>
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                            <Link href="/perfil" className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300">
                                Perfil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            <main>{children}</main>
            <footer className="bg-gray-200 p-4 text-center">© 2024 Tu Empresa</footer>
        </div>
    );
};

export default Layout;
