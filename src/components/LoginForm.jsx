import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const { login } = useContext(AuthContext);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('/api/login', { email, password });
     
            // Imprime toda la respuesta para ver su estructura
            console.log('Respuesta de la API:', respuesta);
    
            const { token, userId, role, primerLogin } = respuesta.data;
     
            if (!userId || !token) {
                throw new Error('userId o token no están presentes en la respuesta');
            }
     
            // Guarda el token y el userId en el contexto
            login(token, userId, role);
     
            setMensaje('Login exitoso');
            primerLogin ? router.push('/change-password') : router.push('/inicio');
        } catch (error) {
            setMensaje(error.response?.data?.mensaje || 'Error en el login');
            console.error('Error:', error.response?.data || error);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-sm">
                <img src="/img/intur.png" className="App-logo mb-6 mx-auto" alt="logo" />
                <h2 className="mb-4 text-2xl font-semibold text-center text-blue-700">Iniciar Sesión</h2>
                {mensaje && <p className="mb-4 text-red-500 text-center">{mensaje}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 relative">
                        <div className="absolute inset-y-3 left-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-gray-400">
                                <path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"/>
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="email"
                            value={email.toUpperCase()} // Muestra el texto siempre en mayúsculas
                            onChange={(e) => setEmail(e.target.value.toUpperCase())} // Guarda el valor en mayúsculas
                            className="block py-2 pl-10 pr-2 w-full text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                            placeholder=" "
                            required
                            maxLength={20}
                            style={{ textTransform: 'uppercase' }} // Visualiza el texto en mayúsculas
                        />
                        <label
                            htmlFor="email"
                            className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 left-2 duration-300 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                             Usuario *
                        </label>
                    </div>
                    <div className="mb-4 relative">
                        <div className="absolute inset-y-3 left-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-gray-400">
                                <path d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"/>
                            </svg>
                        </div>
                        <input
                            type={mostrarPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            className="block py-2 pl-10 pr-2 w-full text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            maxLength={40}
                        />
                        <label
                            htmlFor="password"
                            className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 left-2 duration-300 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Contraseña *
                        </label>
                        <span
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                        >
                            {mostrarPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-gray-800">
                                    <path d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-gray-800">
                                    <path d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                            )}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Entrar
                    </button>
                    <div className="mt-4 text-center">
                        <a href='/forgot-password' className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;


