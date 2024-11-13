import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userStates, setUserStates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({

    Id_Tipo_Persona:'',
    Tipo_Persona:'',
    Descripcion:'',
    Creado_Por:'',
    Fecha_Creacion:'',
    Modificado_Por:'',
    Fecha_Modificacion:'',
    Estado:''

  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');
  const [visibleDetails, setVisibleDetails] = useState({}); 
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  {/* Filtros del buscador */}
  const filteredUsers = users.filter(user =>
    user.Tipo_Persona.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.Descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
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
    const currentDate = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    let dataToSubmit = { ...formData };
    // Si no estamos editando, asignamos la fecha de creación
    if (!isEditing) {
      dataToSubmit.Fecha_Creacion = currentDate;
      dataToSubmit.Fecha_Modificacion = ""; // No se debe asignar nada a Fecha_Modificacion
    } else {
      // Si estamos editando, asignamos la fecha de modificación
      dataToSubmit.Fecha_Creacion = ""; // No se debe asignar nada a Fecha_Creacion
      dataToSubmit.Fecha_Modificacion = currentDate;
    }
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
      Id_Tipo_Persona: '',
      Tipo_Persona: '',
      Descripcion: '',
      Creado_Por: '',
      Fecha_Creacion: '',
      Modificado_Por: '',
      Fecha_Modificacion: '',
      Estado: ''
    });
    setIsEditing(false);
  };
  const handleDelete = async (Id_Tipo_Persona) => {
    try {
      const response = await fetch('/api/tutorpadre', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Tipo_Persona }),
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
  const exportToExcel = () => {
    const exportData = users.map(user => ({
      ID: user.Id_Tipo_Persona,
      Tipo_Persona: user.Tipo_Persona,
      Descripcion: user.Descripcion,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
    XLSX.writeFile(workbook, 'Linea_Beneficio.xlsx');
  };
  
  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center>
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Editar Tipo de Persona" : "Agregar Tipo de Persona"}
          </h2>
        </center>
        <form onSubmit={handleSubmit}>
          {/* Campo: Tipo Persona */}
          <div className="relative mb-4">
            <input
              type="text"
              name="Tipo_Persona"
              value={formData.Tipo_Persona}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Tipo_Persona
                  ? "text-gray-1200 -translate-y-4 scale-100"
                  : "text-gray-400"
              }`}
            >
              Tipo Persona
            </label>
          </div>

          {/* Campo: Descripción */}
          <div className="relative mb-4">
            <input
              type="text"
              name="Descripcion"
              value={formData.Descripcion}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Descripcion
                  ? "text-gray-1200 -translate-y-4 scale-100"
                  : "text-gray-400"
              }`}
            >
              Descripción
            </label>
          </div>

          {/* Campo: Estado */}
          <div className="relative mb-4">
            <select
              name="Estado"
              value={formData.Estado}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione Estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Estado
            </label>
          </div>

          {/* Campo: Fecha de Creación */}
       
          {/* Campo: Fecha de Modificación */}
          

          {/* Campo: Creado Por */}
          <div className="relative mb-4">
            <input
              type="text"
              name="Creado_Por"
              value={formData.Creado_Por}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Creado_Por
                  ? "text-gray-1200 -translate-y-4 scale-100"
                  : "text-gray-400"
              }`}
            >
              Creado Por
            </label>
          </div>

          {/* Campo: Modificado Por */}
          <div className="relative mb-4">
            <input
              type="text"
              name="Modificado_Por"
              value={formData.Modificado_Por}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Modificado_Por
                  ? "text-gray-1200 -translate-y-4 scale-100"
                  : "text-gray-400"
              }`}
            >
              Modificado Por
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
          Listado de tipos de personas
        </h2>
        <div className="mb-4">
          {/*Barra de busqueda */}
          <center>
            {" "}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 pl-10 pr-4 border border-gray-900 rounded-lg w-1/2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Buscar por nombre o correo"
            />
          </center>

          {/* Botón para exportar */}
          <button
            onClick={exportToExcel}
            className="mb-4 bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-900 transition duration-200"
          >
            Exportar a Excel
          </button>
        </div>
        <table className="min-w-full table-auto">
          <thead className="bg-slate-200">
            <tr>
              <th className="py-4 px-6 text-center">ID Tipo persona</th>
              <th className="py-4 px-6 text-center">Tipo persona</th>
              <th className="py-4 px-6 text-center">Descripcion</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers
              .slice(indexOfFirstUser, indexOfLastUser)
              .map((user) => (
                <React.Fragment key={user.Id_Tipo_Persona}>
                  <tr className="hover:bg-gray-100">
                    <td className="py-4 px-6">{user.Id_Tipo_Persona}</td>
                    <td className="border-b border-gray-200 p-2">
                      {user.Tipo_Persona}
                    </td>
                    <td className="border-b border-gray-200 p-2">
                      {user.Descripcion}
                    </td>
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
                          onClick={() => toggleDetails(user.Id_Tipo_Persona)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ml-2"
                        >
                          {visibleDetails[user.Id_Tipo_Persona]
                            ? "Ocultar"
                            : "Ver"}
                        </button>
                        {/* BOTON DE ELIMINAR */}
                        <button
                          onClick={() => handleDelete(user.Id_Tipo_Persona)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                        >
                          X
                        </button>
                      </div>
                    </td>
                  </tr>
                  {visibleDetails[user.Id_Tipo_Persona] && (
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="border-b border-gray-200 p-2">
                        <div>
                          <p>
                            <strong>Creado Por:</strong> {user.Creado_Por}
                          </p>
                          <p>
                            <strong>Fecha de Creación:</strong>{" "}
                            {user.Fecha_Creacion}
                          </p>
                          <p>
                            <strong>Modificado Por:</strong>{" "}
                            {user.Modificado_Por}
                          </p>
                          <p>
                            <strong>Fecha de Modificación:</strong>{" "}
                            {user.Fecha_Modificacion}
                          </p>
                          <p>
                            <strong>Estado:</strong> {user.Estado}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={prevPage}
            className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
          >
            Anterior
          </button>

          {/* Páginas */}
          <div className="flex space-x-2">
            {Array.from(
              { length: Math.ceil(users.length / usersPerPage) },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
                    currentPage === index + 1
                      ? "bg-white-600 text-black shadow-lg scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
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

export default UsersManagement;
