import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userStates, setUserStates] = useState([]);
  const [formData, setFormData] = useState({

    Id_TutorPadre:'',
    Id_Persona:'',
    RNE:'',
    Nombre_Completo:'',
    Sexo:'',
    Domicilio:'',
    Telefono:''

  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');
  const [visibleDetails, setVisibleDetails] = useState({}); 
  

  useEffect(() => {
    fetchUsers();
    console.log('Estado de users:', users);
    fetchRoles();
  }, []);

 const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/tutorpadre'); // Cambiar la ruta si es necesario
    setUsers(response.data); // Simplemente asignar todos los datos
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
      // Verifica si se está editando o creando un nuevo registro de tutor/padre
      if (isEditing) {
        // Lógica para actualizar un tutor/padre existente
        const response = await fetch(`/api/tutorpadre`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error) {
            throw new Error(errorData.error); // Mensaje de error específico
          }
          throw new Error('Error al actualizar el tutor/padre');
        }
  
        setUpdateNotification('Tutor/Padre actualizado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        // Lógica para crear un nuevo registro de tutor/padre
        const response = await fetch('/api/tutorpadre', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error) {
            throw new Error(errorData.error); // Mensaje de error específico
          }
          throw new Error('Error al crear el tutor/padre');
        }
  
        setNotification('Tutor/Padre agregado exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }
  
      fetchUsers(); // Actualiza la lista
      resetForm(); // Resetea el formulario
    } catch (error) {
      console.error('Error al guardar el tutor/padre:', error);
      setNotification(error.message);
      setTimeout(() => {
        setNotification('');
      }, 3000);
    }
  };
  const handleEdit = (user) => {
    // Carga los datos del usuario, pero deja la contraseña vacía
    setFormData({
      ...user,
      Contrasena: ('')// Mantén la contraseña vacía
    });
    setIsEditing(true);
  };
  const resetForm = () => {
    setFormData({
      Id_TutorPadre: '',
      Id_Persona: '',
      RNE: '',
      Nombre_Completo: '',
      Sexo: '',
      Domicilio: '',
      Telefono: ''
    });
    setIsEditing(false);
  };
  const handleDelete = async (Id_TutorPadre) => {
    try {
      const response = await fetch('/api/tutorpadre', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_TutorPadre }),
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el tutor/padre');
      }
  
      fetchUsers(); // Actualiza la lista
      resetForm(); // Resetea el formulario
      setDeleteNotification('Tutor/Padre eliminado exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el tutor/padre:', error);
    }
  };
    

  const toggleDetails = (userId) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId] // Alterna la visibilidad del usuario correspondiente
    }));
  };
  
  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
      <center>
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Editar Tutor/Padre" : "Agregar Tutor/Padre"}
        </h2>
      </center>
      <form onSubmit={handleSubmit}>

        {/* Campo: Id_Persona */}
        <div className="relative mb-4">
          <input
            type="text"
            name="Id_Persona"
            value={formData.Id_Persona}
            onChange={handleInputChange}
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
            placeholder=" "
          />
          <label
            className={`absolute left-1 top-1 transition-all duration-200 transform ${
              formData.Id_Persona ? "text-gray-1200 -translate-y-4 scale-100" : "text-gray-400"
            }`}
          >
            ID Persona
          </label>
        </div>

        {/* Campo: RNE */}
        <div className="relative mb-4">
          <input
            type="text"
            name="RNE"
            value={formData.RNE}
            onChange={handleInputChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
            placeholder=" "
          />
          <label
            className={`absolute left-1 top-1 transition-all duration-200 transform ${
              formData.RNE ? "text-gray-1200 -translate-y-4 scale-100" : "text-gray-400"
            }`}
          >
            RNE
          </label>
        </div>

        {/* Campo: Nombre Completo */}
        <div className="relative mb-4">
          <input
            type="text"
            name="Nombre_Completo"
            value={formData.Nombre_Completo}
            onChange={handleInputChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
            placeholder=" "
          />
          <label
            className={`absolute left-1 top-1 transition-all duration-200 transform ${
              formData.Nombre_Completo ? "text-gray-1200 -translate-y-4 scale-100" : "text-gray-400"
            }`}
          >
            Nombre Completo
          </label>
        </div>

        {/* Campo: Sexo */}
        <div className="relative mb-4">
          <select
            name="Sexo"
            value={formData.Sexo}
            onChange={handleInputChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          <label className="block mb-2 text-sm font-medium text-gray-700">Sexo</label>
        </div>

        {/* Campo: Domicilio */}
        <div className="relative mb-4">
          <input
            type="text"
            name="Domicilio"
            value={formData.Domicilio}
            onChange={handleInputChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
            placeholder=" "
          />
          <label
            className={`absolute left-1 top-1 transition-all duration-200 transform ${
              formData.Domicilio ? "text-gray-1200 -translate-y-4 scale-100" : "text-gray-400"
            }`}
          >
            Domicilio
          </label>
        </div>

        {/* Campo: Teléfono */}
        <div className="relative mb-4">
          <input
            type="text"
            name="Telefono"
            value={formData.Telefono}
            onChange={handleInputChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
            placeholder=" "
          />
          <label
            className={`absolute left-1 top-1 transition-all duration-200 transform ${
              formData.Telefono ? "text-gray-1200 -translate-y-4 scale-100" : "text-gray-400"
            }`}
          >
            Teléfono
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          {isEditing ? "Actualizar" : "Registrar"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cancelar
        </button>
        {notification && (
            <p className="mt-2 text-green-500">{notification}</p>
          )}
          {updateNotification && (
            <p className="mt-2 text-green-500">{updateNotification}</p>
          )}
          {deleteNotification && (
            <p className="mt-2 text-red-500">{deleteNotification}</p>
          )}
      </form>
    </div>
      {/* Columna derecha: Tabla de Usuarios */}
      <div className="w-2/3">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Listado de tutores
        </h2>
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-slate-200">
            <tr>
              <th className="py-4 px-6 text-center">ID Tutor</th>
              <th className="py-4 px-6 text-center">ID Persona</th>
              <th className="py-4 px-6 text-center">R.N.E</th>
              <th className="py-4 px-6 text-center">Nombre Completo</th>
              <th className="py-4 px-6 text-center">Sexo</th>
              <th className="py-4 px-6 text-center">Domicilio</th>
              <th className="py-4 px-6 text-center">Telefono</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>  
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.Id_TutorPadre}>
                <tr className="hover:bg-gray-100">
                  <td className="py-4 px-6">{user.Id_TutorPadre}</td>
                  <td className="border-b border-gray-200 p-2">
                    {user.Id_Persona}
                  </td>
                  <td className="border-b border-gray-200 p-2">
                    {user.RNE}
                  </td>
                  <td className="border-b border-gray-200 p-2">
                    {user.Nombre_Completo}
                  </td>
                  <td className="border-b border-gray-200 p-2">
                    {user.Sexo}
                  </td>
                  <td className="border-b border-gray-200 p-2">
                    {user.Domicilio}
                  </td>
                  <td className="border-b border-gray-200 p-2">
                    {user.Telefono}
                  </td>
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
                          onClick={() => toggleDetails(user.Id_TutorPadre)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ml-2"
                        >
                          {visibleDetails[user.Id_TutorPadre] ? "Ocultar" : "Ver"}
                        </button>
                        {/* BOTON DE ELIMINAR */}
                        <button
                          onClick={() => handleDelete(user.Id_TutorPadre)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                        >
                          X
                        </button>
                      </div>
                    </td>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;
