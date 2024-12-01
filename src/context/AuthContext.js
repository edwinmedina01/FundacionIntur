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
                // Decodificar el token sin validarlo (solo para extraer los datos)
                const decoded = jwt.decode(token);
                
                if (decoded) {
                    // Guardar todos los campos que necesitas en el estado del usuario
                    setUser({
                        id: decoded.id,
                        rol: decoded.role, // Asegúrate de que este campo existe en el token
                        email: decoded.email,
                        estado: decoded.estado,
                        usuario: decoded.nombre // Asegúrate de que este campo también esté presente en el token
                    });
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false); // Finaliza la carga
    }, []);

    const login = (token) => {
        // Guardar el token en localStorage y cookies
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/`; // Guarda el token en las cookies
        
        try {
            // Decodificar el token al recibirlo
            const decoded = jwt.decode(token);
            if (decoded) {
                // Guardar los campos necesarios en el estado
                setUser({
                    id: decoded.id,
                    rol: decoded.role, 
                    email: decoded.email,
                    estado: decoded.estado,
                    usuario: decoded.nombre
                });
            }
        } catch (error) {
            console.error('Error al procesar el token en login:', error);
        }
    };

    const logout = () => {
        // Eliminar el token y resetear el estado
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

