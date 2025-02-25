import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon,ArrowDownCircleIcon, UserPlusIcon, PencilSquareIcon,TrashIcon  } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

import Select from "react-select";

import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import useModal from "../hooks/useModal"; 
import { validarFormulario } from "../utils/validaciones";
import { reglasValidacion } from "../../models/ObjetoDto"; // Importamos las reglas del modelo



const GraduandoForm = () => {
  const [graduandos, setGraduandos] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // ✅ Inicializar con null
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [formData, setFormData] = useState({
    Anio: '',
    Fecha_Inicio: '',
    Fecha_Final: '',
    Creado_Por: '',
    Estudiante: null,
    Id_Estudiante:null
  });
    
  useEffect(() => {
    document.title = "Graduandos";
}, []);

          // ------------------- FUNCIONALIDAD ROLES----------------------//
          const { user } = useContext(AuthContext); // Usuario logueado
          const [permisos, setPermisos] = useState(null); //obtener permiso
          const [error, setError] = useState(null); //mostrar error de permiso
          const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
        // ------------------------------------------------------------//
        const [estudiantes, setEstudiantes] = useState([]);
     
        const [isEditing, setIsEditing] = useState(false);
        const resetForm = () => {
          setFormData({ 

            Anio: '',
            Fecha_Inicio: '',
            Fecha_Final: '',
            Creado_Por: '',
            Estudiante: null,
            Id_Estudiante:null

          });
          setIsEditing(false);
        };
        const [searchTerm, setSearchTerm] = useState("");
        
        const router = useRouter();

  useEffect(() => {
 
    fetchPermisos();
    fetchGraduandos();
   fetchEstudiantes();

  }, [user]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 14; // ID relacionado con matriculas
        const response = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto,
        });

        const permisosData = response.data;

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


  const exportToExcel = async (graduandos) => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Graduandos");
  
      // 📌 **Definir Encabezados**
      const headers = [
          { header: "ID Graduando", key: "Id_Graduando", width: 15 },
          { header: "Identidad Estudiante", key: "Identidad", width: 20 },
          { header: "Nombre Completo Estudiante", key: "NombreCompleto", width: 25 },
          { header: "Año", key: "Anio", width: 10 },
          { header: "Fecha de Inicio", key: "Fecha_Inicio", width: 18 },
          { header: "Fecha de Finalización", key: "Fecha_Final", width: 18 },
          { header: "Fecha de Creación", key: "Fecha_Creacion", width: 18 }
      ];
  
      // Asignar columnas al worksheet
      worksheet.columns = headers;
  
      // Aplicar estilos a los encabezados
      worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true, color: { argb: "FFFFFF" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
      });
  
      // 📌 **Agregar Datos al Excel**
      graduandos.forEach((graduando) => {
          worksheet.addRow({
              Id_Graduando: graduando.Id_Graduando,
              Identidad: graduando.Estudiante.Persona.Identidad,
              NombreCompleto: `${graduando.Estudiante.Persona.Primer_Nombre} ${graduando.Estudiante.Persona.Primer_Apellido}`,
              Anio: graduando.Anio,
              Fecha_Inicio: graduando.Fecha_Inicio ? new Date(graduando.Fecha_Inicio).toLocaleDateString("es-ES") : "-",
              Fecha_Final: graduando.Fecha_Final ? new Date(graduando.Fecha_Final).toLocaleDateString("es-ES") : "-",
              Fecha_Creacion: graduando.Fecha_Creacion ? new Date(graduando.Fecha_Creacion).toLocaleDateString("es-ES") : "-"
          });
      });
  
      // 📌 **Descargar el Archivo**
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "Graduandos.xlsx");
  };
  


  const fetchGraduandos = async () => {
    try {

    
      const response = await axios.get('/api/graduando');
      setGraduandos(response.data);
    } catch (error) {
      console.error('Error al obtener los graduandos:', error);
    }
  };


  const options = estudiantes.map((estudiante) => ({
    value: estudiante?.Id_Estudiante,
    label: `${estudiante?.Persona.Identidad} - ${estudiante?.Persona.Primer_Nombre} ${estudiante?.Persona.Primer_Apellido}`,
    estudiante,
  }));


  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, Estudiante: selectedOption.Estudiante,Id_Estudiante:selectedOption.estudiante?.Id_Estudiante });
  };
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get("/api/estudiantes");
      setEstudiantes(response.data);

       // Si hay un estudiante seleccionado, actualizarlo
    if (selectedStudent) {
      const updatedStudent = response.data.find(
        (e) => e.Id_Estudiante === selectedStudent.Id_Estudiante
      );
      setSelectedStudent(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe
  
      handleEdit(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe
    }
      console.log(response.data)
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    `${estudiante.Persona.Primer_Nombre} ${estudiante.Persona.Primer_Apellido} ${estudiante.Persona.Identidad}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDelete = async (Id_Graduando) => {
    try {
      const response = await fetch(`/api/graduando/${Id_Graduando}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Graduando }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la graduando');
      }
      closeModal("modalConfirmacion")
      fetchGraduandos();
      resetForm();
      toast.error('graduando eliminado exitosamente', {
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
      toast.error('Error al eliminar la graduando:', error);
    }
  };



  // Enviar datos del formulario para crear un nuevo graduando
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {


      if (!isEditing){

        await axios.post('/api/graduando', formData);
      }else{
        await axios.put(`/api/graduando/${formData.Id_Graduando}`, formData);
      }
 
      resetForm();
      // Recargar los graduandos después de agregar uno nuevo
      const response = await axios.get('/api/graduando');
      setGraduandos(response.data);
    } catch (error) {
      console.error('Error al crear un graduando:', error);
    }
  };

  // Función para exportar los datos de graduandos a Excel
  const exportToExcelold = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(graduandos);
    XLSX.utils.book_append_sheet(wb, ws, 'Graduandos');
    XLSX.writeFile(wb, 'graduandos.xlsx');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleEdit = (graduando) => {
    
    router.push({
      pathname: '/estudiante', // Ruta de la página destino
      query: {
        tab: 4,
        idEstudiante: graduando.Id_Estudiante,
      },
    });
  };

  const handlePredelete = (graduando) => {
    
   
  };

  if (sinPermisos) {
    return         <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
    <ShieldExclamationIcon className="h-12 w-12 mr-4" />
    <div>
      <h3 className="font-bold text-lg">
        Sin permisos para Acceder a la Pantalla de Grados
      </h3>
      <p>No tienes permisos para Acceder a la información.</p>
    </div>
  </div>
  }
  
  if (!permisos) {
    return <p>Cargando permisos...</p>;

  }



  const filteredGraduandos = graduandos.filter((graduando) => {
    // Convierte el objeto `graduando` en una cadena JSON para buscar en todas las propiedades
    const allProperties = JSON.stringify(graduando)?.toLowerCase();
  
    // Retorna true si el término de búsqueda está en alguna propiedad
    return allProperties.includes(searchTerm.toLowerCase());
  });



  return (
    <div>

  

      { (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
          Graduandos
        </h1>


    {/* Contenedor para la búsqueda y el botón de exportación */}
    <div className="mb-4 flex justify-between items-center">
          {/* Barra de búsqueda */}
          {permisos.Permiso_Consultar && (
            <div className="flex items-center w-1/2 border border-gray-300 rounded-lg p-3">
              <MagnifyingGlassIcon className="h-6 w-6 mr-1 text-black-500" />
              <input
                type="text"
                placeholder="Buscar graduando"
                value={searchTerm}
                onChange={handleSearch}
                className="border-none focus:ring-0 w-full p-1 text-gray-700 bg-transparent"
              />
            </div>
          )}
          <center>
            {permisos[1]?.insertar && (
              <button
                onClick={() => (window.location.href = "/estudiante")}
                className="block py-1 px-4 rounded bg-orange-500 text-white hover:bg-orange-600 focus:outline-none transition-colors"
              >
                <UserPlusIcon className="h-6 w-6 inline" /> Agregar Registro
              </button>
            )}
          </center>
          {permisos[1]?.actualizar && (
                        <Link href={`/estudiante`}>
                          <button className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition-colors">
                          <PencilSquareIcon className="h-6 w-6 inline" />  Editar Registros
                          </button>
                        </Link>
                      )}
          {/* Botón de exportación */}
          <div className="flex justify-center ml-4">
            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
             <ArrowDownCircleIcon className="h-6 w-6 inline" />    Exportar Excel
            </button>
          </div>
        </div>

        <ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Graduando)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={formData?.Estudiante?.Persona.Identidad}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>


      
          <table className="xls_style-excel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Identidad</th>
                <th>Nombre Completo</th>
                <th>Año</th>
                <th>Fecha de Inicio</th>
                <th>Fecha de Finalización</th>
       
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredGraduandos.length > 0 ? (
            filteredGraduandos.            
              map((graduando) => (
                <tr key={graduando.Id_Graduando}>
                  <td>{graduando.Id_Graduando}</td>
                  <td>{graduando.Estudiante.Persona.Identidad}</td>
                  <td>{graduando.Estudiante.Persona.Primer_Nombre + " "+ graduando.Estudiante.Persona.Primer_Apellido}</td>
                  <td>{graduando.Anio}</td>
                  <td>{graduando.Fecha_Inicio}</td>
                  <td>{graduando.Fecha_Final}</td>
          
                  <td>{graduando.Fecha_Creacion}</td>
                  <td className="p-3 border-b flex justify-center items-center space-x-2">
  {permisos.Permiso_Actualizar === "1" && (
    <button
      onClick={() => handleEdit(graduando)}


      
      className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      <PencilSquareIcon className="h-6 w-6" />
    </button>
  )}

  {permisos.Permiso_Eliminar === "1" && (
    <button
     
      onClick={() => {
        setFormData(graduando);
        showModal("modalConfirmacion")
      }}
      className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-700"
    >
      <TrashIcon className="h-6 w-6" />
    </button>
  )}
</td>
                </tr>
              ))):(
                <tr>
                  <td colSpan="7" className="text-center border px-4 py-2">
                    No se encontraron graduandos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}; 

export default GraduandoForm;
