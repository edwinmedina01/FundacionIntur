import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const LineaBeneficioManagement = () => {
  const [beneficios, setBeneficios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    Id_Beneficio: "",
    Nombre_Beneficio: "",
    Tipo_Beneficio: "",
    Monto_Beneficio: "",
    Responsable_Beneficio: "",
    Creado_Por: "",
    Fecha_Creacion: "",
    Modificado_Por: "",
    Fecha_Modificacion: "",
    Estado: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState("");
  const [updateNotification, setUpdateNotification] = useState("");
  const [deleteNotification, setDeleteNotification] = useState("");
  const [visibleDetails, setVisibleDetails] = useState({});
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  {/* Filtros del buscador por Nombre, Tipo, Monto o Responsable */}
const filteredUsers = beneficios.filter(user =>
    user.Nombre_Beneficio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.Tipo_Beneficio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.Monto_Beneficio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.Responsable_Beneficio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(beneficios.length / usersPerPage)) {
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
    fetchBeneficios();
  }, []);

  const fetchBeneficios = async () => {
    try {
      const response = await axios.get("/api/lineabeneficio"); // Asegúrate de que esta URL sea correcta
      setBeneficios(response.data);
    } catch (error) {
      console.error("Error fetching beneficios:", error);
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
    console.log(currentDate);
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
        const response = await fetch(`/api/lineabeneficio`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error) {
            throw new Error(errorData.error); // Mensaje de error específico
          }
          throw new Error("Error al actualizar el beneficio");
        }

        setUpdateNotification("Beneficio actualizado exitosamente");
        setTimeout(() => {
          setUpdateNotification("");
        }, 3000);
      } else {
        // Lógica para crear un nuevo registro
        const response = await fetch("/api/lineabeneficio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error) {
            throw new Error(errorData.error); // Mensaje de error específico
          }
          throw new Error("Error al crear el beneficio");
        }

        setNotification("Beneficio agregado exitosamente");
        setTimeout(() => {
          setNotification("");
        }, 3000);
      }

      fetchBeneficios(); // Actualiza la lista
      resetForm(); // Resetea el formulario
    } catch (error) {
      console.error("Error al guardar el beneficio:", error);
      setNotification(error.message);
      setTimeout(() => {
        setNotification("");
      }, 3000);
    }
  };

  const handleEdit = (beneficio) => {
    setFormData(beneficio);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      Id_Beneficio: "",
      Nombre_Beneficio: "",
      Tipo_Beneficio: "",
      Monto_Beneficio: "",
      Responsable_Beneficio: "",
      Creado_Por: "",
      Fecha_Creacion: "",
      Modificado_Por: "",
      Fecha_Modificacion: "",
      Estado: "",
    });
    setIsEditing(false);
  };
  const handleDelete = async (Id_Beneficio) => {
    try {
      const response = await fetch("/api/lineabeneficio", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id_Beneficio }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el beneficio:");
      }

      fetchBeneficios(); // Actualiza la lista
      resetForm(); // Resetea el formulario
      setDeleteNotification("Beneficio eliminado exitosamente");
      setTimeout(() => {
        setDeleteNotification("");
      }, 3000);
    } catch (error) {
      console.error("Error al eliminar el beneficio", error);
    }
  };

  const toggleDetails = (beneficioId) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [beneficioId]: !prevState[beneficioId],
    }));
  };
  const exportToExcel = () => {
    const exportData = beneficios.map(user => ({
      ID: user.Id_Beneficio,
      Tipo_Beneficio: user.Tipo_Beneficio,
      Nombre: user.Nombre_Beneficio,
      Monto: user.Monto_Beneficio,
      Responsable: user.Responsable_Beneficio,
      // Otros campos que desees incluir
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
            {isEditing ? "Editar Beneficio" : "Agregar Beneficio"}
          </h2>
        </center>
        <form onSubmit={handleSubmit}>
          {/* Campo: Nombre del Beneficio */}
          <div className="relative mb-4">
            <input
              type="text"
              name="Nombre_Beneficio"
              value={formData.Nombre_Beneficio}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Nombre_Beneficio
                  ? "text-gray-1200 -translate-y-4 scale-100"
                  : "text-gray-400"
              }`}
            >
              Nombre del Beneficio
            </label>
          </div>

          {/* Campo: Tipo de Beneficio */}
          <div className="relative mb-4">
            <input
              type="text"
              name="Tipo_Beneficio"
              value={formData.Tipo_Beneficio}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Tipo_Beneficio
                  ? "text-gray-1200 -translate-y-4 scale-100"
                  : "text-gray-400"
              }`}
            >
              Tipo de Beneficio
            </label>
          </div>

          {/* Campo: Monto de Beneficio */}
          <div className="relative mb-4">
            <input
              type="text"
              name="Monto_Beneficio"
              value={formData.Monto_Beneficio}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Monto_Beneficio
                  ? "text-gray-1200 -translate-y-4 scale-100"
                  : "text-gray-400"
              }`}
            >
              Monto del Beneficio
            </label>
          </div>

          {/* Campo: Responsable del Beneficio */}
          <div className="relative mb-4">
            <input
              type="text"
              name="Responsable_Beneficio"
              value={formData.Responsable_Beneficio}
              onChange={handleInputChange}
              required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Responsable_Beneficio
                  ? "text-gray-1200 -translate-y-4 scale-100"
                  : "text-gray-400"
              }`}
            >
              Responsable
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
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Estado
            </label>
          </div>

          {/* Fecha de Creación */}

          {/* Fecha de Modificación */}

          {/* Creado Por */}
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

          {/* Modificado Por */}
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

          {/* Botón de Guardar */}
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
        </form>

        {/* Notificaciones */}
        {notification && (
          <div className="mt-4 text-center text-green-600">{notification}</div>
        )}
        {updateNotification && (
          <div className="mt-4 text-center text-yellow-600">
            {updateNotification}
          </div>
        )}
        {deleteNotification && (
          <div className="mt-4 text-center text-red-600">
            {deleteNotification}
          </div>
        )}
      </div>

      {/* Listado de Beneficios */}
      <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
        <center>
          <h2 className="text-2xl font-semibold mb-4">Beneficios Existentes</h2>
        </center>
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
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Tipo</th>
              <th className="px-4 py-2 border-b">Monto</th>
              <th className="px-4 py-2 border-b">Responsable</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers
              .slice(indexOfFirstUser, indexOfLastUser)
              .map((beneficio) => (
                <React.Fragment key={beneficio.Id_Beneficio}>
                  <tr className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">
                      {beneficio.Nombre_Beneficio}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {beneficio.Tipo_Beneficio}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {beneficio.Monto_Beneficio}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {beneficio.Responsable_Beneficio}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {beneficio.Estado === 1 ? "Activo" : "Inactivo"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center">
                        {/* BOTON DE EDITAR */}
                        <button
                          onClick={() => handleEdit(beneficio)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
                        >
                          Editar
                        </button>
                        {/* BOTON DE VER */}
                        <button
                          onClick={() => toggleDetails(beneficio.Id_Beneficio)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ml-2"
                        >
                          {visibleDetails[beneficio.Id_Beneficio]
                            ? "Ocultar"
                            : "Ver"}
                        </button>
                        {/* BOTON DE ELIMINAR */}
                        <button
                          onClick={() => handleDelete(beneficio.Id_Beneficio)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                        >
                          X
                        </button>
                      </div>
                    </td>
                  </tr>
                  {visibleDetails[beneficio.Id_Beneficio] && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="border-b border-gray-200 p-2">
                        <div>
                          <p>
                            <strong>Fecha de Creación:</strong>{" "}
                            {beneficio.Fecha_Creacion}
                          </p>
                          <p>
                            <strong>Fecha de Modificación:</strong>{" "}
                            {beneficio.Fecha_Modificacion}
                          </p>
                          <p>
                            <strong>Creado Por:</strong> {beneficio.Creado_Por}
                          </p>
                          <p>
                            <strong>Modificado Por:</strong>{" "}
                            {beneficio.Modificado_Por}
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
              { length: Math.ceil(beneficios.length / usersPerPage) },
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

export default LineaBeneficioManagement;
