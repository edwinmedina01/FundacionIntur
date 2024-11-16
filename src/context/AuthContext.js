// context/AuthContext.js

import { createContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

const AuthContext = createContext();

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'tu_clave_secreta';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Estado inicial de carga
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt.decode (token, SECRET_KEY);
                // Guardar todos los campos que necesitas en el estado del usuario
                setUser({
                    id: decoded.id,
                    rol: decoded.role, // Cambia aquí a decoded.rol para obtener el ROL
                    email: decoded.email,
                    estado: decoded.estado,
                    usuario: decoded.nombre // Asegúrate de que el campo 'usuario' esté presente en el token
                });
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false); // Finaliza la carga
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/`; // Guarda el token en las cookies
        const decoded = jwt.decode(token);
        console.log('token decodificado en login es: test', decoded);
        // Guardar todos los campos que necesitas en el estado del usuario
        setUser({
            id: decoded.id,
            rol: decoded.role, // Cambia aquí a decoded.rol para obtener el ROL
            email: decoded.email,
            estado: decoded.estado,
            usuario: decoded.nombre // Asegúrate de que el campo 'usuario' esté presente en el token
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
