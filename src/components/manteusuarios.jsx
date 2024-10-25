import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userStates, setUserStates] = useState([]);
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
  const [visibleDetails, setVisibleDetails] = useState({}); 
  

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchUserStates();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/usuarios'); // Asegúrate de que la API devuelva todos los usuarios
      // Filtrar solo los usuarios activos
      const activeUsers = response.data.filter(user => user.Id_EstadoUsuario === 1);
      setUsers(activeUsers);
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

  const fetchUserStates = async () => {
    try {
      const response = await axios.get('/api/estadousuario');
      setUserStates(response.data);
    } catch (error) {
      console.error('Error fetching user states:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // For the "Usuario" field, enforce uppercase transformation
    if (name === "Usuario") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const currentDate = new Date().toISOString();
        formData.Fecha_Ultima_Conexion = currentDate;

        // Verifica si se está editando o si se está creando un nuevo usuario
        if (isEditing) {
            // Si se está editando, solo hashea la contraseña si se cambió
            if (formData.Contrasena) {
                formData.Contrasena = await bcrypt.hash(formData.Contrasena, 10);
            } else {
                // Eliminar la contraseña del objeto formData si no se ha cambiado
                delete formData.Contrasena;
            }
            const response = await fetch(`/api/usuarios`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error) {
                    throw new Error(errorData.error); // Mostrar el mensaje de error específico
                }
                throw new Error('Error al actualizar el usuario');
            }

            setUpdateNotification('Usuario actualizado exitosamente');
            setTimeout(() => {
                setUpdateNotification('');
            }, 3000);
        } else {
            // Lógica para crear un nuevo usuario
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error) {
                    throw new Error(errorData.error); // Mostrar el mensaje de error específico
                }
                throw new Error('Error al crear el usuario');
            }

            // Solo después de que el usuario se haya creado exitosamente, se puede hashear la contraseña
            formData.Contrasena = await bcrypt.hash(formData.Contrasena, 10);
            setNotification('Usuario agregado exitosamente');
            setTimeout(() => {
                setNotification('');
            }, 3000);
        }

        fetchUsers();
        resetForm();
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        setNotification(error.message);
        setTimeout(() => {
            setNotification('');
        }, 3000);
    }
};
  

const handleEdit = (user) => {
  // Carga los datos del usuario, pero deja la contraseña vacía
  setFormData({
    ...user// Mantén la contraseña vacía
  });
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

  const getRoleNameById = (roleId) => {
    const role = roles.find(r => r.Id_Rol === roleId);
    return role ? role.Rol : 'Desconocido';
  };

  const getUserStateNameById = (stateId) => {
    const state = userStates.find(s => s.Id_EstadoUsuario === stateId);
    return state ? state.Descripcion : 'Desconocido';
  };

  const toggleDetails = (userId) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId] // Alterna la visibilidad del usuario correspondiente
    }));
  };
  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center>
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
          <input
    type="text"
    name="Usuario"
    value={formData.Usuario}
    onChange={handleInputChange}
    required
    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
    placeholder=" "
    style={{ textTransform: 'uppercase' }}
  />
  <label className={`absolute left-1 top-1 transition-all duration-200 transform ${formData.Usuario ? 'text-gray-1200 -translate-y-4 scale-100' : 'text-gray-400'}`}>
    Usuario
  </label>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              name="Nombre_Usuario"
              value={formData.Nombre_Usuario}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label className={`absolute left-1 top-1 transition-all duration-200 transform ${formData.Nombre_Usuario ? 'text-gray-1200 -translate-y-4 scale-100' : 'text-gray-400'}`}>
              Nombre Completo
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type="email"
              name="Correo"
              value={formData.Correo}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label className={`absolute left-1 top-1 transition-all duration-200 transform ${formData.Correo ? 'text-gray-1200 -translate-y-4 scale-100' : 'text-gray-400'}`}>
              Correo Electrónico
            </label>
          </div>

          <div className="relative mb-4">
  <input
    type="password"
    name="Contrasena"
    value={formData.Contrasena}
    onChange={handleInputChange}
    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
    placeholder=" "
    // No es obligatorio si estamos editando
    required={!isEditing}
  />
  <label className={`absolute left-1 top-1 transition-all duration-200 transform ${formData.Contrasena ? 'text-gray-1200 -translate-y-4 scale-100' : 'text-gray-400'}`}>
    Contraseña
  </label>
          </div>

          <label htmlFor="Id_Rol" className="block mb-2 text-sm font-medium text-gray-700">
  Rol
