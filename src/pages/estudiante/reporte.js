import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import Link from 'next/link';

const EstudiantesReporte = () => {
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get('/api/estudiantes');
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

  return (
    <Layout>
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Reporte Estudiantes</h1>
      
      <table className="min-w-full bg-white shadow-lg rounded-lg mb-6">
        <thead>
          <tr>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Identidad</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Nombre</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Sexo</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Lugar Nacimiento</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Instituto</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Area</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Beneficio</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Municipio</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.Id_Estudiante} className="hover:bg-blue-50">
              <td className="py-4 px-6 border-b">{estudiante.Persona?.Identidad}</td>
              <td className="py-4 px-6 border-b">
                {`${estudiante.Persona?.Primer_Nombre || ''} ${estudiante.Persona?.Segundo_Nombre || ''} ${estudiante.Persona?.Primer_Apellido || ''} ${estudiante.Persona?.Segundo_Apellido || ''}` }
              </td>
              <td className="py-4 px-6 border-b">{estudiante.Persona?.Sexo === 1 ? 'Masculino' : 'Femenino'}</td>
              <td className="py-4 px-6 border-b">{estudiante.Persona?.Lugar_Nacimiento}</td>
              <td className="py-4 px-6 border-b">{estudiante.Instituto.Nombre_Instituto}</td>
              <td className="py-4 px-6 border-b">{estudiante.Area?.Nombre_Area}</td>
              <td className="py-4 px-6 border-b">{estudiante.Beneficio?.Nombre_Beneficio}</td>
              <td className="py-4 px-6 border-b">{estudiante.Persona?.Municipio?.Nombre_Municipio}</td>
              <td className="py-4 px-6 border-b">
                <div className="flex gap-2">
                    <Link href="/estudiante">
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
                            Editar
                        </button>
                    </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>  
    </Layout>
  );
}

export default EstudiantesReporte;