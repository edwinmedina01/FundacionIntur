import React, { useState, useEffect, useContext,useCallback  } from 'react';
import axios from 'axios';

import { useRouter } from 'next/router';
import { ShieldExclamationIcon ,PencilSquareIcon,TrashIcon  } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon,MagnifyingGlassIcon  } from "@heroicons/react/24/outline"; 
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador
import SearchBar from "../../components/basicos/SearchBar"; 
import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionModalidad } from "../../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from "../../hooks/useModal";
import { obtenerEstados } from "../../utils/api"; // Importar la función
import { exportToExcel } from "../../utils/exportToExcel"; // Importar la función
import { getBase64ImageFromUrl } from "../../utils/getBase64ImageFromUrl"; 
import { deepSearch } from "../../utils/deepSearch";// Importar la función
import  ModalGenerico  from "../../utils/ModalGenerico";// Importar la función
import Pagination from "../../components/basicos/Pagination"; 

const ModalidadesManagement = () => {

  const [estados, setEstados] = useState([]);

  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [modalidades, setModalidades] = useState([]);
            // ------------------- FUNCIONALIDAD ROLES----------------------//
            const { user } = useContext(AuthContext); // Usuario logueado
            const [permisos, setPermisos] = useState(null); //obtener permiso
            const [error, setError] = useState(null); //mostrar error de permiso
            const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
          // ------------------------------------------------------------//
  const [formData, setFormData] = useState({
    Id_Modalidad: '',
    Nombre: '',
    Descripcion: '',
    Duracion: '',
    Horario: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
    const [modalidadesPerPage, setUsersPerPage] = useState(10); // Valor inicial
 
   const [searchQuery, setSearchQuery] = useState({
     general: "",

   });

   // 📌 Limpiar búsqueda
const handleClearSearch = () => {
  setSearchQuery({ general: "", Usuario: "", Estado: "", Created: "" });
  setCurrentPage(1); // Reiniciar a la primera página
};


  // Filtros del buscador por nombre
  
    const filteredModalidades = modalidades.filter((user) => deepSearch(user, searchQuery, 0, 3));

  // Lógica de paginación para modalidades filtradas
  const indexOfLastModalidad = currentPage * modalidadesPerPage;
  const indexOfFirstModalidad = indexOfLastModalidad - modalidadesPerPage;
  const currentModalidades = filteredModalidades.slice(indexOfFirstModalidad, indexOfLastModalidad);

  // Funciones de navegación de páginas
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredModalidades.length / modalidadesPerPage)) {
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

  // Función para exportar a Excel
  // const exportToExcel = () => {
  //   const exportData = currentModalidades.map(modalidad => ({
  //     ID: modalidad.Id_Modalidad,
  //     Nombre: modalidad.Nombre,
  //     Descripción: modalidad.Descripcion,
  //     Duración: modalidad.Duracion,
  //     Horario: modalidad.Horario,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Modalidades');

  //   XLSX.writeFile(workbook, 'Modalidades.xlsx');
  // };



  



const handleExportModalidades = async () => {
  const headers = [
    //{ header: "ID", key: "ID", width: 10 },
    { header: "Nombre", key: "Nombre", width: 30 },
    { header: "Fecha de Creación", key: "Fecha_Creacion", width: 15 },
    { header: "Descripción", key: "Descripcion", width: 40 },
    { header: "Duración (Meses)", key: "Duracion", width: 18 },
    { header: "Hora Inicio", key: "Hora_Inicio", width: 18 },
    { header: "Hora Final", key: "Hora_Final", width: 18 },
    { header: "Estado", key: "Estado", width: 20 },
  ];

  const data = filteredModalidades.map((modalidad) => {
    const estado = estados.find((e) => e.Codigo_Estado === modalidad.Estado)?.Nombre_Estado || "Desconocido";

    return {
      ID: modalidad.Id_Modalidad,
      Nombre: modalidad.Nombre,
      Fecha_Creacion: modalidad.Fecha_Creacion,
      Descripcion: modalidad.Descripcion,
      Duracion: modalidad.Duracion || "-",
      Hora_Inicio: modalidad.Hora_Inicio || "-",
      Hora_Final: modalidad.Hora_Final || "-",
      Estado: estado,
    };
  });

  await exportToExcel({
    fileName: "Modalidades.xlsx",
    title: "Reporte de Modalidades",
    headers,
    data,
    searchQuery, // Se usa para mostrar los filtros aplicados
  });
};


  
  const cargarEstados = useCallback(async () => {
  //  setLoading(true);
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  //  setLoading(false);
}, []); // 🔥 Se ejecu

  // Fetch de modalidades desde el backend
  useEffect(() => {
    cargarEstados();
    fetchModalidades();
    fetchPermisos();
  }, [user]);

   // -------- PERMISOS -------- //
   const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 11; // ID del objeto relacionado con esta página
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


  const fetchModalidades = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/modalidades');
      setModalidades(response.data);
    } catch (error) {
      toast.error('Error fetching modalidades:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const obtenerFechaActual = () => {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};



const handleSubmit = async (e) => {
    e.preventDefault();


    formData.Creado_Por = user.id;
   formData.Fecha_Creacion = obtenerFechaActual();

    formData.Modificado_Por = user.id;
    formData.Fecha_Modificacion = obtenerFechaActual();
   // formData.Estado = Number( formData.Estado);
   const errores = validarFormulario(formData, reglasValidacionModalidad);

      if (errores.length > 0) {
     
      //toast.error(errores.join("\n"), error);
        return;
      }
     


    try {
      if (isEditing) {
        const response = await fetch(`/api/apis_mantenimientos/modalidades`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la modalidad');
        }

        toast.success('Modalidad actualizada exitosamente',
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
        const response = await fetch('/api/apis_mantenimientos/modalidades', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear la modalidad');
        }

        toast.success('Modalidad agregada exitosamente',
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

      fetchModalidades();
      closeModal("modalAddRow");
      resetForm();
     
    } catch (error) {
      toast.error('Error al guardar la modalidad:', error);
    }
  };

  const handleEdit = (modalidad) => {
    setFormData({
      ...modalidad,
      Estado: modalidad.Estado?.toString() || "", // <- Asegura que sea string
    });
    setIsEditing(true);
    showModal("modalAddRow");
  
  };

  const handleDelete = async (Id_Modalidad) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/modalidades', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Modalidad,Modificado_Por: user.id }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la modalidad');
      }
      closeModal("modalConfirmacion");
      fetchModalidades();
      resetForm();
      toast.error('Modalidad eliminada exitosamente',{
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
      toast.error('Error al eliminar la modalidad:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Modalidad: '', Nombre: '', Descripcion: '', Duracion: '', Horario: '' });
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
      Sin permisos para Acceder a la Pantalla de Modalidades
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
  
         {/* Columna izquierda: Formulario */}
         <ModalGenerico
        id="modalAddRow"
        isOpen={modals["modalAddRow"]}
        onClose={() => closeModal("modalAddRow")}
        titulo=  {isEditing ? "Editar Modalidad" : "Agregar Modalidad"}
      >
        <form onSubmit={handleSubmit}>
  {/* Nombre */}
  <label htmlFor="Nombre" className="block mb-2 text-sm font-medium text-gray-700">
    Nombre de la Modalidad
  </label>
  <input
    type="text"
    name="Nombre"
    placeholder="Nombre de la Modalidad"
    value={formData.Nombre}
    onChange={handleInputChange}
    required
    className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Descripción */}
  <label htmlFor="Descripcion" className="block mb-2 text-sm font-medium text-gray-700">
    Descripción
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

  {/* Duración (en meses) */}
  <label htmlFor="Duracion" className="block mb-2 text-sm font-medium text-gray-700">
    Duración (meses)
  </label>
  <input
    type="number"
    name="Duracion"
    placeholder="Ej. 3"
    min="1"
    max="60"
    value={formData.Duracion}
    onChange={handleInputChange}
    required
    className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Hora de inicio */}
  <label htmlFor="Hora_Inicio" className="block mb-2 text-sm font-medium text-gray-700">
    Hora de Inicio (HH:MM)
  </label>
  <input
    type="time"
    name="Hora_Inicio"
    value={formData.Hora_Inicio}
    onChange={handleInputChange}
    required
    className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Hora final */}
  <label htmlFor="Hora_Final" className="block mb-2 text-sm font-medium text-gray-700">
    Hora Final (HH:MM)
  </label>
  <input
    type="time"
    name="Hora_Final"
    value={formData.Hora_Final}
    onChange={handleInputChange}
    required
    className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Estado */}
  <label>Estado:</label>
  <select
    className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    name="Estado"
    value={formData.Estado || ""}
    onChange={handleInputChange}
    required
  >
    <option value="">Seleccione un estado</option>
    {estados.map((estado) => (
      <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
        {estado.Nombre_Estado}
      </option>
    ))}
  </select>

  {/* Botones */}
  <div className="flex justify-end">
    {isEditing ? (
      permisos.Permiso_Actualizar === "1" && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Actualizar
        </button>
      )
    ) : (
      permisos.Permiso_Insertar === "1" && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Agregar
        </button>
      )
    )}
    <button
      type="button"
      onClick={() => {
        resetForm();
        closeModal("modalAddRow");
      }}
      className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Cancelar
    </button>
  </div>
</form>
</ModalGenerico>


      {/* Columna derecha: Tabla de modalidades */}
      <div className="w-3/3">

 {/* Barra de búsqueda y acciones utilizando el componente `SearchBar` */}
 <SearchBar
    title="Listado de Modalidades"
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    handleClearSearch={handleClearSearch}
    onAdd={() => {
      resetForm();
      showModal("modalAddRow");
    }}
    onExport={handleExportModalidades} // Exportar sin parámetros
  />
<ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Modalidad)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Descripcion}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>


