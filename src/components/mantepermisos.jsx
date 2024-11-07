import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
    fetchObjects(); // Llama a la función para obtener objetos
  }, []);

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

  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
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
      <div className="w-2/3">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-slate-200">
            <tr>
              <th className="py-4 px-6 text-left">Id Permiso</th>
              <th className="py-4 px-6 text-left">Rol</th>
              <th className="py-4 px-6 text-left">Objeto</th> {/* Nueva columna para objeto */}
              <th className="py-4 px-6 text-left">Insertar</th>
              <th className="py-4 px-6 text-left">Actualizar</th>
              <th className="py-4 px-6 text-left">Eliminar</th>
              <th className="py-4 px-6 text-left">Consultar</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
  {permissions.map((permiso) => (
    <tr key={permiso.Id_Permiso} className="border-b hover:bg-gray-100">
      <td className="py-4 px-6">{permiso.Id_Permiso}</td>
      <td className="py-4 px-6"><strong>{roleMap[permiso.Id_Rol]}</strong></td> {/* Mostrar nombre del rol */}
      <td className="py-4 px-6">{objectMap[permiso.Id_Objeto]}</td> {/* Mostrar nombre del objeto correctamente */}
      <td className="py-4 px-6">{permiso.Permiso_Insertar === '1' ? 'Sí' : 'No'}</td>
      <td className="py-4 px-6">{permiso.Permiso_Actualizar === '1' ? 'Sí' : 'No'}</td>
      <td className="py-4 px-6">{permiso.Permiso_Eliminar === '1' ? 'Sí' : 'No'}</td>
      <td className="py-4 px-6">{permiso.Permiso_Consultar === '1' ? 'Sí' : 'No'}</td>
      <td className="py-4 px-6 flex justify-center space-x-2">
        <button onClick={() => handleEdit(permiso)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
        <button onClick={() => handleDelete(permiso.Id_Permiso)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionsManagement;
