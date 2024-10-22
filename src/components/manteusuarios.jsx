import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userStates, setUserStates] = useState([]); // Nuevo estado para los estados de usuario
  const [formData, setFormData] = useState({
    Id_Usuario: '',
    Id_Rol: '',
    Id_EstadoUsuario: '',
    Id_Persona: '',
    Usuario: '',
    Nombre_Usuario: '',
    Contrasena: '',
    Fecha_Ultima_Conexion: '',
    Preguntas_Contestadas: '',
    Primer_Ingreso: '',
    Fecha_Vencimiento: '',
    Correo: '',
    Creado_Por: '',
    Fecha_Creacion: '',
    Modificado_Por: '',
    Fecha_Modificacion: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchUserStates(); // Obtener estados de usuario
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  // Nueva función para obtener los estados de usuario
  const fetchUserStates = async () => {
    try {
      const response = await axios.get('/api/estadousuario'); // Asegúrate de que la ruta sea correcta
      setUserStates(response.data);
    } catch (error) {
      console.error('Error fetching user states:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date().toISOString();
      formData.Fecha_Ultima_Conexion = currentDate;

      const hashedPassword = await bcrypt.hash(formData.Contrasena, 10);
      formData.Contrasena = hashedPassword;

      if (isEditing) {
        const response = await fetch(`/api/usuarios`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el usuario');
        }

        setUpdateNotification('Usuario actualizado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el usuario');
        }

        setNotification('Usuario agregado exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Usuario) => {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Usuario }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      fetchUsers();
      resetForm();
      setDeleteNotification('Usuario eliminado exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Usuario: '',
      Id_Rol: '',
      Id_EstadoUsuario: '',
      Id_Persona: '',
      Usuario: '',
      Nombre_Usuario: '',
      Contrasena: '',
      Fecha_Ultima_Conexion: '',
      Preguntas_Contestadas: '',
      Primer_Ingreso: '',
      Fecha_Vencimiento: '',
      Correo: '',
      Creado_Por: '',
      Fecha_Creacion: '',
      Modificado_Por: '',
      Fecha_Modificacion: ''
    });
    setIsEditing(false);
  };

  // Función para obtener el nombre del rol
  const getRoleNameById = (roleId) => {
    const role = roles.find(r => r.Id_Rol === roleId);
    return role ? role.Rol : 'Desconocido';
  };

  // Nueva función para obtener el nombre del estado
  const getUserStateNameById = (stateId) => {
    const state = userStates.find(s => s.Id_EstadoUsuario === stateId);
    return state ? state.Descripcion : 'Desconocido'; // Cambia 'Nombre_Estado' según el nombre de la columna en tu tabla
  };

  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center>
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        </center>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="Usuario"
            placeholder="Nombre de Usuario"
            value={formData.Usuario}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="Nombre_Usuario"
            placeholder="Nombre Completo"
            value={formData.Nombre_Usuario}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="Correo"
            placeholder="Correo Electrónico"
            value={formData.Correo}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="Contrasena"
            placeholder="Contraseña"
            value={formData.Contrasena}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="Id_Rol"
            value={formData.Id_Rol}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona Rol</option>
            {roles.map(role => (
              <option key={role.Id_Rol} value={role.Id_Rol}>
                {role.Rol}
              </option>
            ))}
          </select>
          <select
            name="Id_EstadoUsuario"
            value={formData.Id_EstadoUsuario}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona Estado</option>
            {userStates.map(state => ( // Renderizando estados aquí
              <option key={state.Id_EstadoUsuario} value={state.Id_EstadoUsuario}>
                {state.Descripcion} {/* Cambia 'Nombre_Estado' según tu estructura */}
              </option>
            ))}
          </select>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
              {isEditing ? 'Actualizar' : 'Registrar'}
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
        {notification && <div className="text-green-500 mt-2">{notification}</div>}
        {updateNotification && <div className="text-green-500 mt-2">{updateNotification}</div>}
        {deleteNotification && <div className="text-red-500 mt-2">{deleteNotification}</div>}
      </div>

      {/* Columna derecha: Tabla de Usuarios */}
<div className="w-2/3">
  <h2 className="text-2xl font-semibold mb-4">Lista de Usuarios</h2>
  <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead className="bg-slate-200">
      <tr>
        <th className="py-4 px-6 text-left">ID</th>
        <th className="py-4 px-6 text-left">Usuario</th>
        <th className="py-4 px-6 text-left">Nombre</th>
        <th className="py-4 px-6 text-left">Correo</th>
        <th className="py-4 px-6 text-left">Rol</th>
        <th className="py-4 px-6 text-left">Estado</th>
        <th className="py-4 px-6 text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.Id_Usuario} className="border-b hover:bg-gray-100 transition duration-300">
          <td className="py-4 px-6">{user.Id_Usuario}</td>
          <td className="py-4 px-6"><strong>{user.Usuario}</strong></td>
          <td className="py-4 px-6">{user.Nombre_Usuario}</td>
          <td className="py-4 px-6">{user.Correo}</td>
          <td className="py-4 px-6"><strong>{getRoleNameById(user.Id_Rol)}</strong></td>
          <td className="py-4 px-6">{getUserStateNameById(user.Id_EstadoUsuario)}</td>
          <td className="py-4 px-6 text-center">
          <button 
    onClick={() => handleEdit(user)} 
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
    Editar
</button>
<button 
    onClick={() => handleDelete(user.Id_Usuario)} 
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2" // Añade 'ml-2' para margen izquierdo
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

export default UsersManagement;