{/* Tabla de modalidades */}

{/* Tabla de modalidades */}
<table className="xls_style-excel-table">
  <thead className="bg-slate-200">
    <tr>
      <th>#</th>
      <th>Acciones</th>
      {/* <th>Id Modalidad</th> */}
      <th>Nombre</th>
      <th>Fecha de Creación</th> {/* Nombre de la columna actualizado */}
      <th>Descripción</th>
      <th>Duración (meses)</th>
      <th>Hora de Inicio</th>
      <th>Hora Final</th>
      <th>Estado</th>
    </tr>
  </thead>
  {permisos?.Permiso_Consultar === "1" && (
    <tbody>
      {currentModalidades.map((modalidad, index) => {
        const estadoDescripcion = estados.find(
          (estado) => estado.Codigo_Estado === modalidad.Estado
        )?.Nombre_Estado || "Desconocido";

        const fechaCreacion = modalidad.Fecha_Creacion || "Fecha no disponible"; // Si no trae la fecha, coloca un valor por defecto

        return (
          <tr key={modalidad.Id_Modalidad} className="border-b hover:bg-gray-100 transition duration-300">
            <td >{index + 1}</td>
            <td >
              <div className="flex justify-center gap-2">
                {permisos.Permiso_Actualizar === "1" && (
                  <button
                    onClick={() => handleEdit(modalidad)}
                    className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                )}
                {permisos.Permiso_Eliminar === "1" && (
                  <button
                    onClick={() => {
                      setFormData(modalidad);
                      showModal("modalConfirmacion");
                    }}
                    className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </td>
            {/* <td >{modalidad.Id_Modalidad}</td> */}
            <td >{modalidad.Nombre}</td>
            <td >{fechaCreacion}</td> {/* Aquí se muestra la Fecha_Creacion */}
            <td >{modalidad.Descripcion}</td>
            <td >{modalidad.Duracion}</td>
            <td >{modalidad.Hora_Inicio}</td>
            <td >{modalidad.Hora_Final}</td>
            <td >{estadoDescripcion}</td>
          </tr>
        );
      })}
      {filteredModalidades.length === 0 && (
        <tr>
          <td colSpan="10" className="py-4 text-center text-gray-500">
            ❌ No se encontraron modalidades con los criterios de búsqueda
          </td>
        </tr>
      )}
    </tbody>
  )}
</table>


        {/* Paginación */}
        <Pagination
  currentPage={currentPage}
  totalItems={filteredModalidades.length}
  itemsPerPage={modalidadesPerPage}
  setPage={setCurrentPage}
  setItemsPerPage={setUsersPerPage}
  prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  nextPage={() =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredModalidades.length / modalidadesPerPage))
    )
  }
/>

      </div>
    </div>
  );
};

export default ModalidadesManagement;
