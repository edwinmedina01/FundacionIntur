import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstitucionManagement = () => {

  const [instituciones, setInstituciones] = useState([]);
            // ------------------- FUNCIONALIDAD ROLES----------------------//
            const { user } = useContext(AuthContext); // Usuario logueado
            const [permisos, setPermisos] = useState(null); //obtener permiso
            const [error, setError] = useState(null); //mostrar error de permiso
            const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
          // ------------------------------------------------------------//
  const [formData, setFormData] = useState({
    Id_Instituto: '',
    Nombre_Instituto: '',
    Direccion: '',
    Telefono: '',
    Correo: '',
    Director: '',
  });
  const [isEditing, setIsEditing] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
  const institucionesPerPage = 8;  // cantidad de instituciones por página
  const [searchQuery, setSearchQuery] = useState('');



  // Filtros del buscador por nombre
  const filteredInstituciones = instituciones.filter(instituto =>
    instituto.Nombre_Instituto.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación para instituciones filtradas
  const indexOfLastInstituto = currentPage * institucionesPerPage;
  const indexOfFirstInstituto = indexOfLastInstituto - institucionesPerPage;
  const currentInstituciones = filteredInstituciones.slice(indexOfFirstInstituto, indexOfLastInstituto);

  // Funciones de navegación de páginas
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredInstituciones.length / institucionesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const setPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    const exportData = currentInstituciones.map(instituto => ({
      ID: instituto.Id_Instituto,
      Nombre: instituto.Nombre_Instituto,
      Dirección: instituto.Direccion,
      Teléfono: instituto.Telefono,
      Correo: instituto.Correo,
      Director: instituto.Director,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Instituciones');

    XLSX.writeFile(workbook, 'Instituciones.xlsx');
  };

  // Fetch de instituciones desde el backend
  useEffect(() => {
    fetchInstituciones();
    fetchPermisos();
  }, [user]);

 // -------- PERMISOS -------- //
 const fetchPermisos = async () => {
  try {
    if (user) {
      const idObjeto = 9; // ID del objeto relacionado con esta página
      const response = await axios.post('/api/api_permiso', {
        idRol: user.rol,
        idObjeto,
      });

      const permisosData = response.data;

      // Validar si no hay permisos habilitados
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


  const fetchInstituciones = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/instituciones');
      setInstituciones(response.data);
    } catch (error) {
      toast.error('Error fetching instituciones:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch('/api/apis_mantenimientos/instituciones', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la institución');
        }

        toast.success('Institución actualizada exitosamente');
        
      } else {
        const response = await fetch('/api/apis_mantenimientos/instituciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear la institución');
        }

        toast.success('Institución agregada exitosamente');
        
      }

      fetchInstituciones();
      resetForm();
    } catch (error) {
      toast.error('Error al guardar la institución:', error);
    }
  };

  const handleEdit = (instituto) => {
    setFormData(instituto);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Instituto) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/instituciones', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Instituto }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la institución');
      }

      fetchInstituciones();
      resetForm();
      toast.error('Institución eliminada exitosamente', {
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
      toast.error('Error al eliminar la institución:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Instituto: '', Nombre_Instituto: '', Direccion: '', Telefono: '', Correo: '', Director: '' });
    setIsEditing(false);
  };

// Renderizado
if (!user) {
  return <p>Cargando usuario...</p>;
}

if (error) {
  return <p>{error}</p>;
}

if (sinPermisos) {
  return         <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
  <ShieldExclamationIcon className="h-12 w-12 mr-4" />
  <div>
    <h3 className="font-bold text-lg">
      Sin permisos para Acceder a la Pantalla de Instituciones
    </h3>
    <p>No tienes permisos para Acceder a la información.</p>
  </div>
</div>
}

if (!permisos) {
  return <p>Cargando permisos...</p>;
}


  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Institución' : 'Agregar Institución'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre_Instituto" className="block mb-2 text-sm font-medium text-gray-700">Nombre de la Institución</label>
          <input
            type="text"
            name="Nombre_Instituto"
            placeholder="Nombre de la Institución"
            value={formData.Nombre_Instituto}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Direccion" className="block mb-2 text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="Direccion"
            placeholder="Dirección"
            value={formData.Direccion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Telefono" className="block mb-2 text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            name="Telefono"
            placeholder="Teléfono"
            value={formData.Telefono}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Correo" className="block mb-2 text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            name="Correo"
            placeholder="Correo"
            value={formData.Correo}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Director" className="block mb-2 text-sm font-medium text-gray-700">Director</label>
          <input
            type="text"
            name="Director"
            placeholder="Director"
            value={formData.Director}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

<div className="flex justify-end">
  {isEditing
    ? // Mostrar botón "Actualizar" solo si tiene permisos de actualización
      permisos.Permiso_Actualizar === "1" && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Actualizar
        </button>
      )
    : // Mostrar botón "Agregar" solo si tiene permisos de inserción
      permisos.Permiso_Insertar === "1" && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Agregar
        </button>
      )}

  <button
    type="button"
    onClick={resetForm}
    className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Cancelar
  </button>
</div>

        </form>

      </div>

      {/* Columna derecha: Tabla de instituciones */}
      
      <div className="w-2/3">
      <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        >
          Exportar a Excel
        </button>
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 mb-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Nombre</th>
              <th className="p-3 border-b">Dirección</th>
              <th className="p-3 border-b">Teléfono</th>
              <th className="p-3 border-b">Correo</th>
              <th className="p-3 border-b">Director</th>
              <th className="p-3 border-b text-center">Acciones</th>
            </tr>
          </thead>
          {permisos?.Permiso_Consultar === "1" && ( 
          <tbody>
            {currentInstituciones.map((instituto) => (
              <tr key={instituto.Id_Instituto}>
                <td className="p-3 border-b">{instituto.Id_Instituto}</td>
                <td className="p-3 border-b">{instituto.Nombre_Instituto}</td>
                <td className="p-3 border-b">{instituto.Direccion}</td>
                <td className="p-3 border-b">{instituto.Telefono}</td>
                <td className="p-3 border-b">{instituto.Correo}</td>
                <td className="p-3 border-b">{instituto.Director}</td>
                <td className="py-4 px-6 flex justify-center space-x-2">
                {permisos.Permiso_Actualizar === "1" && ( 

                <button
            onClick={() => handleEdit(instituto)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
          >
            Editar
          </button>)}
          {permisos.Permiso_Eliminar === "1" && (
          <button
            onClick={() => handleDelete(instituto.Id_Instituto)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
          >
            X
          </button>)}
                </td>
              </tr>
            ))}
          </tbody>)}
        </table>

{/* Paginación */}
<div className="flex justify-between mt-4">
  <button
    onClick={prevPage}
    className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
  >
    Anterior
  </button>

  {/* Páginas */}
  <div className="flex space-x-2">
    {Array.from({ length: Math.ceil(filteredInstituciones.length / institucionesPerPage) }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => setPage(index + 1)}
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
    onClick={nextPage}
    className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
  >
    Siguiente
  </button>
        </div>
      </div>
    </div>
  );
};

export default InstitucionManagement;
