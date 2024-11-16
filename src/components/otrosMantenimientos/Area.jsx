import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';


const AreaManagement = () => {

  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    Id_Area: '',
    Nombre_Area: '',
    Tipo_Area: '',
    Responsable_Area: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const areasPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');



  // Filtrado de áreas por Nombre_Area
  const filteredAreas = areas.filter(area =>
    area.Nombre_Area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastArea = currentPage * areasPerPage;
  const indexOfFirstArea = indexOfLastArea - areasPerPage;
  const currentAreas = filteredAreas.slice(indexOfFirstArea, indexOfLastArea);

  // Paginación
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredAreas.length / areasPerPage)) {
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

  // Exportación a Excel
  const exportToExcel = () => {
    const exportData = currentAreas.map(area => ({
      ID: area.Id_Area,
      Nombre: area.Nombre_Area,
      Tipo: area.Tipo_Area,
      Responsable: area.Responsable_Area,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Áreas');

    XLSX.writeFile(workbook, 'Areas.xlsx');
  };

  // Fetch de áreas desde el backend
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/area');
      setAreas(response.data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch('/api/apis_mantenimientos/area', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el área');
        }

        setUpdateNotification('Área actualizada exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/apis_mantenimientos/area', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el área');
        }

        setNotification('Área agregada exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchAreas();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el área:', error);
    }
  };

  const handleEdit = (area) => {
    setFormData(area);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Area) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/area', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Area }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el área');
      }

      fetchAreas();
      resetForm();
      setDeleteNotification('Área eliminada exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el área:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Area: '', Nombre_Area: '', Tipo_Area: '', Responsable_Area: '' });
    setIsEditing(false);
  };

  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Área' : 'Agregar Área'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre_Area" className="block mb-2 text-sm font-medium text-gray-700">Nombre del Área</label>
          <input
            type="text"
            name="Nombre_Area"
            placeholder="Nombre del Área"
            value={formData.Nombre_Area}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Tipo_Area" className="block mb-2 text-sm font-medium text-gray-700">Tipo de Área</label>
          <input
            type="text"
            name="Tipo_Area"
            placeholder="Tipo de Área"
            value={formData.Tipo_Area}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Responsable_Area" className="block mb-2 text-sm font-medium text-gray-700">Responsable del Área</label>
          <input
            type="text"
            name="Responsable_Area"
            placeholder="Responsable del Área"
            value={formData.Responsable_Area}
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
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
           onClick={resetForm}
           >
              Cancelar
            </button>
          </div>
        </form>

        {/* Notificaciones */}
        {notification && <div className="mt-4 text-green-600">{notification}</div>}
        {updateNotification && <div className="mt-4 text-blue-600">{updateNotification}</div>}
        {deleteNotification && <div className="mt-4 text-red-600">{deleteNotification}</div>}
      </div>

      {/* Columna derecha: Tabla de áreas */}
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
              <th className="p-3 border-b">Nombre del Área</th>
              <th className="p-3 border-b">Tipo de Área</th>
              <th className="p-3 border-b">Responsable del Área</th>
              <th className="p-3 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentAreas.map((area) => (
              <tr key={area.Id_Area} className="hover:bg-slate-100 transition-colors">
                <td className="p-3 border-b">{area.Id_Area}</td>
                <td className="p-3 border-b">{area.Nombre_Area}</td>
                <td className="p-3 border-b">{area.Tipo_Area}</td>
                <td className="p-3 border-b">{area.Responsable_Area}</td>
                <td className="p-3 border-b flex space-x-2">
                  <button
                    onClick={() => handleEdit(area)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(area.Id_Area)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
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
    disabled={currentPage === 1}
  >
    Anterior
  </button>

  {/* Páginas */}
  <div className="flex space-x-2">
    {Array.from({ length: Math.ceil(filteredAreas.length / areasPerPage) }, (_, index) => (
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
    disabled={currentPage === Math.ceil(filteredAreas.length / areasPerPage)}
  >
    Siguiente
  </button>
        </div>
      </div>
    </div>
  );
};

export default AreaManagement;
