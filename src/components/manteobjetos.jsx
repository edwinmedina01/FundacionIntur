import React, { useState, useEffect,useContext} from 'react'; //agregar el useContex
import axios from 'axios';

import AuthContext from '../context/AuthContext'; //llamado del authcontext para extraer info de usuario logeado
import { ShieldExclamationIcon,MagnifyingGlassIcon,UserPlusIcon,ArrowDownCircleIcon,PencilSquareIcon  } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador
import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import useModal from "../hooks/useModal"; 
import { validarFormulario } from "../utils/validaciones";
import { reglasValidacion } from "../../models/ObjetoDto"; // Importamos las reglas del modelo
import { exportToExcel } from '../utils/exportToExcel';

const ManejoObjetos = () => {
  const { user } = useContext(AuthContext); // Usuario logueado
  const [permisos, setPermisos] = useState(null); //obtener permiso
  const [error, setError] = useState(null); //mostrar error de permiso
  const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
  const [objetos, setObjetos] = useState([]);
  const [formData, setFormData] = useState({
    Id_Objeto: '',
    Objeto: '',
    Descripcion: '',
    Tipo_Objeto: '',
    Estado: '', // Estado predeterminado a activo
  });
  const [isEditing, setIsEditing] = useState(false);

 // Paginación
 const [currentPage, setCurrentPage] = useState(1);
 const [perPage] = useState(8); // Número de elementos por página
 const [searchTerm, setSearchTerm] = useState(''); // Búsqueda
 const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  useEffect(() => {
    fetchObjetos();
    fetchPermisos();
  }, [user]);

 // Filtros por búsqueda
 const filteredObjetos = objetos.filter(objeto =>
  objeto.Objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
  objeto.Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
);

// Paginación
const indexOfLastObjeto = currentPage * perPage;
const indexOfFirstObjeto = indexOfLastObjeto - perPage;
const currentObjetos = filteredObjetos.slice(indexOfFirstObjeto, indexOfLastObjeto);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

const totalPages = Math.ceil(filteredObjetos.length / perPage);



const exportToExcelObjetosv1 = async () => {
  // 1️⃣ Crear un nuevo libro y hoja de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Objetos");
  console.log("filteredObjetos")
  console.log(filteredObjetos)

  // 2️⃣ Definir las columnas y encabezados
  worksheet.columns = [
    { header: "ID", key: "Id_Objeto", width: 10 },
    { header: "Nombre", key: "Nombre", width: 30 },
    { header: "Descripción", key: "Descripcion", width: 40 },
    { header: "Estado", key: "Estado", width: 15 },
  ];

  // 3️⃣ Agregar los datos a la hoja de cálculo
  filteredObjetos.forEach((objeto) => {
    worksheet.addRow({
      Id_Objeto: objeto.Id_Objeto,
      Nombre: objeto.Objeto,
      Descripcion: objeto.Descripcion,
      Estado: objeto.Estado === "1" ? "Activo" : "Inactivo",
    });
  });

  // 4️⃣ Aplicar estilos a los encabezados
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
  });

  // 5️⃣ Generar el archivo y descargarlo
  const buffer = await workbook.xlsx.writeBuffer();
  const fileBlob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(fileBlob, "objetos.xlsx");
};



const exportToExcelObjetos = async () => {
    const headers = [
        { header: "ID", key: "Id_Objeto", width: 10 },
        { header: "Nombre", key: "Nombre", width: 30 },
        { header: "Descripción", key: "Descripcion", width: 40 },
        { header: "Estado", key: "Estado", width: 15 },
    ];

    const data = filteredObjetos.map((objeto) => ({
        Id_Objeto: objeto.Id_Objeto,
        Nombre: objeto.Objeto,
        Descripcion: objeto.Descripcion,
        Estado: objeto.Estado === "1" ? "Activo" : "Inactivo",
    }));

    await exportToExcel({
        fileName: "Objetos.xlsx",
        title: "Reporte de Objetos",
        headers,
        data,
        searchTerm, // Se mantiene para mostrar los filtros utilizados en la exportación
    });
};


