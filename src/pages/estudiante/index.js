import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import AuthContext from "../../context/AuthContext";
import { ShieldExclamationIcon,HomeIcon, PencilSquareIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import GraduandoTable from '../../components/GraduandoTable';
import GraduandoInner from '../../components/GraduandoInner';
import { useRouter } from 'next/router';


import ModalGenerico from '../../utils/ModalGenerico';
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from "../../hooks/useModal";

import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionEstudiante, reglasValidacionPersona ,reglasValidacionRelacion} from "../../../models/ReglasEstudiantePersona";
const EstudiantesCrud = () => {
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales


  const router = useRouter();


  const { tab, idEstudiante, relacionId } = router.query;
  const [activeTab, setActiveTab] = useState(1); // para las pestañas en el mismo formulario
  const { user } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteTemp, setEstudianteTemp] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // Mantener el estudiante seleccionado
// ------------------- FUNCIONALIDAD PERMISOS----------------------//
const [permisos, setPermisos] = useState([]);
const [error, setError] = useState(null); //mostrar error de permiso
const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
// ------------------------------------------------------------//
  const [institutos, setInstitutos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sexos, setSexos] = useState([
    { id: 1, descripcion: "Masculino" },
    { id: 0, descripcion: "Femenino" },
  ]);

 
  const [personaData, setPersonaData] = useState({
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
    Id_Tipo_Persona: 1,

  });


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
    }));
    setPersonaData({
      Primer_Nombre: "",
      Segundo_Nombre: "",
      Primer_Apellido: "",
      Segundo_Apellido: "",
      Sexo: "",
      Fecha_Nacimiento: "",
      Lugar_Nacimiento: "",
      Identidad: "",
      Creado_Por: "", 
      Id_Departamento: "",
      Id_Municipio: ""
    });
    
    setEstudianteData({
      Id_Beneficio: "",
      Id_Area: "",
      Id_Instituto: "",
      Creado_Por: "",
      Relaciones: [],
      
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
    Id_Tipo_Persona: 1,
    Id_Estudiante: 0,
    esNuevo:true

  });

  const [estudianteData, setEstudianteData] = useState({
    Id_Beneficio: "",
    Id_Area: "",
    Id_Instituto: "",
    Creado_Por: "",
    Relaciones: []
  });
  const [tutorData, setTutorData] = useState({
  Identidad: '',
  Nombre_Completo: '',
  Sexo: '',
  Direccion: '',
  Telefono: '',
});

