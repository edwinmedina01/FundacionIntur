import React, { useState, useEffect, useContext,useCallback } from 'react';
import axios from 'axios';
//import * as XLSX from 'xlsx';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador

import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import useModal from "../hooks/useModal";
import { validarFormulario } from "../utils/validaciones";
import { reglasValidacionPermisos } from "../../models/Permiso"; // Importamos las reglas del modelo
import { ShieldExclamationIcon,MagnifyingGlassIcon,UserPlusIcon,ArrowDownCircleIcon,PencilSquareIcon  } from '@heroicons/react/24/outline';
import { obtenerEstados } from "../utils/api"; // Importar la función
import { exportToExcel  } from '../utils/exportToExcel';
import Pagination from "../components/basicos/Pagination"; 
import SearchBar from "../components/basicos/SearchBar"; 
import { deepSearch  } from '../utils/deepSearch';



const PermissionsManagement = () => {
    const [estados, setEstados] = useState([]);
  
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [objects, setObjects] = useState([]); // Nuevo estado para los objetos
    // ------------------- FUNCIONALIDAD ROLES----------------------//
    const { user } = useContext(AuthContext); // Usuario logueado
    const [permisos, setPermisos] = useState(null); //obtener permiso
    const [error, setError] = useState(null); //mostrar error de permiso
    const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
  // ------------------------------------------------------------//
  
  const [formData, setFormData] = useState({
    Id_Permiso: '',
    Id_Rol: '',
    Creado_Por: '', 
    Modificado_Por:'',
    // Añadir el Id_Objeto en el estado
    Permiso_Insertar: false,
    Permiso_Actualizar: false,
    Permiso_Eliminar: false,
    Permiso_Consultar: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  
 // Paginación
 const [currentPage, setCurrentPage] = useState(1);

    const [perPage, setPermissionsPerPage] = useState(10); // Valor inicial

   const [searchTerm, setSearchTerm] = useState({
     general: "",
 
   });
   
  useEffect(() => {
    setCurrentPage(1); // Reinicia la página cuando se actualiza el filtro
  }, [searchTerm]);

  const cargarEstados = useCallback(async () => {
  //  setLoading(true);
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  //  setLoading(false);
}, []); // 🔥 Se ejecu


  useEffect(() => {
    cargarEstados();
    fetchPermissions();
    fetchRoles();
    fetchObjects(); // Llama a la función para obtener objetos
    fetchPermisos();
  }, [user]);
// -------- PERMISOS -------- //
const fetchPermisos = async () => {
  try {
    if (user) {
      const idObjeto = 2; // ID del objeto relacionado con esta página
      const response = await axios.post('/api/api_permiso', {
        idRol: user.rol,
        idObjeto,
      });

      const permisosData = response.data;
      console.log("fetchPermisos")
      console.log(permisosData)

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
    else{
    console.log(user)
    }
  } catch (err) {
    setError(err.response?.data?.error || 'Error al obtener permisos');
  }
};
  const handleSearchold = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se hace búsqueda
  };

  const handleSearch = (e) => {
    const { name, value } = e.target;
    setSearchTerm((prev) => ({
      ...prev,
      [name]: value, // Actualiza el estado con el nombre del filtro
    }));
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
      const token = localStorage.getItem("token"); // 🔑 Obtener el token del usuario autenticado
  
      if (!token) {
        console.error("🚨 No hay token disponible. No se puede obtener la lista de roles.");
        return;
      }
  
      const response = await axios.get('/api/roles', {
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
  }
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


  const handleClearSearch = () => {
    setSearchTerm({
      general: "",
      Usuario: "",
      Id_EstadoUsuario: "",
      Created: "",
    });
    setCurrentPage(1); // Reiniciar a la primera página
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
   formData.Creado_Por=user.id;
    formData.Modificado_Por=user.id;
    formData.Estado=Number(formData.Estado);
  const errores = validarFormulario(formData, reglasValidacionPermisos);
  

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
        // Intentar leer el JSON de la respuesta del servidor
        const errorData = await response.json(); 

        // Mostrar el mensaje de error si existe en la respuesta
        toast.error('Error: ' + (errorData.error || 'Ocurrió un error desconocido'));
        return;
    }

    toast.success(`Permiso ${isEditing ? 'actualizado' : 'agregado'} exitosamente`,
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
    

    fetchPermissions();
    resetForm();
    closeModal("modalAddPermiso")
  } catch (error) {
    toast.error('Error al guardar el permiso:', error);
  }
};

  const handleEdit = (permission) => {
    setFormData({
      ...permission,
      Permiso_Insertar: permission.Permiso_Insertar === '1',
      Permiso_Actualizar: permission.Permiso_Actualizar === '1',
      Permiso_Eliminar: permission.Permiso_Eliminar === '1',
      Permiso_Consultar: permission.Permiso_Consultar === '1',
      Estado: permission.Estado?.toString() || "", // <- Asegura que sea string
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
      toast.error('Permiso eliminado exitosamente', {
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
  const roleMatches = roleName && roleName.toLowerCase().includes(searchTerm.general.toLowerCase());

  // Obtén el nombre del objeto usando el Id_Objeto y verifica si es una cadena antes de usar toLowerCase()
  const objectName = objectMap[permission.Id_Objeto] || '';  // Obtén el nombre del objeto
  const objectMatches = objectName && objectName.toLowerCase().includes(searchTerm.general.toLowerCase());

 // Verificar también si el término de búsqueda coincide con los valores booleanos
 const permisoConsultar = permission.Permiso_Consultar === "1" ? "Sí" : "No";
 const permisoInsertar = permission.Permiso_Insertar === "1" ? "Sí" : "No";
 const permisoActualizar = permission.Permiso_Actualizar === "1" ? "Sí" : "No";
 const permisoEliminar = permission.Permiso_Eliminar === "1" ? "Sí" : "No";

 // Si el término de búsqueda es "Sí" o "No" y coincide con alguno de los permisos
 const booleanMatches = [permisoConsultar, permisoInsertar, permisoActualizar, permisoEliminar].some(val =>
   val.toLowerCase().includes(searchTerm.general.toLowerCase())
 );

  return roleMatches || objectMatches || booleanMatches;
});
 
  //  const filteredPermissions = permissions.filter((user) => deepSearch(user, searchTerm, 0, 3));
  
  const filteredPermissions2 = permissions.filter((permission) => {
    return deepSearch(permission, searchTerm, 0, 3); // Filtra los permisos con base en los términos de búsqueda
  });
  

const totalPages = Math.ceil(filteredPermissions.length / perPage);
const currentPermissions = filteredPermissions.slice((currentPage - 1) * perPage, currentPage * perPage);

const paginate = (pageNumber) => {
  if (pageNumber > 0 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};

// Exportación a Excel
// const exportToExcel = () => {
//   const transformedPermissions = permissions.map(permission => ({
//     ...permission,
//     Rol: roleMap[permission.Id_Rol] || 'Desconocido', // Mapea el Id_Rol a su nombre
//     Objeto: objectMap[permission.Id_Objeto] || 'Desconocido', // Mapea el Id_Objeto a su nombre
//     Permiso_Consultar: permission.Permiso_Consultar === '1' ? 'Sí' : 'No',
//     Permiso_Insertar: permission.Permiso_Insertar === '1' ? 'Sí' : 'No',
//     Permiso_Actualizar: permission.Permiso_Actualizar === '1' ? 'Sí' : 'No',
//     Permiso_Eliminar: permission.Permiso_Eliminar === '1' ? 'Sí' : 'No',
//   }));

//   const ws = XLSX.utils.json_to_sheet(transformedPermissions);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Permisos");
//   XLSX.writeFile(wb, "permisos.xlsx");
// };



const exportToExcelold = async () => {
  // 1️⃣ Crear un nuevo libro de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Permisos");

  // 2️⃣ Definir encabezados de las columnas
  worksheet.columns = [
   
    { header: "Rol", key: "Rol", width: 25 },
    { header: "ID Objeto", key: "Id_Objeto", width: 15 },
    { header: "Objeto", key: "Objeto", width: 25 },
    { header: "Consultar", key: "Permiso_Consultar", width: 15 },
    { header: "Insertar", key: "Permiso_Insertar", width: 15 },
    { header: "Actualizar", key: "Permiso_Actualizar", width: 15 },
    { header: "Eliminar", key: "Permiso_Eliminar", width: 15 },
  ];

  // 3️⃣ Transformar los datos para el Excel
  const transformedPermissions = permissions.map(permission => ({
  
    Rol: roleMap[permission.Id_Rol] || "Desconocido",
    Id_Objeto: permission.Id_Objeto,
    Objeto: objectMap[permission.Id_Objeto] || "Desconocido",
    Permiso_Consultar: permission.Permiso_Consultar === "1" ? "Sí" : "No",
    Permiso_Insertar: permission.Permiso_Insertar === "1" ? "Sí" : "No",
    Permiso_Actualizar: permission.Permiso_Actualizar === "1" ? "Sí" : "No",
    Permiso_Eliminar: permission.Permiso_Eliminar === "1" ? "Sí" : "No",
  }));

  // 4️⃣ Agregar los datos a la hoja de cálculo
  transformedPermissions.forEach((data) => {
    worksheet.addRow(data);
  });

  // 5️⃣ Aplicar estilos a los encabezados
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
  });

  // 6️⃣ Generar el archivo Excel y descargarlo
  const buffer = await workbook.xlsx.writeBuffer();
  const fileBlob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
  saveAs(fileBlob, "permisos.xlsx");
};



const handleExportPermissions = async () => {
    const headers = [
        { header: "ID Rol", key: "Id_Rol", width: 15 },
        { header: "Rol", key: "Rol", width: 25 },
        { header: "ID Objeto", key: "Id_Objeto", width: 15 },
        { header: "Objeto", key: "Objeto", width: 25 },
        { header: "Consultar", key: "Permiso_Consultar", width: 15 },
        { header: "Insertar", key: "Permiso_Insertar", width: 15 },
        { header: "Actualizar", key: "Permiso_Actualizar", width: 15 },
        { header: "Eliminar", key: "Permiso_Eliminar", width: 15 },
        { header: "Estado", key: "Estado", width: 15 },
    ];

    const data = filteredPermissions.map((permission) => ({
        Id_Rol: permission.Id_Rol,
        Rol: roleMap[permission.Id_Rol] || "Desconocido",
        Id_Objeto: permission.Id_Objeto,
        Objeto: objectMap[permission.Id_Objeto] || "Desconocido",
        Permiso_Consultar: permission.Permiso_Consultar === "1" ? "Sí" : "No",
        Permiso_Insertar: permission.Permiso_Insertar === "1" ? "Sí" : "No",
        Permiso_Actualizar: permission.Permiso_Actualizar === "1" ? "Sí" : "No",
        Permiso_Eliminar: permission.Permiso_Eliminar === "1" ? "Sí" : "No",
        Estado: permission.Estado === 1 ? "Activo" : "Inactivo",
    }));

    await exportToExcel({
        fileName: "Permisos.xlsx",
        title: "Reporte de Permisos",
        headers,
        data,
        searchTerm, // Se mantiene para mostrar los filtros utilizados en la exportación
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
      Sin permisos para Acceder a la Pantalla de Permisos
    </h3>
    <p>No tienes permisos para Acceder a la información.</p>
  </div>
</div>
}

if (!permisos) {
  return <p>Cargando permisos...</p>;
}

  return (
    <div >
      {/* Columna izquierda: Formulario */}
      <ModalGenerico
        id="modalAddPermiso"
        isOpen={modals["modalAddPermiso"]}
        onClose={() => closeModal("modalAddPermiso")}
        titulo=  {isEditing ? "Editar Permiso" : "Agregar Permiso"}
      >
      <div >

        <form onSubmit={handleSubmit}>
          {/* Selector de Rol */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Rol
          </label>
          <select
            name="Id_Rol"
            value={formData.Id_Rol}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          >
            <option value="">Selecciona un Rol</option>
            {roles
              .filter((role) => role.Estado === 1) // Filtra para mostrar solo roles activos
              .map((rol) => (
                <option key={rol.Id_Rol} value={rol.Id_Rol}>
                  {rol.Rol}
                </option>
              ))}
          </select>

          {/* Selector de Objeto */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Objeto
          </label>
          <select
            name="Id_Objeto"
            value={formData.Id_Objeto}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          >
            <option value="">Selecciona un Objeto</option>
            {objects.map((objeto) => (
              <option key={objeto.Id_Objeto} value={objeto.Id_Objeto}>
                {objeto.Objeto}
              </option> // Asumiendo que `Nombre` es el campo que deseas mostrar
            ))}
          </select>

          {/* Opciones de Permisos */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {["Consultar","Insertar", "Actualizar",  "Eliminar"].map(
              (action) => (
                <div key={action} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`Permiso_${action}`}
                    checked={formData[`Permiso_${action}`]}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4 border border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    {action}
                  </label>
                </div>
              )
            )}
          </div>
                              {/* Campo de estado genérico */}
                              <label>Estado:</label>
            <select             className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="Estado" value={formData.Estado || ""} onChange={handleInputChange} required>
                <option value="">Seleccione un estado</option>
                {estados.map((estado) => (
                    <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
                        {estado.Nombre_Estado}
                    </option>
                ))}
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
</ModalGenerico>
      {/* Columna derecha: Tabla de permisos */}
      <div >
        {/* Buscador */}




  {/* Barra de búsqueda */}
  <SearchBar
  title="Listado de Permisos" // Título que aparecerá en la barra de búsqueda
  searchQuery={searchTerm} // El estado actual de la búsqueda
  setSearchQuery={setSearchTerm} // Función para actualizar el estado de la búsqueda
  handleClearSearch={handleClearSearch} // Función para limpiar la búsqueda
  onAdd={() => {
    resetForm(); // Resetear el formulario al agregar un nuevo rol
    showModal("modalAddPermiso");  // Mostrar el modal para agregar un nuevo rol
  }}
  onExport={handleExportPermissions} // Función para exportar la lista de roles
/>



        <ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Permiso)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={""}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>



<table className="xls_style-excel-table"> 
  <thead className="bg-slate-200">
    <tr>
      <th className="py-4 px-6 text-left">#</th>
      <th className="py-4 px-6 text-left">Rol</th>
      <th className="py-4 px-6 text-left">Objeto</th> {/* Nueva columna para objeto */}
      <th className="py-4 px-6 text-left">Consultar</th>
      <th className="py-4 px-6 text-left">Insertar</th>
      <th className="py-4 px-6 text-left">Actualizar</th>
      <th className="py-4 px-6 text-left">Eliminar</th>
      <th className="py-4 px-6 text-left">Estado</th> {/* ✅ Nueva columna de Estado */}
      <th className="py-4 px-6 text-center">Acciones</th>
    </tr>
  </thead>

  {permisos?.Permiso_Consultar === "1" && (
    <tbody>
      {currentPermissions.map((permiso,index) => {
        // Buscar el estado correspondiente en el diccionario de estados
        const estado = estados.find(e => e.Codigo_Estado === permiso.Estado);

        return (
          <tr key={permiso.Id_Permiso} className="border-b hover:bg-gray-100">
            <td className="py-4 px-6">{index+1}</td>
            <td className="py-4 px-6"><strong>{roleMap[permiso.Id_Rol]}</strong></td> {/* Mostrar nombre del rol */}
            <td className="py-4 px-6">{objectMap[permiso.Id_Objeto]}</td> {/* Mostrar nombre del objeto correctamente */}
            <td className="py-4 px-6">{permiso.Permiso_Consultar === "1" ? "Sí" : "No"}</td>
            <td className="py-4 px-6">{permiso.Permiso_Insertar === "1" ? "Sí" : "No"}</td>
            <td className="py-4 px-6">{permiso.Permiso_Actualizar === "1" ? "Sí" : "No"}</td>
            <td className="py-4 px-6">{permiso.Permiso_Eliminar === "1" ? "Sí" : "No"}</td>

            {/* ✅ Nueva Celda para Estado */}
            <td className="py-4 px-6">{estado ? estado.Nombre_Estado : "Desconocido"}</td>

            <td className="flex items-center space-x-2">
              {/* Verificar permiso para Editar */}
              {permisos.Permiso_Actualizar === "1" && (
                <button
                  onClick={() => { handleEdit(permiso); showModal("modalAddPermiso"); }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
              )}

              {/* Verificar permiso para Eliminar */}
              {permisos.Permiso_Eliminar === "1" && (
                <button
                  onClick={() => {
                    setFormData(permiso);
                    showModal("modalConfirmacion");
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  X
                </button>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  )}
</table>

        {/* Paginación */}
       {/* Paginación para Permisos */}
<Pagination
  currentPage={currentPage}
  totalItems={filteredPermissions.length} // Total de permisos filtrados
  itemsPerPage={perPage} // Cantidad de permisos por página
  setPage={setCurrentPage} // Función para actualizar el número de página
  setItemsPerPage={setPermissionsPerPage} // Función para actualizar la cantidad de permisos por página
  prevPage={() =>
    setCurrentPage((prev) => Math.max(prev - 1, 1)) // Navega a la página anterior, asegurándose que no sea menor a 1
  }
  nextPage={() =>
    setCurrentPage((prev) =>
      Math.min(
        prev + 1,
        Math.ceil(filteredPermissions.length / perPage)
      ) // Navega a la página siguiente, asegurándose que no se exceda el total de páginas
    )
  }
/>

      </div>
    </div>
  );
};

export default PermissionsManagement;