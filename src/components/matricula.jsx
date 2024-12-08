import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ArrowDownCircleIcon, UserPlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';
import { ShieldExclamationIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MatriculaManagement = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext); // Usuario logueado
  const [matriculas, setMatriculas] = useState([]);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);

  const [formData, setFormData] = useState({
    Id_Matricula: '',
    Estudiante: '',
    Modalidad: '',
    Grado: '',
    Seccion: '',
    Fecha_Matricula: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');
  const [search, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [matriculasPerPage] = useState(5);

  useEffect(() => {
    fetchMatriculas();
    fetchPermisos();
  }, [user]);

  // Verificación de permisos
  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 14; // ID relacionado con matriculas
        const response = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto,
        });

        const permisosData = response.data;

        if (
          permisosData.Permiso_Insertar !== '1' &&
          permisosData.Permiso_Actualizar !== '1' &&
          permisosData.Permiso_Eliminar !== '1' &&
          permisosData.Permiso_Consultar !== '1'
        ) {
          setSinPermisos(true);
        } else {
          setPermisos(permisosData);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener permisos');
    }
  };

  const fetchMatriculas = async () => {
    try {
      const response = await axios.get('/api/matriculas');
      setMatriculas(response.data);
    } catch (error) {
      console.error('Error fetching matriculas:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch(`/api/matriculas`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la matrícula');
        }

        setUpdateNotification('Matrícula actualizada exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/matriculas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear la matrícula');
        }

        setNotification('Matrícula agregada exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchMatriculas();
      resetForm();
    } catch (error) {
      console.error('Error al guardar la matrícula:', error);
    }
  };

  const handleEdit = (matricula) => {
    setFormData(matricula);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Matricula) => {
    try {
      const response = await fetch('/api/matriculas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Matricula }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la matrícula');
      }

      fetchMatriculas();
      resetForm();
      toast.error('Matrícula eliminada exitosamente', {
        style: {
          backgroundColor: '#ffebee', // Fondo suave rojo
          color: '#d32f2f', // Texto rojo oscuro
          fontWeight: 'bold',
          border: '1px solid #f5c6cb',
          padding: '16px',
          borderRadius: '12px',
        },
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
      
    } catch (error) {
      toast.error('Error al eliminar la matrícula:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Matricula: '',
      Estudiante: '',
      Modalidad: '',
      Grado: '',
      Seccion: '',
      Fecha_Matricula: '',
    });
    setIsEditing(false);
  };

  const filteredMatriculas = matriculas.filter((matricula) =>
    matricula.Estudiante.toLowerCase().includes(search.toLowerCase()) ||
    matricula.Modalidad.toLowerCase().includes(search.toLowerCase()) ||
    matricula.Grado.toLowerCase().includes(search.toLowerCase()) ||
    matricula.Seccion.toLowerCase().includes(search.toLowerCase()) ||
    String(matricula.Identidad).toLowerCase().includes(search.toLowerCase()) // Asegurar que Identidad sea un string
  );
  
  // Paginación
  const indexOfLastMatricula = currentPage * matriculasPerPage;
  const indexOfFirstMatricula = indexOfLastMatricula - matriculasPerPage;
  const currentMatriculas = filteredMatriculas.slice(indexOfFirstMatricula, indexOfLastMatricula);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredMatriculas.length / matriculasPerPage);

  // Función para exportar a Excel
  const handleExport = () => {
    const transformedMatriculas = filteredMatriculas.map((matricula) => ({
      Id_Matricula: matricula.Id_Matricula,
      Estudiante: matricula.Estudiante,
      Modalidad: matricula.Modalidad,
      Grado: matricula.Grado,
      Seccion: matricula.Seccion,
      Fecha_Matricula: new Date(matricula.Fecha_Matricula).toLocaleDateString('es-ES'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(transformedMatriculas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriculas');
    XLSX.writeFile(workbook, 'matriculas.xlsx');
  };

  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (sinPermisos) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a la pantalla de Matrículas</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  }

  if (!permisos) {
    return <p>Cargando permisos...</p>;
  }

  return (
    <div className="w-full lg:w-2/3 p-6 rounded-lg">
      <center>
        <h2 className="text-2xl font-semibold mb-4">Matrícula General</h2>
      </center>

      {/* Barra de búsqueda */}
      <div className="w-2/2">
        <div>
        <center><input
  type="text"
  value={search}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="p-3 pl-10 pr-4 border border-gray-900 rounded-lg w-1/2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
  placeholder="Buscar..."
/></center>
        </div>
      </div>
<br></br>
      {/* Botón para exportar */}
      <div className="mb-4 flex justify-between items-center">
{/* Botón para agregar matrícula */}
 {permisos.Permiso_Insertar === '1' && (
<button
  onClick={() => router.push('/matricula')}
  className="bg-cyan-800 text-white py-2 px-4 rounded hover:bg-cyan-700 transition duration-200"
>
  <UserPlusIcon className="w-5 h-5 inline-block mr-2" /> 
  Nueva Matrícula
</button>
)}
  {permisos.Permiso_Consultar === '1' && (
      <Link href={`/matricula`}>
       <button className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition-colors">
       <PencilSquareIcon className="h-6 w-6 inline" />  Editar Registros
        </button>
         </Link>
 )}
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
           <ArrowDownCircleIcon className="h-6 w-6 inline" />    Exportar Excel
          </button>
      </div>


      {/* Tabla de matrículas */}     
      <table className="min-w-full border-collapse">
  <thead>
    <tr>
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Identidad</th>
      <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Estudiante</th>
      <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Modalidad</th>
      <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Grado</th>
      <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Sección</th>
      <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Fecha Matrícula</th>
      <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Acciones</th>
    </tr>
  </thead>
        <tbody>
          {currentMatriculas.map((matricula) => (
            <tr key={matricula.Id_Matricula}>
               <td className="py-2 px-4">{matricula.Identidad}</td>
<td className="py-2 px-4">
  {matricula.Estudiante} {matricula.Segundo_Nombre}{matricula.Primer_Apellido}{matricula.Segundo_Apellido}
</td>

              <td className="py-2 px-4">{matricula.Modalidad}</td>
              <td className="py-2 px-4">{matricula.Grado}</td>
              <td className="py-2 px-4">{matricula.Seccion}</td>
              <td className="py-4 px-6 border-b">
  {matricula.Fecha_Matricula
    ? new Date(matricula.Fecha_Matricula).toISOString().split('T')[0] // Convierte a UTC y formatea
    : "No disponible"}
</td>
              {(permisos.Permiso_Actualizar === '1' || permisos.Permiso_Eliminar === '1') && (
                <td className="py-2 px-4">
                  {permisos.Permiso_Eliminar === '1' && (
                    <center><button
                      onClick={() => handleDelete(matricula.Id_Matricula)}
                      className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                      >
                        <TrashIcon className="h-6 w-6" />
                      </button></center>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

 {/* Paginación */}
<div className="flex justify-between items-center mt-4">
  {/* Botón "Anterior" */}
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
      currentPage === 1
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none'
    }`}
  >
    Anterior
  </button>

  {/* Páginas */}
  <div className="flex space-x-2">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => paginate(index + 1)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
          currentPage === index + 1
            ? 'bg-white-600 text-black shadow-lg scale-105'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none'
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>

  {/* Botón "Siguiente" */}
  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
      currentPage === totalPages
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none'
    }`}
  >
    Siguiente
  </button>
</div>

      </div>
  );
};

export default MatriculaManagement;
