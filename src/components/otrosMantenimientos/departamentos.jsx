import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador
import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionDepartamento } from "../../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from "../../hooks/useModal";

const Departamentos = () => {
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [modalidades, setModalidades] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
        // ------------------- FUNCIONALIDAD ROLES----------------------//
        const { user } = useContext(AuthContext); // Usuario logueado
        const [permisos, setPermisos] = useState(null); //obtener permiso
        const [error, setError] = useState(null); //mostrar error de permiso
        const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
      // ------------------------------------------------------------//
     
  const [formData, setFormData] = useState({
    Id_Departamento: '',
    Nombre_Departamento: '',
  });
  const [isEditing, setIsEditing] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
  const departamentosPerPage = 9;
  const [searchQuery, setSearchQuery] = useState('');


  // Filtrado de departamentos por nombre
  const filteredDepartamentos = departamentos.filter(departamento =>
    departamento.Nombre_Departamento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastDepartamento = currentPage * departamentosPerPage;
  const indexOfFirstDepartamento = indexOfLastDepartamento - departamentosPerPage;
  const currentDepartamentos = filteredDepartamentos.slice(indexOfFirstDepartamento, indexOfLastDepartamento);

  // Paginación
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredDepartamentos.length / departamentosPerPage)) {
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
  //   const exportData = departamentos.map(departamento => ({
  //     ID: departamento.Id_Departamento,
  //     Nombre: departamento.Nombre_Departamento,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Departamentos');

  //   XLSX.writeFile(workbook, 'Departamentos.xlsx');
  // };


  const exportToExcel = async () => {
    // 1️⃣ Crear un nuevo libro y hoja de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Departamentos");
  
    // 2️⃣ Definir las columnas y encabezados
    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Nombre", key: "Nombre", width: 30 },
    ];
  
    // 3️⃣ Transformar los datos antes de agregarlos
    const exportData = departamentos.map((departamento) => ({
      ID: departamento.Id_Departamento,
      Nombre: departamento.Nombre_Departamento,
    }));
  
    // 4️⃣ Agregar los datos a la hoja de cálculo
    exportData.forEach((departamento) => {
      worksheet.addRow(departamento);
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
  
    saveAs(fileBlob, "Departamentos.xlsx");
  };
  

  // Fetch de departamentos desde el backend
  useEffect(() => {
    fetchDepartamentos();
    fetchPermisos();
  }, [user]);

    // -------- PERMISOS -------- //
const fetchPermisos = async () => {
  try {
    if (user) {
      const idObjeto = 7; // ID del objeto relacionado con esta página
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

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      toast.error('Error al cargar los departamentos');
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
        formData.Estado = 1;
       const errores = validarFormulario(formData, reglasValidacionDepartamento);
    
          if (errores.length > 0) {
         
            toast.error(errores.join("\n"), error);
            return;
          }
    try {
      if (isEditing) {
        const response = await fetch('/api/apis_mantenimientos/departamentos', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el departamento');
        }

        toast.success('Departamento actualizado exitosamente', {
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
        ;
      } else {
        const response = await fetch('/api/apis_mantenimientos/departamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el departamento');
        }

        toast.success('Departamento agregado exitosamente',
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
        ;
      }

      fetchDepartamentos();
      resetForm();
    } catch (error) {
      toast.error('Error al guardar el departamento:', error);
    }
  };

  const handleEdit = (departamento) => {
    setFormData(departamento);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Departamento) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/departamentos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Departamento }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el departamento');
      }

      closeModal("modalConfirmacion");
      fetchDepartamentos();
      resetForm();
      toast.error('Departamento eliminado exitosamente', {
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
      toast.error('Error al eliminar el departamento');
    }
  };

  const resetForm = () => {
    setFormData({ Id_Departamento: '', Nombre_Departamento: '' });
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
      Sin permisos para Acceder a la Pantalla de Departamentos
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
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Departamento' : 'Agregar Departamento'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre_Departamento" className="block mb-2 text-sm font-medium text-gray-700">Nombre del Departamento</label>
          <input
            type="text"
            name="Nombre_Departamento"
            placeholder="Nombre del Departamento"
            value={formData.Nombre_Departamento}
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

      {/* Columna derecha: Tabla de departamentos */}
      <div className="w-full max-w-3xl mx-auto">
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
  onConfirm={() => handleDelete(formData?.Id_Departamento)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Nombre_Departamento}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>

        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Departamento</th>
              <th className="py-2 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          {permisos?.Permiso_Consultar === "1" && (
          <tbody>
            {currentDepartamentos.map((departamento) => (
              <tr key={departamento.Id_Departamento}>
                <td className="py-2 px-4">{departamento.Id_Departamento}</td>
                <td className="py-2 px-4">{departamento.Nombre_Departamento}</td>
                <td className="p-3 border-b flex space-x-2">
                {permisos.Permiso_Actualizar === "1" && (
                  <button
                    onClick={() => handleEdit(departamento)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
                  >
                    Editar
                  </button>)}
                  {permisos.Permiso_Eliminar === "1" && (
                  <button
              
                    onClick={() => {
                      setFormData(departamento)
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
        <div className="mt-4 flex justify-between">
          <button onClick={prevPage} className="px-4 py-2 bg-gray-300 rounded-lg">Anterior</button>
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(filteredDepartamentos.length / departamentosPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-2 py-2 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={nextPage} className="px-4 py-2 bg-gray-300 rounded-lg">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default Departamentos;
