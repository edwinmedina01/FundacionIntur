import React, { useState, useEffect, useContext } from 'react';
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
import { reglasValidacionConfiguracion } from "../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import { ShieldExclamationIcon,MagnifyingGlassIcon,UserPlusIcon,ArrowDownCircleIcon,PencilSquareIcon  } from '@heroicons/react/24/outline';



const ConfiguracionManagement = () => {
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
    const [configuraciones, setConfiguraciones] = useState([]);
  
    const [formData, setFormData] = useState({
      Id_Configuracion: '', // ID de la configuración (puede estar vacío si es un nuevo registro)
      Clave: '', // Clave de configuración
      Valor: '', // Valor de la configuración
      Descripcion: '', // Descripción opcional de la configuración
      Creado_Por: '', // Usuario que creó la configuración
      Fecha_Creacion: '', // Fecha de creación en formato YYYY-MM-DD
      Modificado_Por: '', // Usuario que modificó la configuración (opcional)
      Fecha_Modificacion: '', // Fecha de modificación en formato YYYY-MM-DD (opcional)
  });
  
  
  const [isEditing, setIsEditing] = useState(false);

  
 // Paginación
 const [currentPage, setCurrentPage] = useState(1);
 const [perPage] = useState(8); // Número de elementos por página
 const [searchTerm, setSearchTerm] = useState(''); // Búsqueda

  useEffect(() => {
    fetchPermissions();
   // fetchRoles();
   // fetchObjects(); // Llama a la función para obtener objetos

    fetchPermisos();
    fetchConfiguraciones();
  }, [user]);
// -------- PERMISOS -fetchConfiguraciones------- //
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
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se hace búsqueda
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/api/configuracion');
      setConfiguraciones(response.data);
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


  const fetchConfiguraciones = async () => {
    try {
      const response = await axios.get('/api/configuracion');
      setConfiguraciones(response.data);
    } catch (error) {
      console.error('Error fetching configuraciones:', error);
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

const handleClearSearch = () => {
  setSearchQuery("");
  setCurrentPage(1); // Reiniciar a la primera página
}; 

const handleSubmit = async (e) => {
  

  e.preventDefault();
  try {
    const requestData = {
      ...formData,
    };

    formData.Creado_Por=user.id;
    formData.Modificado_Por=user.id;
   
    const errores = validarFormulario(formData, reglasValidacionConfiguracion);
 
  if (errores.length > 0) {
    return ;
  }
  

    const response = await fetch('/api/configuracion', {
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
    

  
    fetchConfiguraciones();
    resetForm();
    closeModal("modalAddConfiguracion")
  } catch (error) {
    toast.error('Error al guardar el permiso:', error);
  }
};

  const handleEdit = (config) => {
    setFormData(config);
    setIsEditing(true);

    showModal("modalAddConfiguracion")
  };

  const handleDelete = async (Id_Configuracion) => {
    try {
      const response = await fetch('/api/configuracion', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Configuracion }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el Configuracion');
      }

      fetchPermissions();
      resetForm();
      toast.error('Configuracion  eliminado exitosamente', {
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
      Id_Configuracion: '', // ID de la configuración (puede estar vacío si es un nuevo registro)
      Clave: '', // Clave de configuración
      Valor: '', // Valor de la configuración
      Descripcion: '', // Descripción opcional de la configuración
      Creado_Por: '', // Usuario que creó la configuración
      Fecha_Creacion: '', // Fecha de creación en formato YYYY-MM-DD
      Modificado_Por: '', // Usuario que modificó la configuración (opcional)
      Fecha_Modificacion: '', // Fecha de modificación en formato YYYY-MM-DD (opcional)

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
  const roleMatches = roleName && roleName.toLowerCase().includes(searchTerm.toLowerCase());

  // Obtén el nombre del objeto usando el Id_Objeto y verifica si es una cadena antes de usar toLowerCase()
  const objectName = objectMap[permission.Id_Objeto] || '';  // Obtén el nombre del objeto
  const objectMatches = objectName && objectName.toLowerCase().includes(searchTerm.toLowerCase());

  return roleMatches || objectMatches;
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



const exportToExcel = async () => {
  // 1️⃣ Crear un nuevo libro de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Permisos");

  // 2️⃣ Definir encabezados de las columnas
  worksheet.columns = [
    { header: "ID Rol", key: "Id_Rol", width: 15 },
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
    Id_Rol: permission.Id_Rol,
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
        id="modalAddConfiguracion"
        isOpen={modals["modalAddConfiguracion"]}
        onClose={() => closeModal("modalAddConfiguracion")}
        titulo=  {isEditing ? "Editar Configuración" : "Agregar Configuración"}
      >
      <div >

      <div className="w-3/3 bg-white p-6 rounded-lg shadow-md">
  
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Clave</label>
          <input type="text" name="Clave" value={formData.Clave} onChange={handleInputChange} required className="mb-4 p-3 w-full border border-gray-300 rounded-lg" />

          <label className="block mb-2">Valor</label>
          <input type="text" name="Valor" value={formData.Valor} onChange={handleInputChange} required className="mb-4 p-3 w-full border border-gray-300 rounded-lg" />

          <label className="block mb-2">Descripción</label>
          <input type="text" name="Descripcion" value={formData.Descripcion} onChange={handleInputChange} className="mb-4 p-3 w-full border border-gray-300 rounded-lg" />

          <div className="flex justify-end">
            {isEditing && permisos?.Permiso_Actualizar === "1" && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Actualizar
              </button>
            )}
            {!isEditing && permisos?.Permiso_Insertar === "1" && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Agregar
              </button>
            )}
            <button type="button"
              onClick={() => {
                resetForm(); // Resetea el formulario
                closeModal("modalAddConfiguracion")
              }}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Cancelar
            </button>
          </div>
        </form>
      </div>
      </div>
</ModalGenerico>
      {/* Columna derecha: Tabla de permisos */}
      <div >
        {/* Buscador */}



 <div className="mb-1 flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
  {/* Barra de búsqueda */}
  <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
    <MagnifyingGlassIcon className="h-6 w-6 mr-2 text-gray-600" />



<input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      className="border-none focus:ring-0 w-200 text-gray-700 bg-transparent"
   placeholder="Buscar..."
    />
  </div>

  {/* Título de la sección */}
  <p className="text-3xl font-bold text-blue-700">📋 Configuraciones</p>

  {/* Botones de acciones */}
  <div className="flex gap-x-2">

    {/* Botón para abrir el modal de agregar usuario */}
<button
  onClick={() => showModal("modalAddConfiguracion")}
  className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
>
  <UserPlusIcon className="h-5 w-5 mr-2" /> Agregar Configuracion
</button>
    
    <button
      onClick={exportToExcel}
      className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md"
    >
      <ArrowDownCircleIcon className="h-5 w-5 mr-2" /> Exportar
    </button>


  </div>
  </div>


        <ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Configuracion)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={""}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>



        <table className="xls_style-excel-table">
          <thead className="bg-slate-200">
            <tr>
            <th>Clave</th>
            <th>Valor</th>
            <th>Descripción</th>
            <th>Modificar</th>
            </tr>
          </thead>
          {permisos?.Permiso_Consultar === "1" && (
       <tbody>
       {configuraciones.map(config => (
         <tr key={config.Id_Configuracion}>
           <td>{config.Clave}</td>
           <td>
           {config.Valor}
           </td>
           <td>
           {config.Descripcion}
     
           </td>
           <td className="py-4 px-6 flex justify-center space-x-2">
                {permisos.Permiso_Actualizar === "1" && ( 
                  <button 
                    onClick={() => handleEdit(config)} 
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
                  >
                    Editar
                  </button>)}
                  {permisos.Permiso_Eliminar === "1" && (
                  <button 
                   

                    onClick={() => {
                       setFormData(config)
                       showModal("modalConfirmacion");
                     }}

                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                  >
                    X
                  </button>)}
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
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none"
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
                    ? "bg-white-600 text-black shadow-lg scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
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
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionManagement;