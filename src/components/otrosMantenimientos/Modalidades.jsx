import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/router';

const ModalidadesManagement = () => {

  const [modalidades, setModalidades] = useState([]);
  const [formData, setFormData] = useState({
    Id_Modalidad: '',
    Nombre: '',
    Descripcion: '',
    Duracion: '',
    Horario: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const modalidadesPerPage = 8;  // cantidad de modalidades por página
  const [searchQuery, setSearchQuery] = useState('');


  // Filtros del buscador por nombre
  const filteredModalidades = modalidades.filter(modalidad =>
    modalidad.Nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación para modalidades filtradas
  const indexOfLastModalidad = currentPage * modalidadesPerPage;
  const indexOfFirstModalidad = indexOfLastModalidad - modalidadesPerPage;
  const currentModalidades = filteredModalidades.slice(indexOfFirstModalidad, indexOfLastModalidad);

  // Funciones de navegación de páginas
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredModalidades.length / modalidadesPerPage)) {
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
    const exportData = currentModalidades.map(modalidad => ({
      ID: modalidad.Id_Modalidad,
      Nombre: modalidad.Nombre,
      Descripción: modalidad.Descripcion,
      Duración: modalidad.Duracion,
      Horario: modalidad.Horario,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Modalidades');

    XLSX.writeFile(workbook, 'Modalidades.xlsx');
  };

  // Fetch de modalidades desde el backend
  useEffect(() => {
    fetchModalidades();
  }, []);

  const fetchModalidades = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/modalidades');
      setModalidades(response.data);
    } catch (error) {
      console.error('Error fetching modalidades:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch(`/api/apis_mantenimientos/modalidades`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la modalidad');
        }

        setUpdateNotification('Modalidad actualizada exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/apis_mantenimientos/modalidades', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear la modalidad');
        }

        setNotification('Modalidad agregada exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchModalidades();
      resetForm();
    } catch (error) {
      console.error('Error al guardar la modalidad:', error);
    }
  };

  const handleEdit = (modalidad) => {
    setFormData(modalidad);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Modalidad) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/modalidades', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Modalidad }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la modalidad');
      }

      fetchModalidades();
      resetForm();
      setDeleteNotification('Modalidad eliminada exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar la modalidad:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Modalidad: '', Nombre: '', Descripcion: '', Duracion: '', Horario: '' });
    setIsEditing(false);
  };

  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Modalidad' : 'Agregar Modalidad'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre" className="block mb-2 text-sm font-medium text-gray-700">Nombre de la Modalidad</label>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre de la Modalidad"
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

          <label htmlFor="Horario" className="block mb-2 text-sm font-medium text-gray-700">Horario</label>
          <input
            type="text"
            name="Horario"
            placeholder="Horario"
            value={formData.Horario}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {isEditing ? 'Actualizar' : 'Agregar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancelar
            </button>
          </div>
        </form>

        {notification && <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">{notification}</div>}
        {updateNotification && <div className="mt-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">{updateNotification}</div>}
        {deleteNotification && <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">{deleteNotification}</div>}
      </div>

      {/* Columna derecha: Tabla de modalidades */}
      <div className="w-2/3">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        >
          Exportar a Excel
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 mb-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-slate-200">
            <tr>
              <th className="py-4 px-6 text-left">Id Modalidad</th>
              <th className="py-4 px-20 text-left">Nombre</th>
              <th className="py-4 px-16 text-left">Descripción</th>
              <th className="py-4 px-6 text-left">Duración</th>
              <th className="py-4 px-16 text-left">Horario</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentModalidades.map((modalidad) => (
              <tr key={modalidad.Id_Modalidad} className="border-b hover:bg-gray-100 transition duration-300">
                <td className="py-4 px-6">{modalidad.Id_Modalidad}</td>
                <td className="py-4 px-6"><strong>{modalidad.Nombre}</strong></td>
                <td className="py-4 px-6">{modalidad.Descripcion}</td>
                <td className="py-4 px-6">{modalidad.Duracion}</td>
                <td className="py-4 px-6">{modalidad.Horario}</td>
                <td className="py-4 px-6 flex justify-center space-x-2">
                  <button 
                    onClick={() => handleEdit(modalidad)} 
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(modalidad.Id_Modalidad)} 
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
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
            {Array.from({ length: Math.ceil(modalidades.length / modalidadesPerPage) }, (_, index) => (
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

export default ModalidadesManagement;