// Exportar a Excel
// const exportToExcel = () => {
//   const ws = XLSX.utils.json_to_sheet(filteredObjetos);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Objetos');
//   XLSX.writeFile(wb, 'objetos.xlsx');
// };
// Obtener permisos
const fetchPermisos = async () => {
  try {
    if (user) {
      const idObjeto = 3; // ID del objeto relacionado con esta página
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

  const fetchObjetos = async () => {
    try {
      const response = await axios.get('/api/objetos'); // Endpoint para obtener objetos
      setObjetos(response.data);
    } catch (error) {
      console.error('Error al obtener los objetos:', error);
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
    try {
      const requestData = {
        ...formData,
      };


      const errores = validarFormulario(formData, reglasValidacion);

      if (errores.length > 0) {
     
      //toast.error(errores.join("\n"), error);
        return;
      }
    
      

      // const response = await fetch('/api/objetos', {
      //   method: isEditing ? 'PUT' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestData),
      // });
let response;

if(isEditing){
       response = await axios.put('/api/objetos',requestData);}
       else{

        response = await axios.post('/api/objetos', requestData);
       }
    

    //   if (!response.ok) {
    //  //   throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el objeto`);
    //  console.log(response);
    //  toast.error('Error al guardar el objeto:', response);
    //   }

      toast.success(`Objeto ${isEditing ? 'actualizado' : 'agregado'} exitosamente`,
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

      closeModal("modalAddObjeto")
      

      fetchObjetos();
      resetForm();
    } catch (error) {
      console.log(error)
      toast.error('Error: '+ error.response?.data?.message);
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se hace búsqueda
  };
  const handleEdit = (objeto) => {
    setFormData({
      Id_Objeto: objeto.Id_Objeto,
      Objeto: objeto.Objeto,
      Descripcion: objeto.Descripcion,
      Tipo_Objeto: objeto.Tipo_Objeto,
      Estado: objeto.Estado,
    });
    setIsEditing(true);
  };

  const handleDelete = async (Id_Objeto) => {
    try {
      const response = await fetch('/api/objetos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Objeto }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el objeto');
      }


      fetchObjetos();
      resetForm();
   
      toast.error('Objeto eliminado exitosamente', {
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
      toast.error('Error al eliminar el objeto:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Objeto: '',
      Objeto: '',
      Descripcion: '',
      Tipo_Objeto: '',
      Estado: '', // Reiniciar el estado a activo
    });
    setIsEditing(false);
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
      Sin permisos para Acceder a la Pantalla de Objetos
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
 
  <div className="mb-1 flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
  {/* Barra de búsqueda */}
  <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
    <MagnifyingGlassIcon className="h-6 w-6 mr-2 text-gray-600" />



<input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      className="border-none focus:ring-0 w-200 text-gray-700 bg-transparent"
      placeholder="Buscar por nombre o correo"
    />
  </div>

  {/* Título de la sección */}
  <p className="text-3xl font-bold text-blue-700">📋 Listado de Objetos</p>

  {/* Botones de acciones */}
  <div className="flex gap-x-2">

    {/* Botón para abrir el modal de agregar usuario */}
<button
  onClick={() => showModal("modalAddObjeto")}
  className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
>
  <UserPlusIcon className="h-5 w-5 mr-2" /> Agregar Objeto
</button>
    
    <button
      onClick={exportToExcelObjetos}
      className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md"
    >
      <ArrowDownCircleIcon className="h-5 w-5 mr-2" /> Exportar
    </button>


  </div>
  </div>

 



 
  <ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Objeto)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Objeto}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>


        
 
 
  <table className="xls_style-excel-table">
          <thead className="bg-slate-200">
            <tr>
              <th className="">Id Objeto</th>
              <th className="">Nombre</th>
              <th className="">Descripción</th>
              <th className="">Tipo</th>
              <th className="">Estado</th>
              <th className="">Acciones</th>
            </tr>
          </thead>
          {permisos?.Permiso_Consultar === "1" && (
          <tbody>
            {currentObjetos.map((objeto) => (
              <tr key={objeto.Id_Objeto} className="border-b hover:bg-gray-100">
                <td className="py-4 px-6">{objeto.Id_Objeto}</td>
                <td className="py-4 px-6">
                  <strong>{objeto.Objeto}</strong>
                </td>
                <td className="py-4 px-6">{objeto.Descripcion}</td>
                <td className="py-4 px-6">{objeto.Tipo_Objeto}</td>
                <td className="py-4 px-6">
                  {objeto.Estado === 1 ? "Activo" : "Inactivo"}
                </td>
                <td className="py-4 px-6 flex justify-center space-x-2">
                {/*Agregar la condicional para verificar si tiene permiso*/}
                  {permisos.Permiso_Actualizar === "1" && (
                    <button
                    onClick={() => {
                      handleEdit(objeto);
                      showModal("modalAddObjeto")
                    }}
                    
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  )}
                   {/*Agregar la condicional para verificar si tiene permiso*/}
                  {permisos.Permiso_Eliminar === "1" && (
                    <button
                    onClick={() => {
                      handleEdit(objeto);
                      showModal("modalConfirmacion");
                    }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      X
                    </button>
                  )}
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
  
        <ModalGenerico
        id="modalAddObjeto"
        isOpen={modals["modalAddObjeto"]}
        onClose={() => closeModal("modalAddObjeto")}
        titulo=  {isEditing ? "Editar Objeto" : "Agregar Objeto"}
      >
             {/* Columna izquierda: Formulario */}
      <div className="w-3/3 bg-white p-6 rounded-lg shadow-md items-center">
 
        <form onSubmit={handleSubmit}>
          {/* Input de Objeto */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Objeto
          </label>
          <input
            type="text"
            name="Objeto"
            value={formData.Objeto}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg uppercase"
          />

          {/* Input de Descripción */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Descripción
          </label>
          <input
            type="text"
            name="Descripcion"
            value={formData.Descripcion}
            required
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          />

          {/* Input de Tipo de Objeto */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tipo de Objeto
          </label>
          <input
            type="text"
            name="Tipo_Objeto"
            required
            value={formData.Tipo_Objeto}
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          />

          {/* Estado */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            name="Estado"
            value={formData.Estado}
            required
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          >
            <option value="">Selecciona Estado</option>
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
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
                closeModal("modalAddObjeto");
              }}
              
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancelar
            </button>
          </div>
        </form>

      </div>

      </ModalGenerico>
      </div>

      
  
  );
};

export default ManejoObjetos;
