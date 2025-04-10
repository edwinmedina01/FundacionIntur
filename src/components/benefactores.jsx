import React, { useState, useEffect, useContext,useCallback  } from 'react';
import axios from 'axios';
import { ArrowDownCircleIcon, UserPlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';
import { ShieldExclamationIcon, TrashIcon,MagnifyingGlassIcon ,CheckIcon  } from '@heroicons/react/24/outline';
import { obtenerEstados } from "../../src/utils/api"; // Importar la función
import { deepSearch } from "../../src/utils/deepSearch"; 
import { getBase64ImageFromUrl } from "../../src/utils/getBase64ImageFromUrl"; 
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import SearchBar from "../components/basicos/SearchBar"
import Pagination from "../components/basicos/Pagination"
import RelacionForm from "../components/basicos/RelacionForm"
import  ModalGenerico  from "../utils/ModalGenerico";// Importar la función
import { validarFormulario}  from '../utils/validaciones';
import { exportToExcel } from "../utils/exportToExcel"; // Importar la función
import { toast } from "react-toastify";
import { reglasValidacionEstudiante, reglasValidacionPersona ,reglasValidacionRelacion} from "../../models/ReglasValidacionModelos";
import useModal from "../hooks/useModal";
const BenefactoresManagement = () => {
  const router = useRouter();
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [estudiantes, setEstudiantes] = useState([]);
  const { user } = useContext(AuthContext); // Usuario logueado
 const [estados, setEstados] = useState([]);
  const [Benefactores, setBenefactores] = useState([]);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const [formData, setFormData] = useState({
    Id_Persona: '',
    Primer_Nombre: '',
    Primer_Apellido: '',
    Municipio: '',
    Departamento: '',
    Tipo_Persona: 3, // Solo Benefactores/padres (tipo 3)
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');

  const [searchQuery, setSearchQuery] = useState({
    general: "",
    Usuario: "",
    Estado: "",
    Created: "",
  });

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
    
    fetchBenefactores()


  } catch (error) {
    console.error("Error al guardar estudiante y persona", error);
  }
};

  
  const [currentPage, setCurrentPage] = useState(1);

  const [BenefactoresPerPage, setBenefactoresPerPage] = useState(10);
  
  const cargarEstados = useCallback(async () => {
    //  setLoading(true);
      const data = await obtenerEstados("GENÉRICO");
      setEstados(data);
    //  setLoading(false);
  }, []); // 🔥 Se ejecu
  

  useEffect(() => {
    document.title = "Benefactores";
}, []);



const fetchPermisos = useCallback(async () => {
  try {
    if (user) {
      const idObjeto = 16; // ID relacionado con Benefactores
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
}, [user]); // ✅ Solo se vuelve a crear cuando `user` cambia





  useEffect(() => {
    cargarEstados();
    fetchBenefactores();
    fetchEstudiantes();
    fetchPermisos();
  }, [user,fetchPermisos,cargarEstados]);

  const fetchBenefactores = async () => {
    try {
      const response = await axios.get('/api/benefactores');
      if (response.data && Array.isArray(response.data)) {
        setBenefactores(response.data);
      } else {
        throw new Error('Datos no válidos recibidos');
      }
    } catch (error) {
      console.error('Error fetching Benefactores:', error);
      setError('Hubo un problema al obtener los Benefactores');
    }
  };

  // Funciones para obtener el nombre (esto depende de cómo tengas la información)
  const getMunicipioNameById = (municipioId) => {
    // Implementar lógica para obtener el nombre del municipio según el ID
    return 'Nombre Municipio';
  };
  
  const getDepartamentoNameById = (departamentoId) => {
    // Implementar lógica para obtener el nombre del departamento según el ID
    return 'Nombre Departamento';
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
      if (isEditing) {
        const response = await fetch(`/api/benefactores`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el Benefactor');
        }

        setUpdateNotification('Benefactor actualizado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/benefactores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al agregar el Benefactor');
        }

        setNotification('Benefactor agregado exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchBenefactores();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el Benefactor:', error);
    }
  };


  const handleEdit = (data) => {
    console.log("handleEdit", data);
  
    const estudiante = estudiantes.find(est => est.Id_Estudiante === data.Id_Estudiante);
  
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
  

  const handleDelete = async (Id_Persona) => {
    try {
      const response = await fetch('/api/benefactores', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Persona }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el Benefactor');
      }

      fetchBenefactores();
      resetForm();
      setDeleteNotification('Benefactor eliminado exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el Benefactor:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Persona: '',
      Nombre: '',
      Apellido: '',
      Municipio: '',
      Departamento: '',
      Tipo_Persona: 3, // Solo Benefactores/padres (tipo 3)
    });
    setIsEditing(false);
  };

  // Filtrado de Benefactores
  // const filteredBenefactores = Benefactores.filter((Benefactor) => {
  //   const nombreCompleto = `${Benefactor.Persona_Nombre} ${Benefactor.Persona_Apellido}`.toLowerCase();
  //   const identidad = String(Benefactor.Identidad).toLowerCase();
  //   return nombreCompleto.includes(search.toLowerCase()) || identidad.includes(search.toLowerCase());
  // });


  const filteredBenefactores = Benefactores.filter((user) => deepSearch(user, searchQuery, 0, 3));
 

  // Lógica de paginación
  const indexOfLastBenefactor = currentPage * BenefactoresPerPage;
  const indexOfFirstBenefactor = indexOfLastBenefactor - BenefactoresPerPage;
  const currentBenefactores = filteredBenefactores.slice(indexOfFirstBenefactor, indexOfLastBenefactor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredBenefactores.length / BenefactoresPerPage);

  // const handleExport = () => {
  //   const transformedBenefactores = Benefactores.map((Benefactor) => ({
  //     Identidad: Benefactor.Identidad,
  //     Nombre: `${Benefactor.Primer_Nombre} ${Benefactor.Primer_Apellido}`,
  //     Sexo: Benefactor.Sexo === 1 ? 'Masculino' : 'Femenino',
  //     telefono: `${Benefactor.telefono}`,
  //     direccion: `${Benefactor.direccion}`,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(transformedBenefactores);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Benefactores');
  //   XLSX.writeFile(workbook, 'Benefactores.xlsx');
  // };


  const nuevoTutor= ()=>{

    setPersonaDataRelacion( {
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
    
      esNuevo:true,
      Id_Tipo_Persona:tipo,
      Estado:1,
     // Estudiante:estudianteData,
     // Id_estudiante:idEstudiante
  
  
    })
  
 //   personaDataRelacion.Estudiante.Persona=personaData;
   // personaDataRelacion.Id_Tipo_Persona=tipo;
  
  // switch (tipo) {
  //   case 2:
  //     showModal("modalRelacion")
  //     break;
      // case 3:
        showModal("modalRelacionBenefactor")
  //       break;
  
  
  // }
   
  
  }

  const handleExportBenefactores = async () => {
    const headers = [
   

      { header: "Identidad", key: "Identidad", width: 20 },
      { header: "Nombre y Apellido", key: "NombreApellido", width: 40 },
      { header: "Fecha Registro", key: "Fecha_Creacion", width: 20 },

      { header: "Sexo", key: "Sexo", width: 10 },
      { header: "Teléfono", key: "Telefono", width: 15 },
      { header: "Dirección", key: "Direccion", width: 30 },
      { header: "Identidad Est.", key: "Identidad_Estudiante", width: 20 },
      { header: "Estudiante", key: "Estudiante", width: 30 },
      { header: "Estado", key: "Estado", width: 20 },
    ];
  
    const data = currentBenefactores.map((benefactor, index) => {
      const estado = estados.find((e) => e.Codigo_Estado === benefactor.Estado)?.Nombre_Estado || "Desconocido";
      const nombreApellido = `${benefactor.Persona_Nombre || ""} ${benefactor.Persona_Apellido || ""}`;
      const estudianteNombre = `${benefactor.Estudiante_Nombre || ""} ${benefactor.Estudiante_Apellido || ""}`;
  
      return {

        Identidad:""+ benefactor.Identidad || "-",
        Fecha_Creacion: benefactor.Fecha_Creacion || "-",
        NombreApellido: nombreApellido,
        Sexo: benefactor.Sexo === 1 ? "Masculino" : benefactor.Sexo === 0 ? "Femenino" : "Desconocido",
        Telefono: benefactor.Persona_Telefono || "-",
        Direccion: benefactor.Persona_Direccion || "-",
        Identidad_Estudiante:" "+ benefactor.Estudiante_Identidad || "-",
        Estudiante: estudianteNombre,
        Estado: estado,
      };
    });
  
    await exportToExcel({
      fileName: "Benefactores.xlsx",
      title: "Reporte de Benefactores",
      headers,
      data,
      searchQuery, // Si tienes filtros que quieras aplicar
    });
  };
  


  const handleDeletRelacion = async (id) => {
    try {
      
   var res=   await axios.delete(`/api/relacion/${id}`);
   if (res != null) {
    fetchBenefactores();
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





  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg">
        <h3>Error al cargar los Benefactores:</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (sinPermisos) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a los Benefactores</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  }

  if (!permisos) {
    return <p>Cargando permisos...</p>;
  }

  return (
    <div className="w-full lg:w-3/3 p-6 rounded-lg">
   
   <SearchBar
  title="Listado de Benefactores"

  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  handleClearSearch={handleClearSearch}
  showAddButton={false}

  onExport={handleExportBenefactores}
/>


      {/* Mensajes de notificación */}
      {notification && <div className="text-green-600">{notification}</div>}
      {updateNotification && <div className="text-yellow-600">{updateNotification}</div>}
      {deleteNotification && <div className="text-red-600">{deleteNotification}</div>}

{/* Tabla de Benefactores */}
<div >

<ModalGenerico
    id="modalRelacion"
  isOpen={modals["modalRelacion"]}
  onClose={() => closeModal("modalRelacion")}
  titulo={personaDataRelacion?.esNuevo ? "Agregar Benefactor" : "Actualizar Benefactor"}
  tamano="max-w-4xl"
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
  tipoRelacion="Benefactor" // 👈 útil para validación DOM con ID
/>

</ModalGenerico> 

<table className="xls_style-excel-table">
  <thead>
    <tr className="bg-blue-200 text-black uppercase text-sm font-semibold">
      <th className="py-4 px-6  font-semibold text-left">#</th>
      <th className="py-4 px-6  font-semibold text-left">Acciones</th>
      <th className="py-4 px-6  font-semibold text-left">Identidad</th>
      <th className="py-4 px-6  font-semibold text-left">Fecha Registro</th>

      <th className="py-4 px-6  font-semibold text-left">Nombre y Apellido</th>
      <th className="py-4 px-6  font-semibold text-left">Sexo</th>
      <th className="py-4 px-6  font-semibold text-left">Telefono</th>
      <th className="py-4 px-6  font-semibold text-left">Direccion</th>
      <th className="py-4 px-6  font-semibold text-left">Identidad E.</th>
      <th className="py-4 px-6  font-semibold text-left">Estudiante</th>
      <th className="py-4 px-6  font-semibold text-left">Estado</th> {/* Nueva columna de Estado */}
 
    </tr>
  </thead>

  <tbody>
    {Benefactores && Benefactores.length > 0 ? (
      currentBenefactores.map((Benefactor,index) => {
        // Buscar el estado correspondiente en el diccionario de estados
        const estado = estados.find(e => e.Codigo_Estado === Benefactor.Estado );

        return (
          <tr key={Benefactor.Id_Persona}>
            <td >{index+1}</td>
            <td className='xls_center'>
            <div className="flex justify-center gap-2">
              {permisos.Permiso_Actualizar === "1" && (
                <button
                  onClick={() => handleEdit(Benefactor)}
                  className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </button>
              )}
              {permisos.Permiso_Eliminar === "1" && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRelacion(Benefactor.Id_Relacion)}
                                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  )}
                                  </div>
            </td>
            <td className="border px-4 py-2">{Benefactor.Identidad}</td>
            <td className="border px-4 py-2">{Benefactor.Fecha_Creacion}</td>
            <td className="border px-4 py-2">{Benefactor.Persona_Nombre} {Benefactor.Persona_Apellido}</td>
            <td className="border px-4 py-2">
              {Benefactor.Sexo === 1
                ? 'Masculino'
                : Benefactor.Sexo === 0
                ? 'Femenino'
                : 'Desconocido'}
            </td>
            <td className="border px-4 py-2">{Benefactor.Persona_Telefono}</td>
            <td className="border px-4 py-2">{Benefactor.Persona_Direccion}</td>
            <td className="border px-4 py-2">{Benefactor.Estudiante_Identidad}</td>
            <td className="border px-4 py-2">{Benefactor.Estudiante_Nombre} {Benefactor.Estudiante_Apellido}</td>
            
            {/* Mostrar el Estado con su Nombre correspondiente */}
            <td className="border px-4 py-2">{estado ? estado.Nombre_Estado : "Desconocido"}</td>

      
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="9">No hay Benefactores disponibles</td>
      </tr>
    )}
  </tbody>
</table>
<Pagination
  currentPage={currentPage}
  totalItems={filteredBenefactores.length}
  itemsPerPage={BenefactoresPerPage}
  setPage={setCurrentPage}
  setItemsPerPage={setBenefactoresPerPage}
  prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  nextPage={() =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredBenefactores.length / benefactoresPerPage))
    )
  }
/>

</div>

   
    </div>
  );
};

export default BenefactoresManagement;
