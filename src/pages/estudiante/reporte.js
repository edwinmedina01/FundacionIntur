import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import Link from 'next/link';
import * as XLSX from 'xlsx'; // Importar la librería xlsx
import AuthContext from '../../context/AuthContext';
const EstudiantesReporte = () => {
  const { user } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const [recordsPerPage] = useState(10);  // Registros por página
  const [permisos, setPermisos] = useState([]);



  useEffect(() => {
    fetchEstudiantes();
    fetchPermisos(user.rol);
  }, [user]);

  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get('/api/estudiantes');
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar los estudiantes basados en el término de búsqueda
  const filteredEstudiantesold = estudiantes.filter((estudiante) =>
    `${estudiante.Persona?.Primer_Nombre} ${estudiante.Persona?.Primer_Apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const fullText = `
      ${estudiante.Persona?.Identidad || ''} 
      ${estudiante.Persona?.Primer_Nombre || ''} 
      ${estudiante.Persona?.Segundo_Nombre || ''} 
      ${estudiante.Persona?.Primer_Apellido || ''} 
      ${estudiante.Persona?.Segundo_Apellido || ''} 
      ${estudiante.Persona?.Sexo || ''} 
      ${estudiante.Persona?.Lugar_Nacimiento || ''} 
      ${estudiante.Instituto?.Nombre_Instituto || ''} 
      ${estudiante.Area?.Nombre_Area || ''} 
      ${estudiante.Beneficio?.Nombre_Beneficio || ''} 
      ${estudiante.Persona?.Municipio?.Nombre_Municipio || ''}
    `;
  
    // Convertir todo el texto a minúsculas y buscar el término de búsqueda
    return fullText.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
 // Obtener los estudiantes para la página actual
 const indexOfLast = currentPage * recordsPerPage;
 const indexOfFirst = indexOfLast - recordsPerPage;
 const currentEstudiantes = filteredEstudiantes.slice(indexOfFirst, indexOfLast);

 // Cambiar página
 const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

// Número total de páginas
const totalPages = Math.ceil(filteredEstudiantes.length / recordsPerPage);



  // Función para exportar los datos a un archivo de Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEstudiantes.map((estudiante) => ({
      Identidad: estudiante.Persona?.Identidad || 'N/A',
      Nombre: `${estudiante.Persona?.Primer_Nombre || ''} ${estudiante.Persona?.Segundo_Nombre || ''} ${estudiante.Persona?.Primer_Apellido || ''} ${estudiante.Persona?.Segundo_Apellido || ''}`,
      Sexo: estudiante.Persona?.Sexo === 1 ? 'Masculino' : estudiante.Persona?.Sexo === 0 ? 'Femenino' : 'No especificado',
      Lugar_Nacimiento: estudiante.Persona?.Lugar_Nacimiento || 'N/A',
      Instituto: estudiante.Instituto?.Nombre_Instituto || 'N/A',
      Area: estudiante.Area?.Nombre_Area || 'N/A',
      Beneficio: estudiante.Beneficio?.Nombre_Beneficio || 'N/A',
      Municipio: estudiante.Persona?.Municipio?.Nombre_Municipio || 'N/A'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');

    // Generar y descargar el archivo Excel
    XLSX.writeFile(workbook, 'reporte_estudiantes.xlsx');
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Reporte Estudiantes</h1>

{/* Contenedor para la búsqueda y el botón de exportación */}
<div className="mb-4 flex justify-between items-center">
  {/* Barra de búsqueda */}
  <div className="flex justify-center w-1/2">
    <input
      type="text"
      placeholder="Buscar estudiante"
      value={searchTerm}
      onChange={handleSearch}
      className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 w-full"
    />
  </div>
  
  {/* Botón de exportación */}
  <div className="flex justify-center ml-4">
    <button
      onClick={exportToExcel}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
    >
      Exportar a Excel
    </button>
  </div>
</div>
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
          {/* <tbody>
            {filteredEstudiantes.map((estudiante) => (
              <tr key={estudiante.Id_Estudiante} className="hover:bg-blue-50">
                <td className="py-4 px-6 border-b">{estudiante.Persona?.Identidad}</td>
                <td className="py-4 px-6 border-b">
                  {`${estudiante.Persona?.Primer_Nombre || ''} ${estudiante.Persona?.Segundo_Nombre || ''} ${estudiante.Persona?.Primer_Apellido || ''} ${estudiante.Persona?.Segundo_Apellido || ''}`}
                </td>
                <td className="py-4 px-6 border-b">{estudiante.Persona?.Sexo === 1 ? 'Masculino' : 'Femenino'}</td>
                <td className="py-4 px-6 border-b">{estudiante.Persona?.Lugar_Nacimiento}</td>
                <td className="py-4 px-6 border-b">{estudiante.Instituto.Nombre_Instituto}</td>
                <td className="py-4 px-6 border-b">{estudiante.Area?.Nombre_Area}</td>
                <td className="py-4 px-6 border-b">{estudiante.Beneficio?.Nombre_Beneficio}</td>
                <td className="py-4 px-6 border-b">{estudiante.Persona?.Municipio?.Nombre_Municipio}</td>
                <td className="py-4 px-6 border-b">
                  <div className="flex gap-2">
                    <Link href={`/estudiantes/${estudiante.Id_Estudiante}`}>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
                        Editar
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody> */}
          <tbody>
  {currentEstudiantes.map((estudiante) => (
    <tr key={estudiante.Id_Estudiante} className="hover:bg-blue-50">
      <td className="py-4 px-6 border-b">
        {estudiante.Persona?.Identidad || 'Identidad no disponible'}
      </td>
      <td className="py-4 px-6 border-b">
        {`${estudiante.Persona?.Primer_Nombre || ''} ${estudiante.Persona?.Segundo_Nombre || ''} ${estudiante.Persona?.Primer_Apellido || ''} ${estudiante.Persona?.Segundo_Apellido || ''}`}
      </td>
      <td className="py-4 px-6 border-b">
        {estudiante.Persona?.Sexo === 1 ? 'Masculino' : estudiante.Persona?.Sexo === 0 ? 'Femenino' : 'Sexo no disponible'}
      </td>
      <td className="py-4 px-6 border-b">
        {estudiante.Persona?.Lugar_Nacimiento || 'Lugar de nacimiento no disponible'}
      </td>
      <td className="py-4 px-6 border-b">
        {estudiante.Instituto?.Nombre_Instituto || 'Instituto no disponible'}
      </td>
      <td className="py-4 px-6 border-b">
        {estudiante.Area?.Nombre_Area || 'Área no disponible'}
      </td>
      <td className="py-4 px-6 border-b">
        {estudiante.Beneficio?.Nombre_Beneficio || 'Beneficio no disponible'}
      </td>
      <td className="py-4 px-6 border-b">
        {estudiante.Persona?.Municipio?.Nombre_Municipio || 'Municipio no disponible'}
      </td>
      <td className="py-4 px-6 border-b">
        <div className="flex gap-2">
          <Link href={`/estudiantes/${estudiante.Id_Estudiante}`}>
          {permisos[1]?.actualizar && (
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
              Editar
            </button>)}
          </Link>
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>

        <div className="flex justify-center mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 disabled:bg-gray-400"
          >
            Anterior
          </button>
          <span className="px-4 py-2">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-gray-400"
          >
            Siguiente
          </button>
        </div>
      </div>

  
    </Layout>
  );
};

export default EstudiantesReporte;
