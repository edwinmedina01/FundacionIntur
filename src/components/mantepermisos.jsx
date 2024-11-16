import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const PermissionsManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [objects, setObjects] = useState([]); // Nuevo estado para los objetos
  const [formData, setFormData] = useState({
    Id_Permiso: '',
    Id_Rol: '',
    Id_Objeto: '', // Añadir el Id_Objeto en el estado
    Permiso_Insertar: false,
    Permiso_Actualizar: false,
    Permiso_Eliminar: false,
    Permiso_Consultar: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  
 // Paginación
 const [currentPage, setCurrentPage] = useState(1);
 const [perPage] = useState(8); // Número de elementos por página
 const [searchTerm, setSearchTerm] = useState(''); // Búsqueda

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
    fetchObjects(); // Llama a la función para obtener objetos
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se hace búsqueda
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/api/permisos');
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Nueva función para obtener objetos
  const fetchObjects = async () => {
    try {
      const response = await axios.get('/api/objetos'); // Cambia la ruta si es necesario
      setObjects(response.data);
    } catch (error) {
      console.error('Error fetching objects:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const requestData = {
      ...formData,
    };

    const response = await fetch('/api/permisos', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el permiso`);
    }

    setNotification(`Permiso ${isEditing ? 'actualizado' : 'agregado'} exitosamente`);
    setTimeout(() => setNotification(''), 3000);

    fetchPermissions();
    resetForm();
  } catch (error) {
    console.error('Error al guardar el permiso:', error);
  }
};

  const handleEdit = (permission) => {
    setFormData({
      ...permission,
      Permiso_Insertar: permission.Permiso_Insertar === '1',
      Permiso_Actualizar: permission.Permiso_Actualizar === '1',
      Permiso_Eliminar: permission.Permiso_Eliminar === '1',
      Permiso_Consultar: permission.Permiso_Consultar === '1'
    });
    setIsEditing(true);
  };

  const handleDelete = async (Id_Permiso) => {
    try {
      const response = await fetch('/api/permisos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Permiso }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el permiso');
      }

      fetchPermissions();
      resetForm();
      setNotification('Permiso eliminado exitosamente');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error al eliminar el permiso:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Permiso: '',
      Id_Rol: '',
      Id_Objeto: '', // Resetear también el Id_Objeto
      Permiso_Insertar: false,
      Permiso_Actualizar: false,
      Permiso_Eliminar: false,
      Permiso_Consultar: false,
    });
    setIsEditing(false);
  };

  // Crear un mapa de roles para acceder al nombre del rol por Id_Rol
  const roleMap = roles.reduce((acc, role) => {
    acc[role.Id_Rol] = role.Rol; // Asumiendo que `Rol` es el nombre del rol
    return acc;
  }, {});

  // Crear un mapa de objetos para acceder al nombre del objeto por Id_Objeto
  const objectMap = objects.reduce((acc, object) => {
    acc[object.Id_Objeto] = object.Objeto; // Asumiendo que `Nombre` es el nombre del objeto
    return acc;
  }, {});

// Paginación lógica con filtrado por rol y objeto
const filteredPermissions = permissions.filter(permission => {
  // Obtén el nombre del rol usando el Id_Rol y verifica si es una cadena antes de usar toLowerCase()
  const roleName = roleMap[permission.Id_Rol] || '';  // Obtén el nombre del rol
  const roleMatches = roleName && roleName.toLowerCase().includes(searchTerm.toLowerCase());

  // Obtén el nombre del objeto usando el Id_Objeto y verifica si es una cadena antes de usar toLowerCase()
  const objectName = objectMap[permission.Id_Objeto] || '';  // Obtén el nombre del objeto
  const objectMatches = objectName && objectName.toLowerCase().includes(searchTerm.toLowerCase());

  return roleMatches || objectMatches;
});



const totalPages = Math.ceil(filteredPermissions.length / perPage);
const currentPermissions = filteredPermissions.slice((currentPage - 1) * perPage, currentPage * perPage);

const paginate = (pageNumber) => {
  if (pageNumber > 0 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};

// Exportación a Excel
const exportToExcel = () => {
  const transformedPermissions = permissions.map(permission => ({
    ...permission,
    Rol: roleMap[permission.Id_Rol] || 'Desconocido', // Mapea el Id_Rol a su nombre
    Objeto: objectMap[permission.Id_Objeto] || 'Desconocido', // Mapea el Id_Objeto a su nombre
    Permiso_Consultar: permission.Permiso_Consultar === '1' ? 'Sí' : 'No',
    Permiso_Insertar: permission.Permiso_Insertar === '1' ? 'Sí' : 'No',
    Permiso_Actualizar: permission.Permiso_Actualizar === '1' ? 'Sí' : 'No',
    Permiso_Eliminar: permission.Permiso_Eliminar === '1' ? 'Sí' : 'No',
  }));

  const ws = XLSX.utils.json_to_sheet(transformedPermissions);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Permisos");
  XLSX.writeFile(wb, "permisos.xlsx");
};



  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8 items-center">
      {/* Columna izquierda: Formulario */}
      <div className="w-4/6 bg-white p-6 rounded-lg shadow-md">
        <center>
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Permiso' : 'Asignar Permisos'}</h2>
        </center>
        <form onSubmit={handleSubmit}>
          {/* Selector de Rol */}
          <label className="block mb-2 text-sm font-medium text-gray-700">Rol</label>
          <select
            name="Id_Rol"
            value={formData.Id_Rol}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          >
            <option value="">Selecciona un Rol</option>
            {roles
              .filter(role => role.Estado === 1) // Filtra para mostrar solo roles activos
              .map((rol) => (
                <option key={rol.Id_Rol} value={rol.Id_Rol}>{rol.Rol}</option>
              ))}
          </select>

          {/* Selector de Objeto */}
          <label className="block mb-2 text-sm font-medium text-gray-700">Objeto</label>
          <select
            name="Id_Objeto"
            value={formData.Id_Objeto}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          >
            <option value="">Selecciona un Objeto</option>
            {objects.map((objeto) => (
              <option key={objeto.Id_Objeto} value={objeto.Id_Objeto}>{objeto.Objeto}</option> // Asumiendo que `Nombre` es el campo que deseas mostrar
            ))}
          </select>

          {/* Opciones de Permisos */}
          <div className="grid grid-cols-2 gap-4 mb-4">
  {['Insertar', 'Actualizar', 'Consultar', 'Eliminar'].map((action) => (
    <div key={action} className="flex items-center">
      <input
        type="checkbox"
        name={`Permiso_${action}`}
        checked={formData[`Permiso_${action}`]}
        onChange={handleCheckboxChange}
        className="mr-2 h-4 w-4 border border-gray-300 rounded"
      />
      <label className="text-sm font-medium text-gray-700">{action}</label>
    </div>
  ))}
</div>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {isEditing ? 'Actualizar' : 'Agregar'}
            </button>
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
      </div>

      {/* Columna derecha: Tabla de permisos */}
      <div className="w-2/1">
       {/* Buscador */}
                        <center><input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
  className="p-3 pl-10 pr-4 border border-gray-900 rounded-lg w-1/2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
  placeholder="Buscar..."
        /></center>
      <div className="flex justify-end space-x-4 mb-4">
                       
        <button
          onClick={exportToExcel}
          className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-900 transition duration-200"
          ><strong>
            Exportar a Excel
          </strong></button>
          </div>
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">

          <thead className="bg-slate-200">
            <tr>
              <th className="py-4 px-6 text-left">Id Permiso</th>
              <th className="py-4 px-6 text-left">Rol</th>
              <th className="py-4 px-6 text-left">Objeto</th> {/* Nueva columna para objeto */}
              <th className="py-4 px-6 text-left">Consultar</th>
              <th className="py-4 px-6 text-left">Insertar</th>
              <th className="py-4 px-6 text-left">Actualizar</th>
              <th className="py-4 px-6 text-left">Eliminar</th>
     
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
  {currentPermissions.map((permiso) => (
    <tr key={permiso.Id_Permiso} className="border-b hover:bg-gray-100">
      <td className="py-4 px-6">{permiso.Id_Permiso}</td>
      <td className="py-4 px-6"><strong>{roleMap[permiso.Id_Rol]}</strong></td> {/* Mostrar nombre del rol */}
      <td className="py-4 px-6">{objectMap[permiso.Id_Objeto]}</td> {/* Mostrar nombre del objeto correctamente */}
      <td className="py-4 px-6">{permiso.Permiso_Consultar === '1' ? 'Sí' : 'No'}</td>
      <td className="py-4 px-6">{permiso.Permiso_Insertar === '1' ? 'Sí' : 'No'}</td>
      <td className="py-4 px-6">{permiso.Permiso_Actualizar === '1' ? 'Sí' : 'No'}</td>
      <td className="py-4 px-6">{permiso.Permiso_Eliminar === '1' ? 'Sí' : 'No'}</td>

      <td className="py-4 px-6 flex justify-center space-x-2">
        <button onClick={() => handleEdit(permiso)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
        <button onClick={() => handleDelete(permiso.Id_Permiso)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">X</button>
      </td>
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
    </div>
  );
};

export default PermissionsManagement;
