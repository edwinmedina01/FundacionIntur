import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RolesManagement = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    Id_Rol: '',
    Rol: '',
    Descripcion: '',
    Estado: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch(`/api/roles`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el rol');
        }

        setUpdateNotification('Rol actualizado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el rol');
        }

        setNotification('Rol agregado exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchRoles();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el rol:', error);
    }
  };

  const handleEdit = (role) => {
    setFormData(role);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Rol) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Rol }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }

      fetchRoles();
      resetForm();
      setDeleteNotification('Rol eliminado exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Rol: '', Rol: '', Descripcion: '', Estado: '' });
    setIsEditing(false);
  };

  const convertEstado = (estado) => {
    return estado === 1 ? "Activo" : "Inactivo";
  };

  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
       <center> <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Rol' : 'Agregar Rol'}</h2></center>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="Rol"
            placeholder="Nombre del Rol"
            value={formData.Rol}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="Descripcion"
            placeholder="Descripción"
            value={formData.Descripcion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="Estado"
            value={formData.Estado}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona Estado</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
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

      {/* Columna derecha: Tabla de roles */}
      <div className="w-2/3">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-slate-200">
            <tr>
              <th className="py-4 px-6 text-left">Id Rol</th>
              <th className="py-4 px-6 text-left">Rol</th>
              <th className="py-4 px-6 text-left">Descripción</th>
              <th className="py-4 px-6 text-left">Estado</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.Id_Rol} className="border-b hover:bg-gray-100 transition duration-300">
                <td className="py-4 px-6">{role.Id_Rol}</td>
                <td className="py-4 px-6"><strong>{role.Rol}</strong></td>
                <td className="py-4 px-6">{role.Descripcion}</td>
                <td className="py-4 px-6">{convertEstado(role.Estado)}</td>
                <td className="py-4 px-6 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(role)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(role.Id_Rol)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                        ‌ ‌ ‌ ‌X ‌ ‌ ‌ ‌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesManagement;
