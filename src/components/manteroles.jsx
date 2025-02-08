import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { useRouter } from 'next/router';
import AuthContext from '../context/AuthContext';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador


const RolesManagement = () => {
const router = useRouter();
  const [roles, setRoles] = useState([]);
// ------------------- FUNCIONALIDAD ROLES----------------------//
  const { user } = useContext(AuthContext); // Usuario logueado
  const [permisos, setPermisos] = useState(null); //obtener permiso
  const [error, setError] = useState(null); //mostrar error de permiso
  const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
// ------------------------------------------------------------//
  const [formData, setFormData] = useState({
    Id_Rol: '',
    Rol: '',
    Descripcion: '',
    Estado: ''
  });
  const [isEditing, setIsEditing] = useState(false);
 const [search, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(5);
 
  useEffect(() => {
    fetchRoles();
    fetchPermisos();
  }, [user]);
 // -------- PERMISOS -------- //
  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 4; // ID del objeto relacionado con esta página
        const response = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto,
        });
  
        const permisosData = response.data;
  
        // Validar si no hay permisos habilitados
        if (
          permisosData.Permiso_Insertar !== '1' &&
          permisosData.Permiso_Actualizar !== '1' &&
          permisosData.Permiso_Eliminar !== '1' &&
          permisosData.Permiso_Consultar !== '1'
        ) {
          setSinPermisos(true);
        } else {
          setPermisos(permisosData);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener permisos');
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

        toast.success('Rol actualizado exitosamente',
          {
            style: {
              backgroundColor: '#e6ffed', // Fondo verde suave
              color: '#2e7d32', // Texto verde oscuro
              fontWeight: 'bold',
              border: '1px solid #a5d6a7', // Borde verde claro
              padding: '16px',
              borderRadius: '12px',
            },
            position: 'top-right', // Posición en la esquina superior derecha
            autoClose: 5000, // Cierra automáticamente en 5 segundos
            hideProgressBar: true, // Ocultar barra de progreso
          }
        );
        
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

        toast.success('Rol agregado exitosamente',
          {
            style: {
              backgroundColor: '#e6ffed', // Fondo verde suave
              color: '#2e7d32', // Texto verde oscuro
              fontWeight: 'bold',
              border: '1px solid #a5d6a7', // Borde verde claro
              padding: '16px',
              borderRadius: '12px',
            },
            position: 'top-right', // Posición en la esquina superior derecha
            autoClose: 5000, // Cierra automáticamente en 5 segundos
            hideProgressBar: true, // Ocultar barra de progreso
          }
        );
        
      }

      fetchRoles();
      resetForm();
    } catch (error) {
      toast.error('Error al guardar el rol:', error);
    }
  };

  const handleEdit = (role) => {
    setFormData(role);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Rol) => {
    try {
      const response = await fetch('api/roles', {
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
      toast.error('Rol eliminado exitosamente', {
        style: {
          backgroundColor: '#ffebee', // Fondo suave rojo
          color: '#d32f2f', // Texto rojo oscuro
          fontWeight: 'bold',
          border: '1px solid #f5c6cb',
          padding: '16px',
          borderRadius: '12px',
        },
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } catch (error) {
      toast.error('Error al eliminar el rol:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Rol: '', Rol: '', Descripcion: '', Estado: '' });
    setIsEditing(false);
  };

  const convertEstado = (estado) => {
    return estado === 1 ? "Activo" : "Inactivo";
  };

 // Filtros por búsqueda
 const filteredRoles = roles.filter(role =>
  role.Rol.toLowerCase().includes(search.toLowerCase()) ||
  role.Descripcion.toLowerCase().includes(search.toLowerCase())
);

  // Paginación
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  // // Función para exportar a Excel usando XLSX
  // const handleExport = () => {
  //   // Transformar los datos para exportación
  //   const transformedRoles = filteredRoles.map(role => ({
  //     Id_Rol: role.Id_Rol,
  //     Rol: role.Rol,
  //     Descripcion: role.Descripcion,
  //     Estado: convertEstado(role.Estado), // Convertir estado
  //   }));
  
  //   // Crear un nuevo libro de Excel
  //   const worksheet = XLSX.utils.json_to_sheet(transformedRoles);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
  
  //   // Generar archivo Excel
  //   XLSX.writeFile(workbook, "roles.xlsx");
  // };

const handleExport = async () => {
  // 1️⃣ Crear un nuevo libro y hoja de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Roles");

  // 2️⃣ Definir las columnas y encabezados
  worksheet.columns = [
    { header: "ID Rol", key: "Id_Rol", width: 10 },
    { header: "Rol", key: "Rol", width: 25 },
    { header: "Descripción", key: "Descripcion", width: 40 },
    { header: "Estado", key: "Estado", width: 15 },
  ];

  // 3️⃣ Transformar los datos para exportación
  const transformedRoles = filteredRoles.map((role) => ({
    Id_Rol: role.Id_Rol,
    Rol: role.Rol,
    Descripcion: role.Descripcion,
    Estado: convertEstado(role.Estado), // Convertir estado
  }));

  // 4️⃣ Agregar los datos a la hoja de cálculo
  transformedRoles.forEach((data) => {
    worksheet.addRow(data);
  });

  // 5️⃣ Aplicar estilos a los encabezados
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
  });

  // 6️⃣ Generar el archivo y descargarlo
  const buffer = await workbook.xlsx.writeBuffer();
  const fileBlob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(fileBlob, "roles.xlsx");
};


// Renderizado
if (!user) {
  return <p>Cargando usuario...</p>;
}

if (error) {
  return <p>{error}</p>;
}

if (sinPermisos) {
  return         <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
  <ShieldExclamationIcon className="h-12 w-12 mr-4" />
  <div>
    <h3 className="font-bold text-lg">
      Sin permisos para Acceder a la Pantalla de Roles
    </h3>
    <p>No tienes permisos para Acceder a la información.</p>
  </div>
</div>
}

if (!permisos) {
  return <p>Cargando permisos...</p>;
}

  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8 items-center">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md items-center">
       <center> <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Rol' : 'Agregar Rol'}</h2></center>
        <form onSubmit={handleSubmit}>
        <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-700">
  Nombre del Rol
</label>
          <input
            type="text"
            name="Rol"
            placeholder="Nombre del Rol"
            value={formData.Rol}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                              <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-700">
  Descripcion
</label>
          <input
            type="text"
            name="Descripcion"
            placeholder="Descripción"
            value={formData.Descripcion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                    <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-700">
  Estado
</label>
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
          {isEditing
              ? // Mostrar botón "Actualizar" solo si tiene permisos de actualización
                permisos.Permiso_Actualizar === "1" && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Actualizar
                  </button>
                )
              : // Mostrar botón "Agregar" solo si tiene permisos de inserción
                permisos.Permiso_Insertar === "1" && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Agregar
                  </button>
                )}

            <button
              type="button"
              onClick={resetForm}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancelar
            </button>
          </div>
        </form>
</div>

      {/* Columna derecha: Tabla de roles */}
      <div className="w-2/3">
 {/*Barra de busqueda */}
 
 <center><input
  type="text"
  value={search}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="p-3 pl-10 pr-4 border border-gray-900 rounded-lg w-1/2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
  placeholder="Buscar..."
/></center>
<br></br>
<div className="flex justify-end space-x-4 mb-4">
<div className="flex justify-end space-x-4 mb-4">
  {/* Botón para exportar */}
  <button
    onClick={handleExport}
    className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-900 transition duration-200"
  ><strong>
    Exportar a Excel
  </strong></button>
    {/* Botón para ir a asignar permisos */}
    <button
    onClick={() => router.push('/permisos')}
    className="bg-cyan-900 text-white px-3 py-1 rounded hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
    ><strong>
    Asignar Permisos
  </strong></button>
</div>
</div>

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
          {permisos?.Permiso_Consultar === "1" && (
          <tbody>
            {currentRoles.map((role) => (
              <tr key={role.Id_Rol} className="border-b hover:bg-gray-100 transition duration-300">
                <td className="py-4 px-6">{role.Id_Rol}</td>
                <td className="py-4 px-6"><strong>{role.Rol}</strong></td>
                <td className="py-4 px-6">{role.Descripcion}</td>
                <td className="py-4 px-6">{convertEstado(role.Estado)}</td>
                <td className="py-4 px-6 flex justify-center space-x-2">
                  
                <div className="flex items-center space-x-2">
               {/*Agregar la condicional para verificar si tiene permiso*/}
               {permisos.Permiso_Actualizar === "1" && (
                    <button
                      onClick={() => handleEdit(role)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  )}
                   {/*Agregar la condicional para verificar si tiene permiso*/}
                  {permisos.Permiso_Eliminar === "1" && (
                    <button
                      onClick={() => handleDelete(role.Id_Rol)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      X
                    </button>
                  )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>)}
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

export default RolesManagement;
