import React, { useState, useEffect, useContext,useCallback } from 'react';
import axios from 'axios';
//import * as XLSX from 'xlsx';
import { useRouter } from 'next/router';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Para descargar el archivo en el navegador

import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionSeccion } from "../../../models/ReglasValidacionModelos"; // Importamos las reglas del modelo
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from "../../hooks/useModal";
import { obtenerEstados } from "../../utils/api"; // Importar la función


const SeccionManagement = () => {
    const [estados, setEstados] = useState([]);
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [modalidades, setModalidades] = useState([]);
  const router = useRouter(); // Inicializar router dentro del useEffect
  const [userProfile, setUserProfile] = useState(null);  // para restringir acceso
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]); // Estado para grados
              // ------------------- FUNCIONALIDAD ROLES----------------------//
              const { user } = useContext(AuthContext); // Usuario logueado
              const [permisos, setPermisos] = useState(null); //obtener permiso
              const [error, setError] = useState(null); //mostrar error de permiso
              const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
            // ------------------------------------------------------------//
  
  const [formData, setFormData] = useState({
    Id_Seccion: '',
    Nombre_Seccion: '',
    Id_Grado: '',
  });
  const [isEditing, setIsEditing] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
  const seccionesPerPage = 8;  // cantidad de secciones por página
  const [searchQuery, setSearchQuery] = useState('');

   // MANEJO DE ACCESO //
   // Recupera el perfil del usuario
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (res.ok) {
        setUserProfile(data);
      } else {
        console.error('Error al obtener el perfil', data);
      }
    } catch (error) {
      console.error('Error de red', error);
    }
  };
  fetchProfile();
}, []);

// Función para verificar si el usuario está autorizado
const isAuthorized = (roles) => {
  return userProfile && roles.includes(userProfile.rol);
};