</label>
<select
  name="Id_Rol"
  value={formData.Id_Rol}
  onChange={handleInputChange}
  required
  className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>
<option value="">Selecciona Rol</option>
  {roles
    .filter(role => role.Estado === 1) // Filtra para mostrar solo roles activos
    .map(role => (
      <option key={role.Id_Rol} value={role.Id_Rol}>
        {role.Rol}
      </option>
  ))}
</select>

<label htmlFor="Id_EstadoUsuario" className="block mb-2 text-sm font-medium text-gray-700">
  Estado
</label>
<select
  name="Id_EstadoUsuario"
  value={formData.Id_EstadoUsuario}
  onChange={handleInputChange}
  required
  className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Selecciona Estado</option>
  {userStates.map(state => (
    <option key={state.Id_EstadoUsuario} value={state.Id_EstadoUsuario}>
      {state.Descripcion}
    </option>
  ))}
</select>
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
          {notification && <p className="mt-2 text-green-500">{notification}</p>}
          {updateNotification && <p className="mt-2 text-green-500">{updateNotification}</p>}
          {deleteNotification && <p className="mt-2 text-red-500">{deleteNotification}</p>}
        </form>
      </div>

    {/* Columna derecha: Tabla de Usuarios */}
    <div className="w-2/3">
  <h2 className="text-2xl font-semibold mb-4 text-center">Listado de Usuarios</h2>
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
            {users.map((user) => (
              <React.Fragment key={user.Id_Usuario}>
                <tr className="hover:bg-gray-100">
                <td className="py-4 px-6">{user.Id_Usuario}</td>
                  <td className="border-b border-gray-200 p-2">{user.Usuario}</td>
                  <td className="border-b border-gray-200 p-2">{user.Nombre_Usuario}</td>
                  <td className="border-b border-gray-200 p-2">{user.Correo}</td>
                  <td className="border-b border-gray-200 p-2">{getRoleNameById(user.Id_Rol)}</td>
                  <td className="border-b border-gray-200 p-2">{getUserStateNameById(user.Id_EstadoUsuario)}</td>
                  <td className="border-b border-gray-200 p-2">
                  <td className="border-b border-gray-200 p-2">
  <div className="flex items-center">
    {/* BOTON DE EDITAR */}
    <button 
      onClick={() => handleEdit(user)} 
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
    >
      Editar
    </button>
    {/* BOTON DE VER */}
    <button
      onClick={() => toggleDetails(user.Id_Usuario)}
      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ml-2"
    >
      {visibleDetails[user.Id_Usuario] ? 'Ocultar' : 'Ver'}
    </button>
        {/* BOTON DE ELIMINAR */}
    <button 
      onClick={() => handleDelete(user.Id_Usuario)} 
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
    >
      X
    </button>
  </div>
</td>

                  </td>
                </tr>
                {visibleDetails[user.Id_Usuario] && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="border-b border-gray-200 p-2">
                      <div>
                        <p><strong>Fecha de Última Conexión:</strong> {user.Fecha_Ultima_Conexion}</p>
                        <p><strong>Preguntas Contestadas:</strong> {user.Preguntas_Contestadas}</p>
                        <p><strong>Primer Ingreso:</strong> {user.Primer_Ingreso ? 'Sí' : 'No'}</p>
                        <p><strong>Fecha de Vencimiento:</strong> {user.Fecha_Vencimiento}</p>
                        <p><strong>Creado Por:</strong> {user.Creado_Por}</p>
                        <p><strong>Fecha de Creación:</strong> {user.Fecha_Creacion}</p>
                        <p><strong>Modificado Por:</strong> {user.Modificado_Por}</p>
                        <p><strong>Fecha de Modificación:</strong> {user.Fecha_Modificacion}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

</div>
    </div>
  );
};

export default UsersManagement;