const [benefactorData, setBenefactorData] = useState({
  Identidad: '',
  Nombre_Completo: '',
  Telefono: '',
  Direccion: '',
});

  const [editId, setEditId] = useState(null);
  const [editPersonaId, setEditPersonaId] = useState(null);

  useEffect(() => {
    if (personaData.Id_Departamento) {
      fetchMunicipios(personaData.Id_Departamento);
    } else {
      setMunicipios([]); // Reinicia municipios si no hay departamento seleccionado
    }
    if (user && user.rol) {
      fetchEstudiantes();
      fetchInstitutos();
      fetchAreas();
      fetchBeneficios();
      fetchDepartamentos();
      fetchPermisos(user.rol);

    }
  }, [user]);
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get("/api/estudiantes");
      setEstudiantes(response.data);


 

       // Si hay un estudiante seleccionado, actualizarlo
    if (selectedStudent||idEstudiante) {
      const updatedStudent = response.data.find(
        (e) => e.Id_Estudiante === selectedStudent?.Id_Estudiante ||  e.Id_Estudiante === Number( idEstudiante)
      );
      setSelectedStudent(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe
  
      handleEdit(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe
      setActiveTab(Number(tab))
      switch (Number(tab))
      
      {
          case 3:
          case 2:
            const relacion = updatedStudent.Relaciones.find(
              (e) =>  e.Id === Number( relacionId)
            );
            if (relacion){
              handleEditTutor(relacion)
            
            }
        
          break;


      }
    }
      console.log(response.data)
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };


  const resizeTo=()=>{
    setPersonaDataRelacion((prev) => ({
      ...prev, // Mantiene las propiedades actuales de personaDataRelacion
      Identidad: '',
      Primer_Nombre: '',
      Primer_Apellido: '',
      Sexo: '',
      Direccion: '',
      Telefono: '',
    }));

  }


  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);

    switch(tabIndex){
      
      case 1:

      personaData.Id_Tipo_Persona=1;

      if(estudianteData==null){
        personaDataRelacion.esNuevo=true;
        personaDataRelacion.Id_Persona=null;
      }
    
        

      break;
   
      case 2:
        
        personaDataRelacion.Id_Tipo_Persona=2;
        personaDataRelacion.esNuevo=true;
        personaDataRelacion.Id_Persona=null;
        resizeTo();

      break;
           
      case 3:
        personaDataRelacion.Id_Tipo_Persona=3;
        personaDataRelacion.esNuevo=true;
        personaDataRelacion.Id_Persona=null;


      resizeTo();

      break;


    }
  };
  
  const fetchInstitutos = async () => {
    try {
      const response = await axios.get("/api/institutos");
      setInstitutos(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get("/api/areas");
      setAreas(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

  const fetchBeneficios = async () => {
    try {
      const response = await axios.get("/api/beneficios");
      setBeneficios(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 1; // ID del objeto relacionado con esta página
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
      const response = await axios.get("/api/departamentos");
      setDepartamentos(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

  const fetchMunicipios = async (departamentoId) => {
    try {
      const response = await axios.get(
        `/api/municipios?Id_Departamento=${departamentoId}`
      );
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

  const handlePersonaInputChange = (e) => {
    const { name, value } = e.target;
 if (name === "Id_Departamento") {
      fetchMunicipios(value);  // Llama a la función que obtiene los municipios
    }
setPersonaData({
      ...personaData,  // Mantiene el resto de los datos de personaData
      [name]: value,    // Actualiza solo el campo correspondiente
    });
  };
  

  const handleEstudianteInputChange = (e) => {
    setEstudianteData({ ...estudianteData, [e.target.name]: e.target.value });
  };
// Ejemplo para handleTutorInputChange
const handleTutorInputChange = (event) => {
  const { name, value } = event.target;
  setPersonaDataRelacion((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

// Ejemplo para handleBenefactorInputChange
const handleBenefactorInputChange = (event) => {
  const { name, value } = event.target;
  setBenefactorData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};



const handlePersonaSubmit = async (e) => {
  e.preventDefault();
  try {


    personaDataRelacion.Creado_Por=user.id;
    personaDataRelacion.Modificado_Por=user.id;
   const errores = validarFormulario(personaDataRelacion, reglasValidacionRelacion);

      if (errores.length > 0) {
     
        toast.error(errores.join("\n"), error);
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
        if (editId) {
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
      

   
    
    setPersonaDataRelacion({
      Primer_Nombre: "",
      Segundo_Nombre: "",
      Primer_Apellido: "",
      Segundo_Apellido: "",
      Sexo: "",
      Fecha_Nacimiento: "",
      Lugar_Nacimiento: "",
      Identidad: "",
      Creado_Por: "",
      esEstudiente:true,
      esNuevo:true
    });
    

  } catch (error) {
    console.error("Error al guardar estudiante y persona", error);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();

  personaData.Creado_Por=user.id;
  personaData.Modificado_Por=user.id;
  estudianteData.Creado_Por=user.id;
  estudianteData.Modificado_Por=user.id;
 const errores = validarFormulario(personaData, reglasValidacionPersona);

    if (errores.length > 0) {
   
      toast.error(errores.join("\n"), error);
      return;
    }

    const errores2 = validarFormulario(estudianteData, reglasValidacionEstudiante);

    if (errores2.length > 0) {
   
      toast.error(errores2.join("\n"), error);
      return;
    }




  try {
    if (editId) {
      // Actualización de registro
      let res = await axios.put(`/api/estudiantes/${editId}`, {
        estudianteData,
        personaData,
      });
      if (res != null) {
        toast.success('Registro actualizado exitosamente', {
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
        });
      }
      // setEditId(null); // Descomentar si se usa en otro contexto
    } else {
      // Creación de nuevo registro
      if (tutorData.Identidad.length > 10) {
        personaData.Identidad = tutorData.Identidad;
        personaData.Nombre_Completo = tutorData.Nombre_Completo;
        personaData.Primer_Nombre = tutorData.Nombre_Completo.split(" ")[0];
        personaData.Primer_Apellido = tutorData.Nombre_Completo.split(" ")[1];
        personaData.Telefono = tutorData.Telefono;
        personaData.Direccion = tutorData.Direccion;
        personaData.sexo = tutorData.Sexo;
      }

      if (benefactorData.Identidad.length > 10) {
        personaData.Identidad = benefactorData.Identidad;
        personaData.Nombre_Completo = benefactorData.Nombre_Completo;
        personaData.Telefono = benefactorData.Telefono;
        personaData.Direccion = benefactorData.Direccion;
        personaData.sexo = benefactorData.Sexo;
      }

      let res = await axios.post("/api/estudiantes", { personaData, estudianteData });
      if (res != null) {
        toast.success('Registro creado exitosamente', {
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
        });
      }
    }

    // Resetear los formularios
    setPersonaData({
      Primer_Nombre: "",
      Segundo_Nombre: "",
      Primer_Apellido: "",
      Segundo_Apellido: "",
      Sexo: "",
      Fecha_Nacimiento: "",
      Direccion: "",
      Telefono: "",
      Lugar_Nacimiento: "",
      Identidad: "",
      Creado_Por: "",
      esEstudiente: true,
    });
    setEstudianteData({
      Id_Beneficio: "",
      Id_Area: "",
      Id_Instituto: "",
      Creado_Por: "",
      Relaciones: [],
    });

    // Recargar lista de estudiantes
    fetchEstudiantes();
  } catch (error) {
    // Notificación de error
    console.error('Error al guardar estudiante y persona', {
      style: {
        backgroundColor: '#ffebee', // Fondo suave rojo
        color: '#d32f2f', // Texto rojo oscuro
        fontWeight: 'bold',
        border: '1px solid #f5c6cb', // Borde rojo claro
        padding: '16px',
        borderRadius: '12px',
      },
      position: 'bottom-right', // Posición en la esquina inferior derecha
      autoClose: 5000, // Cierra automáticamente en 5 segundos
      hideProgressBar: true, // Ocultar barra de progreso
    });
    console.error("Error al guardar estudiante y persona", error);
  }
};


  const handleCancel = () => {
    setPersonaData({
      Primer_Nombre: "",
      Segundo_Nombre: "",
      Primer_Apellido: "",
      Segundo_Apellido: "",
      Sexo: "",
      Fecha_Nacimiento: "",
      Lugar_Nacimiento: "",
      Direccion: "",
      Telefono: "",
      Identidad: "",
      Creado_Por: "", 
      Id_Departamento: "",
      Id_Municipio: ""
    });

    setEstudianteData({
      Id_Beneficio: "",
      Id_Area: "",
      Id_Instituto: "",
      Creado_Por: "",
      Relaciones: [], 

    });
    
    setEditId(null); //correccion para el estado del boton "registrar estudiante, y no se quede en actualizar cuando se cancele"
  };

  const handleEdit = (estudiante) => {

    setPersonaDataRelacion({
      ...personaDataRelacion,
      Estudiante: estudiante, // Guarda el objeto completo del estudiante
    });

    setSelectedStudent(estudiante); 
    setEditId(estudiante.Id_Estudiante);
    setEstudianteTemp(estudiante);
    setEstudianteData({
      Id_Beneficio: estudiante.Id_Beneficio,
      Id_Area: estudiante.Id_Area,
      Id_Instituto: estudiante.Id_Instituto,
      Creado_Por: estudiante.Creado_Por,
      Relaciones:estudiante.Relaciones
    });

    setEditPersonaId(estudiante.Persona.Id_Persona);
    setPersonaData(estudiante.Persona);

    if (estudiante.Persona.Id_Departamento) {
      fetchMunicipios(estudiante.Persona.Id_Departamento);
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


  const handleEditTutor = (tutor) => {
    console.log( "handleEditTutor")
   console.log( tutor)
   setEditId(tutor.Persona.Id_Estudiante);

setPersonaDataRelacion({


  Id_Estudiante:estudianteData.Id_Estudiante,
  Identidad: tutor.Persona.Identidad,
  Primer_Nombre:  tutor.Persona.Primer_Nombre ,
  Primer_Apellido:  tutor.Persona.Primer_Apellido ,
  Sexo:  tutor.Persona.Sexo,
  Direccion: tutor.Persona.Direccion,
  Telefono:  tutor.Persona.Telefono,
  Id_Persona:tutor.Persona.Id_Persona,
  Update:true

})
    

  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/estudiantes/${id}`);
      fetchEstudiantes();
      if (selectedStudent?.Id_Estudiante === id) {
        setSelectedStudent(null); // Limpiar la selección si fue eliminado
      }
    } catch (error) {
      console.error("Error al eliminar estudiante", error);
    }
  };

  const handleDeletRelacion = async (id) => {
    try {
      
   var res=   await axios.delete(`/api/relacion/${id}`);
   if (res != null) {
    fetchEstudiantes();
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

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar los estudiantes basados en el término de búsqueda
  // const filteredEstudiantes = estudiantes.filter(estudiante =>
  //   `${estudiante.Persona?.Primer_Nombre} ${estudiante.Persona?.Primer_Apellido}`
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase())
  // );
  // const filteredEstudiantes = estudiantes.filter(estudiante =>
  //   `${estudiante.Persona?.Primer_Nombre} ${estudiante.Persona?.Segundo_Nombre || ''} ${estudiante.Persona?.Primer_Apellido} ${estudiante.Persona?.Segundo_Apellido || ''} ${estudiante.Persona?.Identidad} ${estudiante.Persona?.Lugar_Nacimiento} ${estudiante.Instituto?.Nombre_Instituto} ${estudiante.Area?.Nombre_Area} ${estudiante.Beneficio?.Nombre_Beneficio} ${estudiante.Persona?.Municipio?.Nombre_Municipio}`
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase())
  // );

  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const fullText = `
      ${estudiante.Persona?.Identidad || ""} 
      ${estudiante.Persona?.Primer_Nombre || ""} 
      ${estudiante.Persona?.Segundo_Nombre || ""} 
      ${estudiante.Persona?.Primer_Apellido || ""} 
      ${estudiante.Persona?.Segundo_Apellido || ""} 
      ${estudiante.Persona?.Sexo || ""} 
      ${estudiante.Persona?.Lugar_Nacimiento || ""} 
      ${estudiante.Instituto?.Nombre_Instituto || ""} 
      ${estudiante.Area?.Nombre_Area || ""} 
      ${estudiante.Beneficio?.Nombre_Beneficio || ""} 
      ${estudiante.Persona?.Municipio?.Nombre_Municipio || ""}
    `;

    // Convertir todo el texto a minúsculas y buscar el término de búsqueda
    return fullText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Renderizado
if (!user) {
  return <p>Cargando usuario...</p>;
}

if (error) {
  return <p>{error}</p>;
}

if (sinPermisos) {
  return        <Layout><div className="bg-red-100 text-red-800 p-4  flex items-center">
  <div className="bg-red-100 text-red-800 p-4   flex items-center max-w-md w-full">
  <ShieldExclamationIcon className="h-12 w-12 mr-4" />
  <div>
    <h3 className="font-bold text-lg">
      Sin permisos para Acceder a la Pantalla de Estudiantes
    </h3>
    <p>No tienes permisos para Acceder a la información.</p>
  </div>
  </div>

</div>
</Layout> 
}

if (!permisos) {
  return <p>Cargando permisos...</p>;
}


  return (
    <Layout>
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
            Nuevo Registro
          </h1>

          <center>
          {permisos.Permiso_Consultar === "1" && (
  <button
    onClick={() => (window.location.href = "/estudiante/reporte")}
    className="block py-1 px-4 rounded bg-orange-600 text-white hover:bg-orange-700 focus:outline-none"
  >
    Ir a Estudiantes
  </button>
)}

          </center>
          <br></br>
          
         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-10">
  {/* Pestañas */}
  <div className="flex border-b-2">
    <button
      type="button"
      onClick={() => handleTabChange(1)}
      className={`p-4 ${
        activeTab === 1 ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700"
      } transition duration-300 ease-in-out`}
    >
      Estudiante
    </button>
    <button
      type="button"
      onClick={() => handleTabChange(2)}
      className={`p-4 ${
        activeTab === 2 ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700"
      } transition duration-300 ease-in-out`}
    >
      Tutor/Padre
    </button>
    <button
      type="button"
      onClick={() => handleTabChange(3)}
      className={`p-4 ${
        activeTab === 3 ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700"
      } transition duration-300 ease-in-out`}
    >
      Benefactor
    </button>
    <button
      type="button"
      onClick={() => handleTabChange(4)}
      className={`p-4 ${
        activeTab === 4 ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700"
      } transition duration-300 ease-in-out`}
    >
      Graduación
    </button>
  </div>

  {/* Sección Estudiante */}
  {activeTab === 1 && (
    <div className="space-y-6">
  {/* Datos Personales */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Datos del Estudiante</h2>



      {/* Primer Nombre */}
      <div className="flex flex-col">
        <label htmlFor="Primer_Nombre" className="text-gray-700">Primer Nombre</label>
        <input
          id="Primer_Nombre"
          type="text"
          name="Primer_Nombre"
          placeholder="Primer Nombre"
          value={personaData.Primer_Nombre}
          onChange={handlePersonaInputChange}
          required
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>

      {/* Segundo Nombre */}
      <div className="flex flex-col">
        <label htmlFor="Segundo_Nombre" className="text-gray-700">Segundo Nombre</label>
        <input
          id="Segundo_Nombre"
          type="text"
          name="Segundo_Nombre"
          placeholder="Segundo Nombre"
          value={personaData.Segundo_Nombre}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>
                  {/* Número de Identidad */}
                  <div className="flex flex-col">
        <label htmlFor="Identidad" className="text-gray-700">Número de Identidad</label>
        <input
          id="Identidad"
          type="text"
          name="Identidad"
          placeholder="Número de Identidad"
          value={personaData.Identidad}
          onChange={handlePersonaInputChange}
          required
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>

      {/* Fecha de Nacimiento */}
      <div className="flex flex-col">
        <label htmlFor="Fecha_Nacimiento" className="text-gray-700">Fecha de Nacimiento</label>
        <input
          id="Fecha_Nacimiento"
          type="date"
          name="Fecha_Nacimiento"
          placeholder="Fecha de Nacimiento"
          value={personaData.Fecha_Nacimiento}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>

      {/* Departamento */}
      <div className="flex flex-col">
        <label htmlFor="Id_Departamento" className="text-gray-700">Departamento</label>
        <select
          id="Id_Departamento"
          name="Id_Departamento"
          value={personaData.Id_Departamento}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Seleccione un Departamento</option>
          {departamentos.map((departamento) => (
            <option key={departamento.Id_Departamento} value={departamento.Id_Departamento}>
              {departamento.Nombre_Departamento}
            </option>
          ))}
        </select>
      </div>

                 {/* Número de Direccion */}
                 <div className="flex flex-col">
        <label htmlFor="Direccion " className="text-gray-700">Dirección</label>
        <input
          id="Direccion"
          type="text"
          name="Direccion"
          placeholder="Direccion"
          value={personaData.Direccion}
          onChange={handlePersonaInputChange}
          required
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>




{/* Área */}
<div className="flex flex-col">
        <label htmlFor="Id_Area" className="text-gray-700">Área</label>
        <select
          id="Id_Area"
          name="Id_Area"
          value={estudianteData.Id_Area}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Área</option>
          {areas.map((area) => (
            <option key={area.Id_Area} value={area.Id_Area}>{area.Nombre_Area}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
  <label htmlFor="Lugar_Nacimiento" className="text-gray-700">Lugar de Nacimiento</label>
  <input
    type="text"
    id="Lugar_Nacimiento"
    name="Lugar_Nacimiento"
    value={personaData.Lugar_Nacimiento} // Estado vinculado
    onChange={(e) =>
      setPersonaData({
        ...personaData,
        [e.target.name]: e.target.value,
      })
    } // Manejador para actualizar el estado
    className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
    placeholder="Ingresa el lugar de nacimiento"
    required
  />
</div>

      
    </div>

    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Beneficio, Área e Instituto</h2>
      {/* Primer Apellido */}
      <div className="flex flex-col">
        <label htmlFor="Primer_Apellido" className="text-gray-700">Primer Apellido</label>
        <input
          id="Primer_Apellido"
          type="text"
          name="Primer_Apellido"
          placeholder="Primer Apellido"
          value={personaData.Primer_Apellido}
          onChange={handlePersonaInputChange}
          required
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>

      {/* Segundo Apellido */}
      <div className="flex flex-col">
        <label htmlFor="Segundo_Apellido" className="text-gray-700">Segundo Apellido</label>
        <input
          id="Segundo_Apellido"
          type="text"
          name="Segundo_Apellido"
          placeholder="Segundo Apellido"
          value={personaData.Segundo_Apellido}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>     {/* Sexo */}
      <div className="flex flex-col">
        <label htmlFor="Sexo" className="text-gray-700">Sexo</label>
        <select
          id="Sexo"
          name="Sexo"
          value={personaData.Sexo}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Seleccione un sexo</option>
          {sexos.map((sexo) => (
            <option key={sexo.id} value={sexo.id}>{sexo.descripcion}</option>
          ))}
        </select>
      </div>
            {/* Número de Telefono */}
            <div className="flex flex-col">
        <label htmlFor="Telefono" className="text-gray-700">Número de Telefono</label>
        <input
          id="Telefono"
          type="text"
          name="Telefono"
          placeholder="Número de Telefono"
          value={personaData.Telefono}
          onChange={handlePersonaInputChange}
          required
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>
      
      {/* Municipio */}
      <div className="flex flex-col">
        <label htmlFor="Id_Municipio" className="text-gray-700">Municipio</label>
        <select
          id="Id_Municipio"
          name="Id_Municipio"
          value={personaData.Id_Municipio}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Seleccione un Municipio</option>
          {municipios.map((municipio) => (
            <option key={municipio.Id_Municipio} value={municipio.Id_Municipio}>
              {municipio.Nombre_Municipio}
            </option>
          ))}
        </select>
      </div>

      {/* Beneficio */}
      <div className="flex flex-col">
        <label htmlFor="Id_Beneficio" className="text-gray-700">Beneficio</label>
        <select
          id="Id_Beneficio"
          name="Id_Beneficio"
          value={estudianteData.Id_Beneficio}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Beneficio</option>
          {beneficios.map((beneficio) => (
            <option key={beneficio.Id_Beneficio} value={beneficio.Id_Beneficio}>
              {beneficio.Nombre_Beneficio}
            </option>
          ))}
        </select>
      </div>
              {/* Estado */}
              <div className="flex flex-col">
                <label htmlFor="Estado" className="text-gray-700">
                  Estado
                </label>
                <select
                  id="Estado"
                  name="Estado"
                  value={personaData.Estado}
                  onChange={handlePersonaInputChange}
                  required
                  className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
      

      {/* Instituto */}
      <div className="flex flex-col">
        <label htmlFor="Id_Instituto" className="text-gray-700">Instituto</label>
        <select
          id="Id_Instituto"
          name="Id_Instituto"
          value={estudianteData.Id_Instituto}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Instituto</option>
          {institutos.map((instituto) => (
            <option key={instituto.Id_Instituto} value={instituto.Id_Instituto}>
              {instituto.Nombre_Instituto}
            </option>
          ))}
        </select>
      </div>



    </div>
  </div>


  <br></br>
          <div className="flex justify-between">
          {editId
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
              onClick={handleCancel}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancelar
            </button>
          </div>
</div>


  )}
{/* Sección Tutor/Padre */}
{activeTab === 2 && (
  <div>
<div>
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Nombre Completo Estudiante
  </label>
  
  <input
    type="text"
    name="NombreCompleto"
    value={`
      ${personaData.Primer_Nombre || "Sin Nombre"} 
      ${personaData.Segundo_Nombre || ""} 
      ${personaData.Primer_Apellido || ""} 
      ${personaData.Segundo_Apellido || ""}`.trim()}
    disabled
    className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 text-gray-500 cursor-not-allowed"
  />
</div>


  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">




  <div className="flex flex-col">


    
    <label htmlFor="Identidad_Tutor" className="text-gray-700 font-medium">
      Identidad
    </label>
    <input
      id="Identidad_Tutor"
      name="Identidad"  
      placeholder="Número de Identidad"
      value={personaDataRelacion.Identidad}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="Nombre_Tutor" className="text-gray-700 font-medium">
    Nombre
    </label>
    <input
      id="Primer_Nombre"
      type="text"
      name="Primer_Nombre"  
      placeholder="Primer Nombre"
      value={personaDataRelacion.Primer_Nombre}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="Nombre_Tutor" className="text-gray-700 font-medium">
    Apellido
    </label>
    <input
      id="Primer_Apellido"
      type="text"
      name="Primer_Apellido"  
      placeholder="Primer Apellido"
      value={personaDataRelacion.Primer_Apellido}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="Sexo_Tutor" className="text-gray-700 font-medium">
      Sexo
    </label>
    <select
      id="Sexo_Tutor"
      name="Sexo"  
      value={personaDataRelacion.Sexo}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    >
      <option value="">Seleccione Sexo</option>
      <option value="1">Masculino</option>
      <option value="0">Femenino</option>
    </select>
  </div>
  <div className="flex flex-col">
    <label htmlFor="Direccion_Tutor" className="text-gray-700 font-medium">
      Dirección
    </label>
    <input
      id="Direccion_Tutor"
      type="text"
      name="Direccion"  
      placeholder="Dirección del Tutor"
      value={personaDataRelacion.Direccion}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="Telefono_Tutor" className="text-gray-700 font-medium">
      Teléfono
    </label>
    <input
      id="Telefono_Tutor"
      type="text"
      name="Telefono"  
      placeholder="Teléfono del Tutor"
      value={personaDataRelacion.Telefono}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
</div>
<br></br>
<div className="flex justify-end">
  {personaDataRelacion.esNuevo ? (
    // Mostrar botón "Registrar" si es nuevo y tiene permiso para insertar
    permisos.Permiso_Insertar === "1" && (
      <button
        onClick={handlePersonaSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Registrar
      </button>
    )
  ) : (
    // Mostrar botón "Actualizar" si no es nuevo y tiene permiso para actualizar
    permisos.Permiso_Actualizar === "1" && (
      <button
        onClick={handlePersonaSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Actualizar
      </button>
    )
  )}

  <button
    type="button"
    onClick={handleCancelRelacion}
    className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Cancelar
  </button>
</div>

   {/* Tabla de Relaciones */}

   <ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(estudianteData?.Id_Estudiante)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={estudianteData?.Nombre_Completo}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>




   <div>
        <center><h2 className="text-2xl font-semibold text-gray-700"><strong>Tutores</strong></h2></center>
        <table className="min-w-full mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Identidad</th>
              <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold textcenter">Persona Relacionada</th>
              <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Estado</th>
              <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Observaciones</th>
              <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Acciones</th>

            </tr>
          </thead>
          
          <tbody>
  {estudianteData.Relaciones?.length > 0 ? (
    estudianteData.Relaciones
    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2) 
    .map((relacion) => (
      <tr key={relacion.Id} className="hover:bg-gray-50">
         <td className="border px-4 py-2">{relacion.Persona?.Identidad}</td>
        <td className="border px-4 py-2">
          {relacion.Persona?.Primer_Nombre} {relacion.Persona?.Primer_Apellido}
        </td>
        <td className="border px-4 py-2">{relacion.Estado}</td>
        <td className="border px-4 py-2">{relacion.Observaciones}</td>
        <td className="border px-4 py-2 flex justify-center items-center space-x-2">
  {permisos.Permiso_Actualizar === "1" && (
    <button
      onClick={() => handleEditTutor(relacion)}
      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      <PencilSquareIcon className="h-6 w-6" />
    </button>
  )}
  {permisos.Permiso_Eliminar === "1" && (
    <button
      onClick={() => handleDeleteRelacion(relacion.Id)}
      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
    >
      <TrashIcon className="h-6 w-6" />
    </button>
  )}
</td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="text-center border px-4 py-2">
        No hay relaciones disponibles.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
</div>

)}

{/* Sección Benefactor */}
{activeTab === 3 && (
  <div>
<div>
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Nombre Completo Estudiante
  </label>
  
  <input
    type="text"
    name="NombreCompleto"
    value={`
      ${personaData.Primer_Nombre || "Sin Nombre"} 
      ${personaData.Segundo_Nombre || ""} 
      ${personaData.Primer_Apellido || ""} 
      ${personaData.Segundo_Apellido || ""}`.trim()}
    disabled
    className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 text-gray-500 cursor-not-allowed"
  />
</div>


  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">

  

  <div className="flex flex-col">


    
    <label htmlFor="Identidad_Tutor" className="text-gray-700 font-medium">
      Identidad
    </label>
    <input
      id="Identidad_Tutor"
      name="Identidad"  
      placeholder="Número de Identidad"
      value={personaDataRelacion.Identidad}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="Nombre_Tutor" className="text-gray-700 font-medium">
    Nombre
    </label>
    <input
      id="Primer_Nombre"
      type="text"
      name="Primer_Nombre"  
      placeholder="Primer Nombre"
      value={personaDataRelacion.Primer_Nombre}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="Nombre_Tutor" className="text-gray-700 font-medium">
   Apellido
    </label>
    <input
      id="Primer_Apellido"
      type="text"
      name="Primer_Apellido"  
      placeholder="Primer Apellido"
      value={personaDataRelacion.Primer_Apellido}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="Sexo_Tutor" className="text-gray-700 font-medium">
      Sexo
    </label>
    <select
      id="Sexo_Tutor"
      name="Sexo"  
      value={personaDataRelacion.Sexo}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    >
      <option value="">Seleccione Sexo</option>
      <option value="1">Masculino</option>
      <option value="0">Femenino</option>
    </select>
  </div>
  <div className="flex flex-col">
    <label htmlFor="Direccion_Tutor" className="text-gray-700 font-medium">
      Dirección
    </label>
    <input
      id="Direccion_Tutor"
      type="text"
      name="Direccion"  
      placeholder="Dirección del Benefactor"
      value={personaDataRelacion.Direccion}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="Telefono_Tutor" className="text-gray-700 font-medium">
      Teléfono
    </label>
    <input
      id="Telefono_Tutor"
      type="text"
      name="Telefono"  
      placeholder="Teléfono del Benefactor"
      value={personaDataRelacion.Telefono}
      onChange={handleTutorInputChange}
      required
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
    />
  </div>
</div>
<br></br>
<div className="flex justify-between">
  {personaDataRelacion.esNuevo ? (
    // Mostrar botón "Registrar" si tiene permiso de inserción
    permisos.Permiso_Insertar === "1" && (
      <button
        onClick={handlePersonaSubmit}
        className="bg-blue-500 text-white p-3 rounded shadow-md hover:bg-blue-600"
      >
        Registrar
      </button>
    )
  ) : (
    // Mostrar botón "Actualizar" si tiene permiso de actualización
    permisos.Permiso_Actualizar === "1" && (
      <button
        onClick={handlePersonaSubmit}
        className="bg-blue-500 text-white p-3 rounded shadow-md hover:bg-blue-600"
      >
        Actualizar
      </button>
    )
  )}

  <button
    type="button"
    onClick={handleCancelRelacion}
    className="bg-red-500 text-white p-3 rounded shadow-md hover:bg-gray-600"
  >
    Cancelar
  </button>
</div>

   {/* Tabla de Relaciones */}



   <div>
   <center><h2 className="text-2xl font-semibold text-gray-700"><strong>Benefactores</strong></h2></center>
        <table className="min-w-full mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Identidad</th>
              <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold textcenter">Persona Relacionada</th>
              <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Estado</th>
              <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Observaciones</th>
              <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Acciones</th>

            </tr>
          </thead>
          <tbody>
  {estudianteData.Relaciones?.length > 0 ? (
    estudianteData.Relaciones
    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3) 
    .map((relacion) => (
      <tr key={relacion.Id} className="hover:bg-gray-50">
        <td className="border px-4 py-2">{relacion.Persona?.Identidad}</td>
        <td className="border px-4 py-2">
          {relacion.Persona?.Primer_Nombre} {relacion.Persona?.Primer_Apellido}
        </td>
        <td className="border px-4 py-2">{relacion.Estado}</td>
        <td className="border px-4 py-2">{relacion.Observaciones}</td>
        <td className="border px-4 py-2 flex justify-center items-center space-x-2">
  {permisos.Permiso_Actualizar === "1" && (
    <button
      onClick={() => handleEditTutor(relacion)}
      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      <PencilSquareIcon className="h-6 w-6" />
    </button>
  )}
  {permisos.Permiso_Eliminar === "1" && (
    <button
      onClick={() => handleDeleteRelacion(relacion.Id)}

      
      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
    >
      <TrashIcon className="h-6 w-6" />
    </button>
  )}
</td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="text-center border px-4 py-2">
        No hay relaciones disponibles.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
</div>


)}

{/* Sección Graduandos */}
{activeTab === 4 && (
  <div>
  <GraduandoInner estudiante={selectedStudent}  />
</div>


)}


        </form>


          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar estudiante "
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 w-full mb-4"
            />
            <table className="xls_style-excel-table">
              <thead>
                <tr classname ="bg-gray-100">
                <th >#</th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Identidad</th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Nombre</th>

                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Instituto</th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              {permisos?.Permiso_Consultar === "1" && (
              <tbody>
                {filteredEstudiantes.map((estudiante,index) => (
                  
                  <tr key={estudiante.Id_Estudiante}>
                        <td >
                      {index + 1}
                    </td>
                         <td >
                      {estudiante.Persona.Identidad}
                    </td>
                    <td >{`${estudiante.Persona.Primer_Nombre} ${estudiante.Persona.Primer_Apellido}`}</td>
                    <td >
                      {estudiante.Instituto.Nombre_Instituto}
                    </td>
                    <td className="xls_center">
  {permisos.Permiso_Actualizar === "1" && (
    <button
      onClick={() => handleEdit(estudiante)}
      className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      <PencilSquareIcon className="h-6 w-6" />
    </button>
  )}

  {permisos.Permiso_Eliminar === "1" && (
    <button
    


      onClick={() => {
        setEstudianteData(estudiante)
         showModal("modalConfirmacion");
       }}
      className="m-1 px-1 py-1 bg-red-500 text-white rounded hover:bg-red-700 padd" 
    >
      <TrashIcon className="h-6 w-6" />
    </button>
  )}
</td>

                  </tr>
                ))}
              </tbody>)}
            </table>
          </div>
        </div>

    </Layout>
  );
};

export default EstudiantesCrud;
