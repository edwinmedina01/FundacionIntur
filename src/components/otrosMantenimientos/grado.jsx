import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';

const GradoManagement = () => {

  const [grados, setGrados] = useState([]);
          // ------------------- FUNCIONALIDAD ROLES----------------------//
          const { user } = useContext(AuthContext); // Usuario logueado
          const [permisos, setPermisos] = useState(null); //obtener permiso
          const [error, setError] = useState(null); //mostrar error de permiso
          const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
        // ------------------------------------------------------------//
      
  const [formData, setFormData] = useState({
    Id_Grado: '',
    Nombre: '',
    Descripcion: '',
    Nivel_Academico: '',
    Duracion: '',
    Cantidad_Materias: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const gradosPerPage = 8;  // cantidad de grados por página
  const [searchQuery, setSearchQuery] = useState('');


  // Filtros del buscador por nombre
  const filteredGrados = grados.filter(grado =>
    grado.Nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación para grados filtrados
  const indexOfLastGrado = currentPage * gradosPerPage;
  const indexOfFirstGrado = indexOfLastGrado - gradosPerPage;
  const currentGrados = filteredGrados.slice(indexOfFirstGrado, indexOfLastGrado);

  // Funciones de navegación de páginas
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredGrados.length / gradosPerPage)) {
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
    const exportData = currentGrados.map(grado => ({
      ID: grado.Id_Grado,
      Nombre: grado.Nombre,
      Descripción: grado.Descripcion,
      Nivel_Academico: grado.Nivel_Academico,
      Duración: grado.Duracion,
      Cantidad_Materias: grado.Cantidad_Materias,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grados');

    XLSX.writeFile(workbook, 'Grados.xlsx');
  };

  // Fetch de grados desde el backend
  useEffect(() => {
    fetchGrados();
    fetchPermisos();
  }, []);

   // -------- PERMISOS -------- //
   const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 8; // ID del objeto relacionado con esta página
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

  const fetchGrados = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/grado');
      setGrados(response.data);
    } catch (error) {
      console.error('Error fetching grados:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch(`/api/apis_mantenimientos/grado`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el grado');
        }

        setUpdateNotification('Grado actualizado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/apis_mantenimientos/grado', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el grado');
        }

        setNotification('Grado agregado exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchGrados();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el grado:', error);
    }
  };

  const handleEdit = (grado) => {
    setFormData(grado);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Grado) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/grado', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Grado }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el grado');
      }

      fetchGrados();
      resetForm();
      setDeleteNotification('Grado eliminado exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el grado:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Grado: '', Nombre: '', Descripcion: '', Nivel_Academico: '', Duracion: '', Cantidad_Materias: '' });
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
      Sin permisos para Acceder a la Pantalla de Grados
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
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Grado' : 'Agregar Grado'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre" className="block mb-2 text-sm font-medium text-gray-700">Nombre del Grado</label>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre del Grado"
            value={formData.Nombre}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Descripcion" className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            name="Descripcion"
            placeholder="Descripción"
            value={formData.Descripcion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Nivel_Academico" className="block mb-2 text-sm font-medium text-gray-700">Nivel Académico</label>
          <input
            type="text"
            name="Nivel_Academico"
            placeholder="Nivel Académico"
            value={formData.Nivel_Academico}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Duracion" className="block mb-2 text-sm font-medium text-gray-700">Duración</label>
          <input
            type="text"
            name="Duracion"
            placeholder="Duración"
            value={formData.Duracion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Cantidad_Materias" className="block mb-2 text-sm font-medium text-gray-700">Cantidad de Materias</label>
          <input
            type="number"
            name="Cantidad_Materias"
            placeholder="Cantidad de Materias"
            value={formData.Cantidad_Materias}
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

        {notification && <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">{notification}</div>}
        {updateNotification && <div className="mt-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">{updateNotification}</div>}
        {deleteNotification && <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">{deleteNotification}</div>}
      </div>

      {/* Columna derecha: Tabla de Grados */}
      
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
            <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-left">Descripción</th>
              <th className="py-4 px-6 text-left">Nivel Académico</th>
              <th className="py-4 px-6 text-left">Duración</th>
              <th className="py-4 px-6 text-left">Cantidad de Materias</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          {permisos?.Permiso_Consultar === "1" && (
          <tbody>
          {currentGrados.map((grado) => (
      <tr key={grado.Id_Grado} className="border-b">
        <td className="p-3">{grado.Nombre}</td>
        <td className="p-3">{grado.Descripcion}</td>
        <td className="p-3">{grado.Nivel_Academico}</td>
        <td className="p-3">{grado.Duracion}</td>
        <td className="p-3">{grado.Cantidad_Materias}</td>
        <td className="py-4 px-6 flex justify-center space-x-2"> {/* Alineación al centro */}
        {permisos.Permiso_Actualizar === "1" && (
          <button
            onClick={() => handleEdit(grado)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
          >
            Editar
          </button>)}
          {permisos.Permiso_Eliminar === "1" && (
          <button
            onClick={() => handleDelete(grado.Id_Grado)}
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
    {Array.from({ length: Math.ceil(filteredGrados.length / gradosPerPage) }, (_, index) => (
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

export default GradoManagement;
