import React, { useState, useEffect, useContext,useCallback } from 'react';
import axios from 'axios';

import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from "../../components/basicos/SearchBar"; 
import Pagination from "../../components/basicos/Pagination"; 
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador

import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionMunicipio } from "../../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from "../../hooks/useModal";
import { obtenerEstados } from "../../utils/api"; // Importar la función
import { exportToExcel } from "../../utils/exportToExcel"; // Importar la función
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";
const MunicipioManagement = () => {
    const [estados, setEstados] = useState([]);
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [modalidades, setModalidades] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]); // Para cargar los departamentos
             // ------------------- FUNCIONALIDAD ROLES----------------------//
             const { user } = useContext(AuthContext); // Usuario logueado
             const [permisos, setPermisos] = useState(null); //obtener permiso
             const [error, setError] = useState(null); //mostrar error de permiso
             const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
           // ------------------------------------------------------------//
 
  const [formData, setFormData] = useState({
    Id_Municipio: '',
    Id_Departamento: '',
    Nombre_Municipio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
  const municipiosPerPage = 12;
  const [searchQuery, setSearchQuery] = useState('');


  // Filtrado de municipios por nombre
  const filteredMunicipios = municipios.filter(municipio =>
    municipio.Nombre_Municipio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastMunicipio = currentPage * municipiosPerPage;
  const indexOfFirstMunicipio = indexOfLastMunicipio - municipiosPerPage;
  const currentMunicipios = filteredMunicipios.slice(indexOfFirstMunicipio, indexOfLastMunicipio);

  // Paginación
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredMunicipios.length / municipiosPerPage)) {
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
  //   const exportData = municipios.map(municipio => ({
  //     ID: municipio.Id_Municipio,
  //     Departamento: municipio.Id_Departamento,
  //     Nombre: municipio.Nombre_Municipio,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Municipios');

  //   XLSX.writeFile(workbook, 'Municipios.xlsx');
  // };


  const exportToExcelOld = async () => {
    // 1️⃣ Crear un nuevo libro y hoja de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Municipios");
  
    // 2️⃣ Definir las columnas y encabezados
    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Departamento", key: "Departamento", width: 25 },
      { header: "Nombre", key: "Nombre", width: 30 },
    ];
  
    // 3️⃣ Transformar los datos antes de agregarlos
    const exportData = municipios.map((municipio) => ({
      ID: municipio.Id_Municipio,
      Departamento: municipio.Id_Departamento,
      Nombre: municipio.Nombre_Municipio,
    }));
  
    // 4️⃣ Agregar los datos a la hoja de cálculo
    exportData.forEach((municipio) => {
      worksheet.addRow(municipio);
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
  
    saveAs(fileBlob, "Municipios.xlsx");
  };
  
 

  const exportMunicipios = async () => {
      // 📌 Definir el nombre del archivo y título del reporte
      const fileName = "Municipios.xlsx";
      const title = "Reporte de Municipios";
  
      // 📌 Definir los encabezados de la tabla
      const headers = [
          { header: "ID", key: "ID", width: 10 },
          { header: "Departamento", key: "Departamento", width: 25 },
          { header: "Nombre", key: "Nombre", width: 30 },
          { header: "Estado", key: "Estado", width: 15 }, // Se añade la columna Estado
      ];
  
      // 📌 Transformar los datos antes de exportar
      const data = municipios.map((municipio) => ({
          ID: municipio.Id_Municipio,
          Departamento: municipio.Id_Departamento,
          Nombre: municipio.Nombre_Municipio,
          Estado: municipio.Estado === "1" ? "Activo" : "Inactivo", // Convertir estado
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
  

  // Fetch de municipios y departamentos desde el backend
  useEffect(() => {
    cargarEstados()
    fetchMunicipios();
    fetchDepartamentos();
    fetchPermisos();
  }, [user]);

  // -------- PERMISOS -------- //
  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 12; // ID del objeto relacionado con esta página
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


  const fetchMunicipios = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/municipios');
      setMunicipios(response.data);
    } catch (error) {
      toast.error('Error fetching municipios:', error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      toast.error('Error fetching departamentos:', error);
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
        formData.Estado = Number(formData.Estado);
       const errores = validarFormulario(formData, reglasValidacionMunicipio);
    
          if (errores.length > 0) {
         
          //toast.error(errores.join("\n"), error);
            return;
          }
         
    try {
      if (isEditing) {
        const response = await fetch('/api/apis_mantenimientos/municipios', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el municipio');
        }

        toast.success('Municipio actualizado exitosamente',
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
        const response = await fetch('/api/apis_mantenimientos/municipios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el municipio');
        }

        toast.success('Municipio agregado exitosamente',
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

      fetchMunicipios();
      resetForm();
    } catch (error) {
      toast.error('Error al guardar el municipio:', error);
    }
  };

  const handleEdit = (municipio) => {
    setFormData(municipio);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Municipio) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/municipios', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Municipio }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el municipio');
      }
      closeModal("modalConfirmacion");
      fetchMunicipios();
      resetForm();
      toast.error('Municipio eliminado exitosamente',{
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
      toast.error('Error al eliminar el municipio:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Municipio: '', Id_Departamento: '', Nombre_Municipio: '' });
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
      Sin permisos para Acceder a la Pantalla de Municipios
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
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Municipio' : 'Agregar Municipio'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Id_Departamento" className="block mb-2 text-sm font-medium text-gray-700">Departamento</label>
          <select
            name="Id_Departamento"
            value={formData.Id_Departamento}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar Departamento</option>
            {departamentos.map((departamento) => (
              <option key={departamento.Id_Departamento} value={departamento.Id_Departamento}>
                {departamento.Nombre_Departamento}
              </option>
            ))}
          </select>

          <label htmlFor="Nombre_Municipio" className="block mb-2 text-sm font-medium text-gray-700">Nombre del Municipio</label>
          <input
            type="text"
            name="Nombre_Municipio"
            placeholder="Nombre del Municipio"
            value={formData.Nombre_Municipio}
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

      {/* Columna derecha: Tabla de municipios */}
      <div className="w-full max-w-3xl mx-auto">
      <SearchBar 
  title="Listado de Municipios" 
  
  searchQuery={{ general: searchQuery }} 
  setSearchQuery={(newQuery) => setSearchQuery(newQuery.general)} 
  handleClearSearch={() => setSearchQuery("")} 
  onExport={exportMunicipios} 
/>

        <ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Municipio)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Nombre_Municipio}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>


<table className="xls_style-excel-table">
  <thead>
    <tr className="bg-gray-200">
      <th className="py-2 px-4 text-left">ID</th>
      <th className="py-2 px-4 text-left">Departamento</th>
      <th className="py-2 px-4 text-left">Municipio</th>
      <th className="py-2 px-4 text-left">Estado</th> {/* ✅ Nueva columna de Estado */}
      <th className="py-2 px-4 text-left">Acciones</th>
    </tr>
  </thead>

  {permisos?.Permiso_Consultar === "1" && (
    <tbody>
      {currentMunicipios.map((municipio) => {
        // Buscar el estado correspondiente en el diccionario de estados
        const estado = estados.find(e => e.Codigo_Estado === municipio.Estado);

        return (
          <tr key={municipio.Id_Municipio}>
            <td className="py-2 px-4">{municipio.Id_Municipio}</td>
            <td className="py-2 px-4">{municipio.Nombre_Departamento}</td>
            <td className="py-2 px-4">{municipio.Nombre_Municipio}</td>
            
            {/* ✅ Nueva Celda para Estado */}
            <td className="py-2 px-4">{estado ? estado.Nombre_Estado : "Desconocido"}</td>

            <td className="p-3 border-b flex space-x-2">
              {permisos.Permiso_Actualizar === "1" && (
                <button
                  onClick={() => handleEdit(municipio)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
                >
                  Editar
                </button>
              )}
              {permisos.Permiso_Eliminar === "1" && (
                <button
                  onClick={() => {
                    setFormData(municipio);
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


<Pagination
  currentPage={currentPage}
  totalItems={filteredMunicipios.length}
  itemsPerPage={municipiosPerPage}
  setPage={setPage}
  prevPage={prevPage}
  nextPage={nextPage}
/>

      </div>
    </div>
  );
};

export default MunicipioManagement;