// Controlar el acceso de usuarios no autorizados
useEffect(() => {

  if (userProfile && !isAuthorized(['Administrador'])) {
    // Si no está autorizado, redirige a la página de inicio
    alert('Acceso denegado: No tienes permisos para acceder a esta sección.');
    router.push('/inicio'); // Redirige al inicio
  }
}, [userProfile]); // Se ejecuta cuando se carga el perfil del usuario.

  // Filtros del buscador por nombre de sección
  const filteredSecciones = secciones.filter(seccion =>
    seccion.Nombre_Seccion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación para secciones filtradas
  const indexOfLastSeccion = currentPage * seccionesPerPage;
  const indexOfFirstSeccion = indexOfLastSeccion - seccionesPerPage;
  const currentSecciones = filteredSecciones.slice(indexOfFirstSeccion, indexOfLastSeccion);

  // Funciones de navegación de páginas
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredSecciones.length / seccionesPerPage)) {
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
  //   const exportData = currentSecciones.map(seccion => ({
  //     ID: seccion.Id_Seccion,
  //     Nombre_Seccion: seccion.Nombre_Seccion,
  //     Id_Grado: seccion.Id_Grado,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Secciones');

  //   XLSX.writeFile(workbook, 'Secciones.xlsx');
  // };


const exportToExcel = async () => {
  // 1️⃣ Crear un nuevo libro y hoja de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Secciones");

  // 2️⃣ Definir las columnas y encabezados
  worksheet.columns = [
    { header: "ID", key: "ID", width: 10 },
    { header: "Nombre Sección", key: "Nombre_Seccion", width: 30 },
    { header: "ID Grado", key: "Id_Grado", width: 15 },
  ];
  const cargarEstados = useCallback(async () => {
    //  setLoading(true);
      const data = await obtenerEstados("GENÉRICO");
      setEstados(data);
    //  setLoading(false);
  }, []); // 🔥 Se ejecu
  

  // 3️⃣ Transformar los datos antes de agregarlos
  const exportData = currentSecciones.map((seccion) => ({
    ID: seccion.Id_Seccion,
    Nombre_Seccion: seccion.Nombre_Seccion,
    Id_Grado: seccion.Id_Grado,
  }));

  // 4️⃣ Agregar los datos a la hoja de cálculo
  exportData.forEach((seccion) => {
    worksheet.addRow(seccion);
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

  saveAs(fileBlob, "Secciones.xlsx");
};

  const cargarEstados = useCallback(async () => {
  //  setLoading(true);
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  //  setLoading(false);
}, []); // 🔥 Se ejecu


  // Fetch de secciones desde el backend
  useEffect(() => {
    cargarEstados();
    fetchSecciones();
    fetchGrados();  // Fetch para obtener los grados
    fetchPermisos();
  }, [user]);

  // -------- PERMISOS -------- //
  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 13; // ID del objeto relacionado con esta página
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

  const fetchSecciones = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/seccion');
      setSecciones(response.data);
    } catch (error) {
      console.error('Error fetching secciones:', error);
    }
  };

  // Fetch para obtener los grados
  const fetchGrados = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/grado'); // Asume que tienes un endpoint para obtener los grados
      setGrados(response.data);
    } catch (error) {
      console.error('Error fetching grados:', error);
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
        formData.Estado = Number( formData.Estado )//|| "ACT"; // Estado por defecto
   
       const errores = validarFormulario(formData, reglasValidacionSeccion);
    
          if (errores.length > 0) {
         
          //toast.error(errores.join("\n"), error);
            return;
          }
    try {
      if (isEditing) {
        const response = await fetch(`/api/apis_mantenimientos/seccion`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la sección');
        }

        toast.success('Sección actualizada exitosamente',
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
        const response = await fetch('/api/apis_mantenimientos/seccion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear la sección');
        }

        toast.success('Sección agregada exitosamente',
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

      fetchSecciones();
      resetForm();
    } catch (error) {
      toast.error('Error al guardar la sección:', error);
    }
  };

  const handleEdit = (seccion) => {
    setFormData(seccion);
    setIsEditing(true);
  };

  const handleDelete = async (Id_Seccion) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/seccion', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Seccion }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la sección');
      }
      closeModal("modalConfirmacion");
      fetchSecciones();
      resetForm();
      toast.error('Sección eliminada exitosamente', {
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
      console.error('Error al eliminar la sección:', error);
    }
  };

  const resetForm = () => {
    setFormData({ Id_Seccion: '', Nombre_Seccion: '', Id_Grado: '' });
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
      Sin permisos para Acceder a la Pantalla de Secciones
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
        <center><h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Sección' : 'Agregar Sección'}</h2></center>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Nombre_Seccion" className="block mb-2 text-sm font-medium text-gray-700">Nombre de la Sección</label>
          <input
            type="text"
            name="Nombre_Seccion"
            placeholder="Nombre de la Sección"
            value={formData.Nombre_Seccion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="Id_Grado" className="block mb-2 text-sm font-medium text-gray-700">ID del Grado</label>
          <select
            name="Id_Grado"
            value={formData.Id_Grado}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un grado</option>
            {grados.map((grado) => (
              <option key={grado.Id_Grado} value={grado.Id_Grado}>
                {grado.Nombre}
              </option>
            ))}
          </select>

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

      {/* Columna derecha: Tabla de Secciones */}
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
  onConfirm={() => handleDelete(formData?.Id_Seccion)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Nombre_Seccion}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>

<table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
  <thead className="bg-slate-200">
    <tr>
      <th className="py-4 px-6 text-left">Nombre Sección</th>
      <th className="py-4 px-6 text-left">ID Grado</th>
      <th className="py-4 px-6 text-left">Estado</th> {/* Nueva columna */}
      <th className="py-4 px-6 text-left">Acciones</th>
    </tr>
  </thead>
  {permisos?.Permiso_Consultar === "1" && (
    <tbody>
      {currentSecciones.map((seccion) => (
        <tr key={seccion.Id_Seccion}>
          <td className="py-4 px-6">{seccion.Nombre_Seccion}</td>
          <td className="py-4 px-6">{seccion.Id_Grado}</td>

          {/* 📌 Mostrar el estado con su descripción */}
          <td className="py-4 px-6">
            {estados.find((estado) => estado.Codigo_Estado === seccion.Estado)?.Nombre_Estado || "Desconocido"}
          </td>

          <td className="py-4 px-6 space-x-2">
            {permisos.Permiso_Actualizar === "1" && (
              <button
                onClick={() => handleEdit(seccion)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
              >
                Editar
              </button>
            )}
            {permisos.Permiso_Eliminar === "1" && (
              <button
                onClick={() => {
                  setFormData(seccion);
                  showModal("modalConfirmacion");
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
              >
                X
              </button>
            )}
          </td>
        </tr>
      ))}
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
    {Array.from({ length: Math.ceil(filteredSecciones.length / seccionesPerPage) }, (_, index) => (
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

export default SeccionManagement;
