import React, { useState, useEffect, useContext,useCallback } from 'react';
import axios from 'axios';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador
import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionBeneficio } from "../../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from "../../hooks/useModal";
import { obtenerEstados } from "../../utils/api"; // Importar la función
import { exportToExcel } from "../../utils/exportToExcel"; // Importar la función
const LineaBeneficioManagement = () => {
    const [estados, setEstados] = useState([]);
  
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [modalidades, setModalidades] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
            // ------------------- FUNCIONALIDAD ROLES----------------------//
            const { user } = useContext(AuthContext); // Usuario logueado
            const [permisos, setPermisos] = useState(null); //obtener permiso
            const [error, setError] = useState(null); //mostrar error de permiso
            const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
          // ------------------------------------------------------------//
    
  const [formData, setFormData] = useState({
    Id_Beneficio: '',
    Nombre_Beneficio: '',
    Tipo_Beneficio: '',
    Monto_Beneficio: '',
    Responsable_Beneficio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const beneficiosPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');


  // Filtrado de beneficios por Nombre_Beneficio
  const filteredBeneficios = beneficios.filter(beneficio =>
    beneficio.Nombre_Beneficio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastBeneficio = currentPage * beneficiosPerPage;
  const indexOfFirstBeneficio = indexOfLastBeneficio - beneficiosPerPage;
  const currentBeneficios = filteredBeneficios.slice(indexOfFirstBeneficio, indexOfLastBeneficio);

  // Paginación
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredBeneficios.length / beneficiosPerPage)) {
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

  // Exportación a Excel
  // const exportToExcel = () => {
  //   const exportData = currentBeneficios.map(beneficio => ({
  //     ID: beneficio.Id_Beneficio,
  //     Nombre: beneficio.Nombre_Beneficio,
  //     Tipo: beneficio.Tipo_Beneficio,
  //     Monto: beneficio.Monto_Beneficio,
  //     Responsable: beneficio.Responsable_Beneficio,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Líneas de Beneficio');

  //   XLSX.writeFile(workbook, 'LineasBeneficio.xlsx');
  // };

const exportToExcelOld = async () => {
  // 1️⃣ Crear un nuevo libro y hoja de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Líneas de Beneficio");

  // 2️⃣ Definir las columnas y encabezados
  worksheet.columns = [
    { header: "ID", key: "ID", width: 10 },
    { header: "Nombre", key: "Nombre", width: 30 },
    { header: "Tipo", key: "Tipo", width: 20 },
    { header: "Monto", key: "Monto", width: 15 },
    { header: "Responsable", key: "Responsable", width: 30 },
  ];

  // 3️⃣ Transformar los datos antes de agregarlos
  const exportData = currentBeneficios.map((beneficio) => ({
    ID: beneficio.Id_Beneficio,
    Nombre: beneficio.Nombre_Beneficio,
    Tipo: beneficio.Tipo_Beneficio,
    Monto: beneficio.Monto_Beneficio,
    Responsable: beneficio.Responsable_Beneficio,
  }));

  // 4️⃣ Agregar los datos a la hoja de cálculo
  exportData.forEach((beneficio) => {
    worksheet.addRow(beneficio);
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

  saveAs(fileBlob, "LineasBeneficio.xlsx");
};


const exportBeneficios = async () => {
    // 📌 Definir el nombre del archivo y título del reporte
    const fileName = "LineasBeneficio.xlsx";
    const title = "Reporte de Líneas de Beneficio";

    // 📌 Definir los encabezados de la tabla
    const headers = [
        { header: "ID", key: "ID", width: 10 },
        { header: "Nombre", key: "Nombre", width: 30 },
        { header: "Tipo", key: "Tipo", width: 20 },
        { header: "Monto", key: "Monto", width: 15 },
        { header: "Responsable", key: "Responsable", width: 30 },
        { header: "Estado", key: "Estado", width: 15 }, // Se añade la columna Estado
    ];

    // 📌 Transformar los datos antes de exportar
    const data = currentBeneficios.map((beneficio) => ({
        ID: beneficio.Id_Beneficio,
        Nombre: beneficio.Nombre_Beneficio,
        Tipo: beneficio.Tipo_Beneficio,
        Monto: beneficio.Monto_Beneficio,
        Responsable: beneficio.Responsable_Beneficio,
        Estado: beneficio.Estado === "1" ? "Activo" : "Inactivo", // Convertir estado
    }));

    // 📌 Llamar la función reutilizable para generar el Excel
    await exportToExcel({ fileName, title, headers, data });
};


  const cargarEstados = useCallback(async () => {
  //  setLoading(true);
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  //  setLoading(false);
}, []); // 🔥 Se ejecu

  // Fetch de beneficios desde el backend
  useEffect(() => {
    cargarEstados
    fetchBeneficios();
    fetchPermisos();

  }, [user]);

 // -------- PERMISOS -------- //
 const fetchPermisos = async () => {
  try {
    if (user) {
      const idObjeto = 10; // ID del objeto relacionado con esta página
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



  const fetchBeneficios = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/lineas_beneficio');
      setBeneficios(response.data);
    } catch (error) {
      console.error('Error fetching beneficios:', error);
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
        formData.Estado = 1;
       const errores = validarFormulario(formData, reglasValidacionBeneficio);
    
          if (errores.length > 0) {
         
          //toast.error(errores.join("\n"), error);
            return;
          }
         
    try {
      if (isEditing) {
        const response = await fetch('/api/apis_mantenimientos/lineas_beneficio', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el beneficio');
        }

        setUpdateNotification('Beneficio actualizado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/apis_mantenimientos/lineas_beneficio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el beneficio');
        }

        setNotification('Beneficio agregado exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchBeneficios();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el beneficio:', error);
    }
  };

  const handleEdit = (beneficio) => {
    setFormData(beneficio);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Beneficio) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/lineas_beneficio', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Beneficio }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el beneficio');
      }
      closeModal("modalConfirmacion");
      fetchBeneficios();
      resetForm();
      setDeleteNotification('Beneficio eliminado exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el beneficio:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Beneficio: '', Nombre_Beneficio: '', Tipo_Beneficio: '', Monto_Beneficio: '', Responsable_Beneficio: '' });
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
      Sin permisos para Acceder a la Pantalla de Lineas de Beneficio
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
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Beneficio' : 'Agregar Beneficio'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre_Beneficio" className="block mb-2 text-sm font-medium text-gray-700">Nombre del Beneficio</label>
          <input
            type="text"
            name="Nombre_Beneficio"
            placeholder="Nombre del Beneficio"
            value={formData.Nombre_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Tipo_Beneficio" className="block mb-2 text-sm font-medium text-gray-700">Tipo de Beneficio</label>
          <input
            type="text"
            name="Tipo_Beneficio"
            placeholder="Tipo de Beneficio"
            value={formData.Tipo_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Monto_Beneficio" className="block mb-2 text-sm font-medium text-gray-700">Monto del Beneficio</label>
          <input
            type="text"
            name="Monto_Beneficio"
            placeholder="Monto del Beneficio"
            value={formData.Monto_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Responsable_Beneficio" className="block mb-2 text-sm font-medium text-gray-700">Responsable del Beneficio</label>
          <input
            type="text"
            name="Responsable_Beneficio"
            placeholder="Responsable del Beneficio"
            value={formData.Responsable_Beneficio}
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

        {/* Notificaciones */}
        {notification && <div className="mt-4 text-green-600">{notification}</div>}
        {updateNotification && <div className="mt-4 text-blue-600">{updateNotification}</div>}
        {deleteNotification && <div className="mt-4 text-red-600">{deleteNotification}</div>}
      </div>

      {/* Columna derecha: Tabla de beneficios */}
      <div className="w-2/3">
        <button
          onClick={exportBeneficios}
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
  onConfirm={() => handleDelete(formData?.Id_Beneficio)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Nombre_Beneficio}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>

<table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
  <thead className="bg-slate-200">
    <tr>
      <th className="p-3 border-b">ID</th>
      <th className="p-3 border-b">Nombre del Beneficio</th>
      <th className="p-3 border-b">Tipo de Beneficio</th>
      <th className="p-3 border-b">Monto del Beneficio</th>
      <th className="p-3 border-b">Responsable del Beneficio</th>
      <th className="p-3 border-b">Estado</th> {/* ✅ Nueva columna de Estado */}
      <th className="p-3 border-b">Acciones</th>
    </tr>
  </thead>

  {permisos?.Permiso_Consultar === "1" && ( 
    <tbody>
      {currentBeneficios.map((beneficio) => {
        // Buscar el estado correspondiente en el diccionario de estados
        const estado = estados.find(e => e.Codigo_Estado === beneficio.Estado);

        return (
          <tr key={beneficio.Id_Beneficio} className="hover:bg-slate-100 transition-colors">
            <td className="p-3 border-b">{beneficio.Id_Beneficio}</td>
            <td className="p-3 border-b">{beneficio.Nombre_Beneficio}</td>
            <td className="p-3 border-b">{beneficio.Tipo_Beneficio}</td>
            <td className="p-3 border-b">{beneficio.Monto_Beneficio}</td>
            <td className="p-3 border-b">{beneficio.Responsable_Beneficio}</td>

            {/* ✅ Nueva Celda para Estado */}
            <td className="p-3 border-b">{estado ? estado.Nombre_Estado : "Desconocido"}</td>

            <td className="p-3 border-b flex space-x-2">
              {permisos.Permiso_Actualizar === "1" && ( 
                <button
                  onClick={() => handleEdit(beneficio)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
              )}
              {permisos.Permiso_Eliminar === "1" && (
                <button
                  onClick={() => {
                    setFormData(beneficio);
                    showModal("modalConfirmacion");
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
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
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {/* Páginas */}
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(filteredBeneficios.length / beneficiosPerPage) }, (_, index) => (
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
            disabled={currentPage === Math.ceil(filteredBeneficios.length / beneficiosPerPage)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineaBeneficioManagement;
