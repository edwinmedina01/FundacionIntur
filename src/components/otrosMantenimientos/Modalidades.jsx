import React, { useState, useEffect, useContext,useCallback  } from 'react';
import axios from 'axios';

import { useRouter } from 'next/router';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador

import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionModalidad } from "../../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from "../../hooks/useModal";
import { obtenerEstados } from "../../utils/api"; // Importar la función

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
  const modalidadesPerPage = 8;  // cantidad de modalidades por página
  const [searchQuery, setSearchQuery] = useState('');


  // Filtros del buscador por nombre
  const filteredModalidades = modalidades.filter(modalidad =>
    modalidad.Nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

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


  const exportToExcel = async () => {
    // 1️⃣ Crear un nuevo libro y hoja de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Modalidades");
  
    // 2️⃣ Definir las columnas y encabezados
    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Descripción", key: "Descripcion", width: 40 },
      { header: "Duración", key: "Duracion", width: 15 },
      { header: "Horario", key: "Horario", width: 20 },
    ];
  
    // 3️⃣ Transformar los datos antes de agregarlos
    const exportData = currentModalidades.map((modalidad) => ({
      ID: modalidad.Id_Modalidad,
      Nombre: modalidad.Nombre,
      Descripcion: modalidad.Descripcion,
      Duracion: modalidad.Duracion,
      Horario: modalidad.Horario,
    }));
  
    // 4️⃣ Agregar los datos a la hoja de cálculo
    exportData.forEach((modalidad) => {
      worksheet.addRow(modalidad);
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
  
    saveAs(fileBlob, "Modalidades.xlsx");
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

  const handleClearSearch = () => {
  setSearchQuery("");
  setCurrentPage(1); // Reiniciar a la primera página
}; 

const handleSubmit = async (e) => {
    e.preventDefault();


    formData.Creado_Por = user.id;
   formData.Fecha_Creacion = obtenerFechaActual();

    formData.Modificado_Por = user.id;
    formData.Fecha_Modificacion = obtenerFechaActual();
   // formData.Estado = 1;
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
      resetForm();
    } catch (error) {
      toast.error('Error al guardar la modalidad:', error);
    }
  };

  const handleEdit = (modalidad) => {
    setFormData(modalidad);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Modalidad) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/modalidades', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Modalidad }),
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
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Modalidad' : 'Agregar Modalidad'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre" className="block mb-2 text-sm font-medium text-gray-700">Nombre de la Modalidad</label>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre de la Modalidad"
            value={formData.Nombre}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <label htmlFor="Descripcion" className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            name="Descripcion"
            placeholder="Descripción"
            value={formData.Descripcion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Duracion" className="block mb-2 text-sm font-medium text-gray-700">Duración</label>
          <input
            type="text"
            name="Duracion"
            placeholder="Duración"
            value={formData.Duracion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Horario" className="block mb-2 text-sm font-medium text-gray-700">Horario</label>
          <input
            type="text"
            name="Horario"
            placeholder="Horario"
            value={formData.Horario}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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

      {/* Columna derecha: Tabla de modalidades */}
      <div className="w-2/3">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        >
          Exportar a Excel
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 mb-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
 <table className="xls_style-excel-table">
  <thead className="bg-slate-200">
    <tr>
      <th className="py-4 px-6 text-left">Id Modalidad</th>
      <th className="py-4 px-20 text-left">Nombre</th>
      <th className="py-4 px-16 text-left">Descripción</th>
      <th className="py-4 px-6 text-left">Duración</th>
      <th className="py-4 px-16 text-left">Horario</th>
      <th className="py-4 px-16 text-left">Estado</th> {/* Nueva columna para estado */}
      <th className="py-4 px-6 text-center">Acciones</th>
    </tr>
  </thead>
  {permisos?.Permiso_Consultar === "1" && (
  <tbody>
    {currentModalidades.map((modalidad) => {
      // Obtener la descripción del estado correspondiente
      const estadoDescripcion = estados.find((estado) => estado.Codigo_Estado === modalidad.Estado)?.Nombre_Estado || "Desconocido";

      return (
        <tr key={modalidad.Id_Modalidad} className="border-b hover:bg-gray-100 transition duration-300">
          <td className="py-4 px-6">{modalidad.Id_Modalidad}</td>
          <td className="py-4 px-6"><strong>{modalidad.Nombre}</strong></td>
          <td className="py-4 px-6">{modalidad.Descripcion}</td>
          <td className="py-4 px-6">{modalidad.Duracion}</td>
          <td className="py-4 px-6">{modalidad.Horario}</td>
          <td className="py-4 px-6">{estadoDescripcion}</td> {/* Se muestra la descripción del estado */}
          <td className="py-4 px-6 flex justify-center space-x-2">
            {permisos.Permiso_Actualizar === "1" && (
              <button 
                onClick={() => handleEdit(modalidad)} 
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
              >
                Editar
              </button>
            )}
            {permisos.Permiso_Eliminar === "1" && (
              <button 
                onClick={() => {
                  setFormData(modalidad);
                  showModal("modalConfirmacion");
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
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
        <div className="flex justify-between mt-4">
          <button
            onClick={prevPage}
            className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
          >
            Anterior
          </button>

          {/* Páginas */}
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(modalidades.length / modalidadesPerPage) }, (_, index) => (
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
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalidadesManagement;
