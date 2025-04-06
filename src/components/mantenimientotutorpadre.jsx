// ✅ CÓDIGO REFACTORIZADO PARA TUTORES/PADRES CON ESTRUCTURA COMPLETA

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import useModal from '../hooks/useModal';
import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import {exportToExcel} from '../utils/exportToExcel';
import { obtenerEstados } from '../../src/utils/api';
import { getBase64ImageFromUrl } from '../../src/utils/getBase64ImageFromUrl';
import { validarFormulario } from '../utils/validaciones';

import { deepSearch } from '../../src/utils/deepSearch';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SearchBar from '../components/basicos/SearchBar';
import Pagination from '../components/basicos/Pagination';
import RelacionForm from '../components/basicos/RelacionForm';
import { PencilSquareIcon, TrashIcon,CheckIcon  } from '@heroicons/react/24/outline';
import { reglasValidacionEstudiante, reglasValidacionPersona ,reglasValidacionRelacion} from "../../models/ReglasValidacionModelos";
import { toast } from "react-toastify";
const TutorPadreManagement = () => {
  const { user } = useContext(AuthContext);
  const { modals, showModal, closeModal } = useModal();
  const [tutores, setTutores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    Id_Persona: '',
    Persona_Nombre: '',
    Persona_Apellido: '',
    Persona_Telefono: '',
    Persona_Direccion: '',
    Estado: '',
    Tipo_Persona: 2
  });
  const [isEditing, setIsEditing] = useState(false);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [estudiantes, setEstudiantes] = useState([]);
  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados('GENÉRICO');
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      const idObjeto = 15;
      const response = await axios.post('/api/api_permiso', {
        idRol: user.rol,
        idObjeto,
      });
      const data = response.data;
      if (Object.values(data).every(v => v !== '1')) setSinPermisos(true);
      else setPermisos(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener permisos');
    }
  };

  const fetchTutores = async () => {
    const response = await axios.get('/api/tutorpadre');
    setTutores(response.data);
  };

  useEffect(() => {
    if (user) {
      cargarEstados();
      fetchEstudiantes();
      fetchPermisos();
      fetchTutores();
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      Id_Persona: '', Persona_Nombre: '', Persona_Apellido: '', Persona_Telefono: '', Persona_Direccion: '', Estado: '', Tipo_Persona: 2
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarFormulario(formData, reglasValidacionTutores,"formtutor");
    if (errores.length > 0) return alert(errores.join('\n'));

    try {
      if (isEditing) {
        await axios.put(`/api/tutorpadre/${formData.Id_Persona}`, formData);
      } else {
        await axios.post('/api/tutorpadre', formData);
      }
      resetForm();
      closeModal('modalAddRow');
      fetchTutores();
    } catch (error) {
      alert('Error al guardar tutor');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tutorpadre/${id}`);
      fetchTutores();
      closeModal('modalConfirmacion');
    } catch (error) {
      alert('Error al eliminar tutor');
    }
  };

   const handleEdit = (data) => {
      console.log("handleEdit", data);
    
      const estudiante = estudiantes.find(est => Number( est.Id_Estudiante) ==Number( data.Id_Estudiante));
    
      // Buscar la relación por el ID que viene en data (puede ser `data.Id_Relacion` o `data.Relacion?.Id`)
      const relacion = estudiante?.Relaciones?.find(rel => rel.Id === data.Id || rel.Id === data.Id_Relacion);
    
      setIsEditing(true);
      if (relacion && relacion.Persona) {
        setPersonaDataRelacion({
          ...relacion.Persona,
          Id_Estudiante: data.Id_Estudiante,
          esNuevo: false,
          Id_Tipo_Persona: relacion.Persona.Id_Tipo_Persona,
          Id_Relacion: relacion.Id,
          Id: relacion.Id,
          Id_Persona: relacion.Persona.Id_Persona,
        });
    
        showModal("modalRelacion");
      } else {
        console.warn("No se encontró la relación o persona");
        toast.error("No se encontró la información del tutor o benefactor.");
      }
    };
 

  const handleExportTutores = async () => {
    const headers = [
      { header: 'Identidad', key: 'Identidad', width: 20 },
      { header: 'Nombre', key: 'Nombre', width: 30 },
      { header: 'Teléfono', key: 'Telefono', width: 20 },
      { header: 'Dirección', key: 'Direccion', width: 40 },
      { header: 'Estudiante', key: 'Estudiante', width: 30 },
      { header: 'Estado', key: 'Estado', width: 20 }
    ];
  
    const data = tutores.map((t) => {
      const estado = estados.find((e) => e.Codigo_Estado === t.Estado)?.Nombre_Estado || 'Desconocido';
  
      return {
        Identidad: " "+t.Identidad,
        Nombre: `${t.Persona_Nombre} ${t.Persona_Apellido}`,
        Telefono: t.Persona_Telefono,
        Direccion: t.Persona_Direccion,
        Estudiante: `${t.Estudiante_Nombre} ${t.Estudiante_Apellido}`,
        Estado: estado,
      };
    });
  
    await exportToExcel({
      fileName: "Tutores.xlsx",
      title: "Reporte de Tutores",
      headers,
      data,
      searchQuery // si aplicas filtros, pásalo desde tu componente
    });
  };



  const [personaDataRelacion, setPersonaDataRelacion] = useState({
    Primer_Nombre: "",
    Segundo_Nombre: "",
    Primer_Apellido: "",
    Segundo_Apellido: "",
    Sexo: "",
    Fecha_Nacimiento: "",
    Lugar_Nacimiento: "",
    Identidad: "",
    Creado_Por: "",
    Id_Departamento: 0,
    Id_Municipio: 0,
    Id_Estudiante: 0,
    esNuevo:true,
    Id_Tipo_Persona:1,
    Estado:1

  });


  const fetchEstudiantes = async () => {
    const res = await fetch('/api/estudiantes');
    const data = await res.json();
    setEstudiantes(data);
  };


  const handleTutorInputChange = (event) => {
const { name, value } = event.target;
setPersonaDataRelacion((prevData) => ({
  ...prevData,
  [name]: value,
}));
};

const handleDeletRelacion = async (id) => {
  try {
    
 var res=   await axios.delete(`/api/relacion/${id}`);
 if (res != null) {
  fetchTutores();
  toast.success("Registro eliminado", {
    position: "top-center",
    autoClose: 3000,  // Se cierra automáticamente después de 3 segundos
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    className: "bg-green-200 text-green-700",  // Fondo verde claro con texto verde
    bodyClassName: "text-white",  // Color del texto dentro del toast
    progressClassName: "bg-green-500",  // Barra de progreso verde
  });
}

  } catch (error) {
    console.error("Error al eliminar relacion", error);
  }
};


const handleDeleteRelacion = (id) => {
// Crear un toast personalizado con botones
const confirmToast = (
  <div className="flex flex-col text-black">
    <p>¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.</p>
    <div className="flex space-x-2 mt-2">
      <button 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        onClick={() => {
          handleDeletRelacion(id); // Llamar la función para eliminar
          toast.dismiss(); // Cerrar el toast
          console.log(`Eliminando registro con ID: ${id}`);
        }}
      >
       Confirmar <CheckIcon className="h-6 w-6 inline" />
      </button>
      <button 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        onClick={() => toast.dismiss()} // Cerrar el toast sin hacer nada
      >
        Cancelar
      </button>
    </div>
  </div>
);

// Mostrar el toast de confirmación
toast.warning(confirmToast, {
  position: "top-center",
  autoClose: false,  // No se cierra automáticamente
  hideProgressBar: true,
  closeOnClick: false,  // No cierra el toast si se hace clic
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
});
};


const handleCancelRelacion = () => {
setPersonaDataRelacion((prevData) => ({
  ...prevData,
  Primer_Nombre: "",
  Segundo_Nombre: "",
  Primer_Apellido: "",
  Segundo_Apellido: "",
  Sexo: "",
  Fecha_Nacimiento: "",
  Lugar_Nacimiento: "",
  Identidad: "",
  Creado_Por: "",
  Id_Departamento: 0,
  Id_Municipio: 0,
  esNuevo: true,
  Id_Tipo_Persona:1,
  Estado:1
}));

closeModal("modalRelacion");
};

const handlePersonaSubmit = async (e) => {
e.preventDefault();
try {
console.log("handlePersonaSubmit")

  personaDataRelacion.Creado_Por=user.id;
  personaDataRelacion.Modificado_Por=user.id;
  personaDataRelacion.Fecha_Nacimiento='2000-01-01';
  personaDataRelacion.Estado=Number(personaDataRelacion.Estado) 
  const errores = validarFormulario(personaDataRelacion, reglasValidacionRelacion,"formTutor");

    if (errores.length > 0) {
   
    //toast.error(errores.join("\n"), error);
      return;
    }

    // const errores2 = validarFormulario(formData, reglasValidacionEstudiante);

    // if (errores2.length > 0) {
   
    //   toast.error(errores2.join("\n"), error);
    //   return;
    // }



    let res=    await axios.post("/api/relacion/relacion", { personaDataRelacion });


    if (res != null) {
      fetchEstudiantes(); // Llama a la función para actualizar la lista de estudiantes
      
      // Verifica si es una acción de registrar o actualizar
      if (!isEditing) {
        toast.success("Registro Creado", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        toast.success("Registro Actualizado", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }
    
    closeModal("modalRelacion")


  
  setPersonaDataRelacion({
    Primer_Nombre: "",
    Segundo_Nombre: "",
    Primer_Apellido: "",
    Segundo_Apellido: "",
    Direccion: "",
    Telefono: "",
    Estado: null,
    Sexo: "",
    Fecha_Nacimiento: "",
    Lugar_Nacimiento: "",
    Identidad: "",
    Creado_Por: "",
    esEstudiente:true,
    esNuevo:true
  });
  
  fetchTutores()


} catch (error) {
  console.error("Error al guardar estudiante y persona", error);
}
};
  
  const filteredTutores = tutores.filter(t => deepSearch(t, searchQuery));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredTutores.slice(indexOfFirst, indexOfLast);

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos) return <p>No tienes permisos para acceder.</p>;
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div className="p-6">
      <SearchBar
        title="Listado de Tutores"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={() => setSearchQuery({ general: '' })}
     
        onExport={handleExportTutores}
        showAddButton={false}
      />

      <table className="xls_style-excel-table">
        <thead>
          <tr>
          <th>#</th>
          <th>Acciones</th>
            <th>Identidad</th>
            <th>Fecha Registro</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estudiante</th>
            <th>Estado</th>
       
          </tr>
        </thead>
        <tbody>
          {currentItems.map((t,index)=> (
            <tr key={t.Id_Persona}>
              <td>{index+1}</td>
              <td className='xls_center'>
                     <div className="flex justify-center gap-2">
                       {permisos.Permiso_Actualizar === "1" && (
                         <button
                           onClick={() => handleEdit(t)}
                                  className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                         >
                           <PencilSquareIcon className="h-6 w-6" />
                         </button>
                       )}
                       {permisos.Permiso_Eliminar === "1" && (
                                             <button
                                               type="button"
                                               onClick={() => handleDeleteRelacion(t.Id_Relacion)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                                             >
                                               <TrashIcon className="h-5 w-5" />
                                             </button>
                                           )}
                                           </div>
                     </td>
              <td>{t.Identidad}</td>
            
              <td>{t.Fecha_Creacion}</td>
              <td>{t.Persona_Nombre} {t.Persona_Apellido}</td>
              <td>{t.Persona_Telefono}</td>
              <td>{t.Persona_Direccion}</td>
              <td>{t.Estudiante_Nombre} {t.Estudiante_Apellido}</td>
              <td>{estados.find(e => e.Codigo_Estado === t.Estado)?.Nombre_Estado || 'Desconocido'}</td>
          
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredTutores.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        nextPage={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredTutores.length / itemsPerPage)))}
      />

      <ModalGenerico
        id="modalRelacion"
        isOpen={modals['modalRelacion']}
        onClose={() => closeModal('modalRelacion')}
        titulo={isEditing ? 'Editar Tutor' : 'Agregar Tutor'}
      >
       
       <RelacionForm
  personaDataRelacion={personaDataRelacion}
  setPersonaDataRelacion={setPersonaDataRelacion} // <-- Asegúrate de pasar esto
  handleInputChange={handleTutorInputChange}
  handleSubmit={handlePersonaSubmit}
  handleCancel={handleCancelRelacion}
  estados={estados}
  permisos={permisos}
  formId="formTutor" // 👈 útil para validación DOM con ID
  tipoRelacion="Tutor" // 👈 útil para validación DOM con ID
/>
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals['modalConfirmacion']}
        onClose={() => closeModal('modalConfirmacion')}
        onConfirm={() => handleDelete(formData.Id_Persona)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar este tutor?"
        entidad={formData?.Persona_Nombre}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default TutorPadreManagement;
