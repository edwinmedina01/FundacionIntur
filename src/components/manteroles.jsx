import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { useRouter } from 'next/router';
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import useModal from "../hooks/useModal";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador
import { ShieldExclamationIcon,MagnifyingGlassIcon,UserPlusIcon,ArrowDownCircleIcon,PencilSquareIcon  } from '@heroicons/react/24/outline';
import { validarFormulario } from "../utils/validaciones";
import { reglasValidacionRoles } from "../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import { deepSearch } from '../utils/deepSearch';
import { exportToExcel  } from '../utils/exportToExcel';
import SearchBar from "./basicos/SearchBar"; 
import Pagination from "../components/basicos/Pagination"; 

const RolesManagement = () => {
const router = useRouter();
  const [roles, setRoles] = useState([]);
// ------------------- FUNCIONALIDAD ROLES----------------------//
  const { user } = useContext(AuthContext); // Usuario logueado
  const [permisos, setPermisos] = useState(null); //obtener permiso
  const [error, setError] = useState(null); //mostrar error de permiso
  const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
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

   const [rolesPerPage, setRolesPerPage] = useState(10); // Valor inicial
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
      const token = localStorage.getItem("token"); // 🔑 Obtener el token del usuario autenticado
  
      if (!token) {
        console.error("🚨 No hay token disponible. No se puede obtener la lista de roles.");
        return;
      }
  
      const response = await axios.get('/api/apis_mantenimientos/roles', {
        headers: {
          Authorization: `Bearer ${token}`, // 🛡️ Enviar el token en la cabecera
        },
      });
  
      setRoles(response.data); // 📌 Guardar los roles en el estado
    } catch (error) {
      console.error('❌ Error al obtener los roles:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("🚨 No autorizado: Token inválido o expirado.");
        // Opcional: Redirigir al login o mostrar alerta
      }
    }
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClearSearch = () => {
  setSearchQuery("");
  setCurrentPage(1); // Reiniciar a la primera página
}; 

const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // 🔑 Obtener el token del usuario autenticado
  
    if (!token) {
      console.error("🚨 No hay token disponible. No se puede obtener la lista de roles.");
      return;
    }

    
    formData.Creado_Por=user.id;
    formData.Modificado_Por=user.id;
   const errores = validarFormulario(formData, reglasValidacionRoles);

      if (errores.length > 0) {
     
      //toast.error(errores.join("\n"), error);
        return;
      }

    try {
      if (isEditing) {

        
 
        const response = await fetch(`/api/roles`, {
   
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 🛡️ Enviar el token en la cabecera
          },
          body: JSON.stringify(formData),
        });

       // Verificar si la respuesta NO es exitosa (código 400 o 500)
       if (!response.ok) {
        // Intentar leer el JSON de la respuesta del servidor
        const errorData = await response.json(); 

        // Mostrar el mensaje de error si existe en la respuesta
        toast.error('Error: ' + (errorData.error || 'Ocurrió un error desconocido'));

        
        return;
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
            Authorization: `Bearer ${token}`, // 🛡️ Enviar el token en la cabecera
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          console.log(response)
        // Intentar leer el JSON de la respuesta del servidor
      const errorData = await response.json(); 
      
      // Si el servidor devuelve un error con un código diferente a 200
      if (response.status === 404) {
        // Error específico para rol no encontrado
        toast.error('Error: ' + (errorData.error || 'Rol no encontrado'));
      } else if (response.status === 400) {
        // Error para rol duplicado
        toast.error('Error: ' + (errorData.error || 'El nombre del rol ya existe'));
      } else {
        toast.error('Error: ' + (errorData.error || 'Ocurrió un error desconocido'));
      }
      return;
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
      closeModal("modalAddRol")
    } catch (error) {
     // toast.error('Error al guardar el rol:', error);
     console.log(error)
         // Captura cualquier otro error no relacionado con el status del fetch
  
  toast.error('Error al guardar el rol: ' + error.message);
    }
  };

  const handleEdit = (role) => {
    setFormData(role);
    setIsEditing(true);
    showModal("modalAddRol")
    
  };

  const handleDelete = async (Id_Rol) => {
    try {
      const token = localStorage.getItem("token"); // 🔑 Obtener el token del usuario autenticado
  
      if (!token) {
        console.error("🚨 No hay token disponible. No se puede obtener la lista de roles.");
        return;
      }
  
      const response = await fetch('api/roles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 🛡️ Enviar el token en la cabecera
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

      closeModal("modalConfirmacion")
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

//  // Filtros por búsqueda
//  const filteredRoles = roles.filter(role =>
//   role.Rol.toLowerCase().includes(search.toLowerCase()) ||
//   role.Descripcion.toLowerCase().includes(search.toLowerCase())
// );

  
    const filteredRoles = roles.filter((user) => deepSearch(user, search, 0, 3));
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

const handleExportOld = async () => {
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


const handleExport = async () => {
    const headers = [
        { header: "ID Rol", key: "Id_Rol", width: 10 },
        { header: "Rol", key: "Rol", width: 25 },
        { header: "Descripción", key: "Descripcion", width: 40 },
        { header: "Estado", key: "Estado", width: 15 },
    ];

    const data = filteredRoles.map((role) => ({
        Id_Rol: role.Id_Rol,
        Rol: role.Rol,
        Descripcion: role.Descripcion,
        Estado: convertEstado(role.Estado),
    }));

    await exportToExcel({
        fileName: "Roles.xlsx",
        title: "Reporte de Roles",
        headers,
        data,
        searchQuery: search,
    });
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
    <div>
      {/* Columna izquierda: Formulario */}
      <ModalGenerico
        id="modalAddRol"
        isOpen={modals["modalAddRol"]}
        onClose={() => closeModal("modalAddRol")}
        titulo=  {isEditing ? "Editar Rol" : "Agregar Rol"}
      >
         
      <div className="w-3/3 bg-white p-6 rounded-lg shadow-md items-center">

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
              onClick={() => {
                resetForm();
                closeModal("modalAddRol");
              }}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancelar
            </button>
          </div>
        </form>

        </div>
        </ModalGenerico>

      {/* Columna derecha: Tabla de roles */}
      <div>
 {/*Barra de busqueda */}

 <SearchBar
  title="Listado de Roles"
  searchQuery={search}
  setSearchQuery={setSearchQuery}
  handleClearSearch={handleClearSearch}
  onAdd={() => {
    resetForm();
    showModal("modalAddRol");
  }}
  onExport={handleExport} // Exportar sin parámetros
/>

  <ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Rol)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Rol}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>



<table className="xls_style-excel-table">
<thead className="bg-slate-200">
            <tr>
              <th className>Id Rol</th>
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
                  
                      onClick={() => {
                       setFormData(role)
                        showModal("modalConfirmacion");
                      }}
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

<Pagination
  currentPage={currentPage}
  totalItems={filteredRoles.length}
  itemsPerPage={rolesPerPage}
  setPage={setCurrentPage} // Actualiza el número de página
  setItemsPerPage={setRolesPerPage} // Cambia la cantidad de elementos por página
  prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} // Navega a la página anterior, sin que el número de página sea menor a 1
  nextPage={() =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredRoles.length / rolesPerPage)) // Navega a la página siguiente, sin que exceda el total de páginas
    )
  }
/>


      </div>
    </div>
  );
};

export default RolesManagement;
