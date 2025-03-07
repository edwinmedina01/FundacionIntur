import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador
import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionArea } from "../../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from "../../hooks/useModal";
const AreaManagement = () => {
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [modalidades, setModalidades] = useState([]);

  const [areas, setAreas] = useState([]);
      // ------------------- FUNCIONALIDAD ROLES----------------------//
      const { user } = useContext(AuthContext); // Usuario logueado
      const [permisos, setPermisos] = useState(null); //obtener permiso
      const [error, setError] = useState(null); //mostrar error de permiso
      const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
    // ------------------------------------------------------------//
   
  const [formData, setFormData] = useState({
    Id_Area: '',
    Nombre_Area: '',
    Tipo_Area: '',
    Responsable_Area: '',
  });
  const [isEditing, setIsEditing] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
  const areasPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');



  // Filtrado de áreas por Nombre_Area
  const filteredAreas = areas.filter(area =>
    area.Nombre_Area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastArea = currentPage * areasPerPage;
  const indexOfFirstArea = indexOfLastArea - areasPerPage;
  const currentAreas = filteredAreas.slice(indexOfFirstArea, indexOfLastArea);

  // Paginación
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredAreas.length / areasPerPage)) {
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

  // // Exportación a Excel
  // const exportToExcel = () => {
  //   const exportData = currentAreas.map(area => ({
  //     ID: area.Id_Area,
  //     Nombre: area.Nombre_Area,
  //     Tipo: area.Tipo_Area,
  //     Responsable: area.Responsable_Area,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Áreas');

  //   XLSX.writeFile(workbook, 'Areas.xlsx');
  // };


const exportToExcel = async () => {
  // 1️⃣ Crear un nuevo libro y hoja de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Áreas");

  // 2️⃣ Definir las columnas y encabezados
  worksheet.columns = [
    { header: "ID", key: "ID", width: 10 },
    { header: "Nombre", key: "Nombre", width: 30 },
    { header: "Tipo", key: "Tipo", width: 20 },
    { header: "Responsable", key: "Responsable", width: 30 },
  ];

  // 3️⃣ Transformar los datos antes de agregarlos
  const exportData = currentAreas.map((area) => ({
    ID: area.Id_Area,
    Nombre: area.Nombre_Area,
    Tipo: area.Tipo_Area,
    Responsable: area.Responsable_Area,
  }));

  // 4️⃣ Agregar los datos a la hoja de cálculo
  exportData.forEach((area) => {
    worksheet.addRow(area);
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

  saveAs(fileBlob, "Areas.xlsx");
};


  // Fetch de áreas desde el backend
  useEffect(() => {
    fetchAreas();
    fetchPermisos();
  }, [user]);
  // -------- PERMISOS -------- //
const fetchPermisos = async () => {
  try {
    if (user) {
      const idObjeto = 6; // ID del objeto relacionado con esta página
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

  const fetchAreas = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/area');
      setAreas(response.data);
    } catch (error) {
      toast.error('Error fetching areas:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const obtenerFechaActual = () => {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

  const handleClearSearch = () => {
  setSearchQuery("");
  setCurrentPage(1); // Reiniciar a la primera página
}; 

const handleSubmit = async (e) => {



    formData.Creado_Por = user.id;
   formData.Fecha_Creacion = obtenerFechaActual();

    formData.Modificado_Por = user.id;
    formData.Fecha_Modificacion = obtenerFechaActual();
    formData.Estado = 1;
   const errores = validarFormulario(formData, reglasValidacionArea);

      if (errores.length > 0) {
     
      //toast.error(errores.join("\n"), error);
        return;
      }
     

    e.preventDefault();
    try {
      const response = isEditing
        ? await fetch('/api/apis_mantenimientos/area', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
        : await fetch('/api/apis_mantenimientos/area', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

      if (!response.ok) throw new Error('Error en la operación');

      toast.success(
        isEditing ? 'Área actualizada exitosamente' : 'Área agregada exitosamente',  {
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
      fetchAreas();
      resetForm();
    } catch (error) {
      toast.error('Error al guardar el área');
      toast.error(error);
    }
  };

  const handleEdit = (area) => {
    setFormData(area);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Area) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/area', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Id_Area }),
      });

      if (!response.ok) throw new Error('Error al eliminar el área');

      toast.error('Área eliminada exitosamente', {
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
      fetchAreas();
      resetForm();
            closeModal("modalConfirmacion");
    } catch (error) {
      toast.error('Error al eliminar el área');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Area: '', Nombre_Area: '', Tipo_Area: '', Responsable_Area: '' });
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
      Sin permisos para Acceder a la Pantalla de Areas
    </h3>
    <p>No tienes permisos para Acceder a la información.</p>
  </div>
</div>
}

if (!permisos) {
  return <p>Cargando permisos...</p>;
}

  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Área' : 'Agregar Área'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre_Area" className="block mb-2 text-sm font-medium text-gray-700">Nombre del Área</label>
          <input
            type="text"
            name="Nombre_Area"
            placeholder="Nombre del Área"
            value={formData.Nombre_Area}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Tipo_Area" className="block mb-2 text-sm font-medium text-gray-700">Tipo de Área</label>
          <input
            type="text"
            name="Tipo_Area"
            placeholder="Tipo de Área"
            value={formData.Tipo_Area}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Responsable_Area" className="block mb-2 text-sm font-medium text-gray-700">Responsable del Área</label>
          <input
            type="text"
            name="Responsable_Area"
            placeholder="Responsable del Área"
            value={formData.Responsable_Area}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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

      {/* Columna derecha: Tabla de áreas */}
      <div className="w-2/3">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        >
          Exportar a Excel
        </button>
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 mb-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
<ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Area)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Nombre_Area}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>


        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Nombre del Área</th>
              <th className="p-3 border-b">Tipo de Área</th>
              <th className="p-3 border-b">Responsable del Área</th>
              <th className="p-3 border-b">Acciones</th>
            </tr>
          </thead>
          {permisos?.Permiso_Consultar === "1" && (
          <tbody>
            {currentAreas.map((area) => (
              <tr key={area.Id_Area} className="hover:bg-slate-100 transition-colors">
                <td className="p-3 border-b">{area.Id_Area}</td>
                <td className="p-3 border-b">{area.Nombre_Area}</td>
                <td className="p-3 border-b">{area.Tipo_Area}</td>
                <td className="p-3 border-b">{area.Responsable_Area}</td>
                <td className="p-3 border-b flex space-x-2">
                 {permisos.Permiso_Actualizar === "1" && (
                  <button
                    onClick={() => handleEdit(area)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>)}
                  {permisos.Permiso_Eliminar === "1" && (
                  <button
                 
                    onClick={() => {
                      setFormData(area)
                      showModal("modalConfirmacion");
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    X
                  </button>)}
                </td>
              </tr>
            ))}
          </tbody>)}
        </table>
{/* Paginación */}
<div className="flex justify-between mt-4">
  <button
    onClick={prevPage}
    className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
    disabled={currentPage === 1}
  >
    Anterior
  </button>

  {/* Páginas */}
  <div className="flex space-x-2">
    {Array.from({ length: Math.ceil(filteredAreas.length / areasPerPage) }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => setPage(index + 1)}
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
    onClick={nextPage}
    className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
    disabled={currentPage === Math.ceil(filteredAreas.length / areasPerPage)}
  >
    Siguiente
  </button>
        </div>
      </div>
    </div>
  );
};

export default AreaManagement;
