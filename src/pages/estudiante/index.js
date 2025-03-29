import { useState, useEffect, useContext,useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import AuthContext from "../../context/AuthContext";
import { ArrowDownCircleIcon ,ShieldExclamationIcon,HomeIcon, PencilSquareIcon, TrashIcon, CheckIcon,MagnifyingGlassIcon,UserPlusIcon, EyeIcon   } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
//import GraduandoTable from '../../components/GraduandoTable';
//import GraduandoInner from '../../components/GraduandoInner';
import { useRouter } from 'next/router';

import dynamic from "next/dynamic";
import "react-step-progress-bar/styles.css";

import ModalGenerico from '../../utils/ModalGenerico';
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import RelacionForm from '../../components/basicos/RelacionForm';
import useModal from "../../hooks/useModal";
import { obtenerEstados } from "../../utils/api"; // Importar la función

import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionEstudiante, reglasValidacionPersona ,reglasValidacionRelacion} from "../../../models/ReglasValidacionModelos";
const EstudiantesCrud = () => {
  //const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [estados, setEstados] = useState([]);
  // const [modals, setModals] = useState({
  //   modalConfirmacion: false,Estudian
  //   modalEliminarTutor: false,
  //   modalEliminarBenefactor: false,
  // });
  const [isEditing, setIsEditing] = useState(false);
  const openModal = (modalKey) => {
    setModals(prev => ({ ...prev, [modalKey]: true }));
  };
  
  //const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales

  
  // const closeModal = (modalKey) => {
  //   setModals(prev => ({ ...prev, [modalKey]: false }));
  // };

  const resetForm = () => {
    setGraduacion({ 

      Anio: '',
      Fecha_Inicio: '',
      Fecha_Final: '',
      Creado_Por: '',
      Estudiante: null,
      Id_Estudiante:null

    });
    setIsEditing(false);
  };

  const router = useRouter();


  const { tab, idEstudiante, relacionId } = router.query;
  const [activeTab, setActiveTab] = useState(1); // para las pestañas en el mismo formulario
  const { user } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [graduacion, setGraduacion] = useState([]);
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

  const cargarEstados = useCallback(async () => {
  //  setLoading(true);
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  //  setLoading(false);
}, []); // 🔥 Se ejecu


  // Importar dinámicamente para evitar problemas con SSR
const ProgressBar = dynamic(() => import("react-step-progress-bar").then(mod => mod.ProgressBar), { ssr: false });
const Step = dynamic(() => import("react-step-progress-bar").then(mod => mod.Step), { ssr: false });

const [currentStep, setCurrentStep] = useState(1); // Estado para el paso actual

const nextStep = () => {
  if (currentStep < 4) setCurrentStep(currentStep + 1);
};

const prevStep = () => {
  if (currentStep > 1) setCurrentStep(currentStep - 1);
};

// Barra de Progreso
<div className="mb-6">
  <ProgressBar percent={(currentStep - 1) * 33.33} filledBackground="blue">
    <Step>{({ accomplished }) => <div className={accomplished ? "completed" : "step"}>1</div>}</Step>
    <Step>{({ accomplished }) => <div className={accomplished ? "completed" : "step"}>2</div>}</Step>
    <Step>{({ accomplished }) => <div className={accomplished ? "completed" : "step"}>3</div>}</Step>
    <Step>{({ accomplished }) => <div className={accomplished ? "completed" : "step"}>4</div>}</Step>
  </ProgressBar>
</div>

// Contenido de cada paso
{currentStep === 1 && <div>Paso 1: Información Personal</div>}
{currentStep === 2 && <div>Paso 2: Tutor/Padre</div>}
{currentStep === 3 && <div>Paso 3: Benefactor</div>}
{currentStep === 4 && <div>Paso 4: Confirmación</div>}
 
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

    Estado:1

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
      Id_Tipo_Persona:1,
      Estado:1
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
      Id_Municipio: "",
      Id_Tipo_Persona:1,
      Estado:1
    });

    setGraduacion({
      Anio: '',
      Fecha_Inicio: '',
      Fecha_Final: '',
      Creado_Por: '',
      Estudiante: null,
      Id_Estudiante:null
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
    Id_Estudiante: 0,
    esNuevo:true,
    Id_Tipo_Persona:1,
    Estado:1

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
    cargarEstados();
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
  }, [user,idEstudiante]);
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get("/api/estudiantes");
      setEstudiantes(response.data);


 

       // Si hay un estudiante seleccionado, actualizarlo
    if (selectedStudent||idEstudiante) {

      const updatedStudent = response.data.find(
        (e) => e.Id_Estudiante === selectedStudent?.Id_Estudiante ||  e.Id_Estudiante === Number( idEstudiante)
      );
      console.log("updatedStudent")
      console.log(updatedStudent)
      setSelectedStudent(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe
  
      handleEdit(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe

 

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


const nuevoTutor= (tipo=1)=>{

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
    Estudiante:estudianteData,
    Id_estudiante:idEstudiante


  })

  personaDataRelacion.Estudiante.Persona=personaData;
  personaDataRelacion.Id_Tipo_Persona=tipo;

switch (tipo) {
  case 2:
    showModal("modalRelacion")
    break;
    case 3:
      showModal("modalRelacionBenefactor")
      break;


}
 

}


useEffect(() => {
  //if (personaDataRelacion?.esNuevo) {
   // showModal("modalRelacion");
 // }
}, [personaDataRelacion]);



  const handleTabChange = (tabIndex) => {
    
    
    if (selectedStudent==null) {
      toast.error("Seleccione un estudiante", error);
      return;
    }
    
 

    switch(tabIndex){
      
      case 1:

      personaData.Id_Tipo_Persona=1;

      if(estudianteData==null){
        personaDataRelacion.esNuevo=true;
        personaDataRelacion.Id_Persona=null;
        
      }
    
        

      break;
   
      case 2:
        if (selectedStudent==null) {
          toast.error("Seleccione un estudiante", error);
          return;
        }
        
        personaDataRelacion.Id_Tipo_Persona=2;
        personaDataRelacion.esNuevo=true;
        personaDataRelacion.Id_Persona=null;
        resizeTo();

      break;
           
      case 3:
        if (selectedStudent==null) {
          toast.error("Seleccione un estudiante", error);
          return;
        }
        
        personaDataRelacion.Id_Tipo_Persona=3;
        personaDataRelacion.esNuevo=true;
        personaDataRelacion.Id_Persona=null;


      resizeTo();

      case 4:
        if (selectedStudent==null) {
          toast.error("Seleccione un estudiante", error);
          return;
        }
        

   

        setSelectedStudent(estudianteTemp);
        personaDataRelacion.esNuevo=false;
        personaDataRelacion.Id_Persona=null;


      resizeTo();

      break;


    }

    setActiveTab(tabIndex);
  };
  
  const fetchInstitutos = async () => {
    try {
      const response = await axios.get("/api/institutos");
      setInstitutos(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

    
  const fetchGraduacionold = async () => {
    try {
      const response = await axios.get('/api/graduandos?Id_Estudiante=123');
      setGraduacion(response.data);
    } catch (error) {

      console.error("Error al obtener estudiantes", error);
    }
  };



    // Verificación de permisos
    const fetchGraduacion = async (id_Estudiante) => {
      try {
   
        
          const response = await axios.post('/api/api_graduacion', {
            Id_Estudiante : id_Estudiante,
           
          });
  
          const permisosData = response.data;
  
          setGraduacion(permisosData);
          setIsEditing(true);
    
      
      } catch (err) {
        //setError(err.response?.data?.error || 'Error al obtener permisos');
        resetForm();
        setIsEditing(false);
        graduacion.Estudiante=estudianteTemp;
      }
    };

  const fetchGraduacionold2 = async ({ id, Id_Estudiante }) => {
    try {
      // Construye la URL con los parámetros de consulta
      const url = new URL('/api/graduandos', window.location.origin);
      if (id) url.searchParams.append('id', 0);
      if (Id_Estudiante) url.searchParams.append('Id_Estudiante',  Id_Estudiante);
  
      // Hace la solicitud GET
      const response = await fetch(url.toString());
      setGraduacion(response.data);
      // Si la respuesta no es exitosa, lanza un error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener el graduando');
      }
  
      // Devuelve los datos del graduando
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error.message);
      throw error; // Propaga el error para manejarlo en el componente
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
      
      closeModal("modalRelacion")
      closeModal("modalRelacionBenefactor")
      
   
    
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
  personaData.Sexo=Number(personaData.Sexo);
  estudianteData.Estado=Number(personaData.Estado);
 const errores = validarFormulario(personaData, reglasValidacionPersona);

    if (errores.length > 0) {
   
      console.log(errores);
    //toast.error(errores.join("\n"), error);
      return;
    }

    const errores2 = validarFormulario(estudianteData, reglasValidacionEstudiante);

    if (errores2.length > 0) {
   
      toast.error(errores2.join("\n"), error);
      return;
    }


      // Enviar datos del formulario para crear un nuevo graduando




  try {
    if (editId) {
      // Actualización de registro
      let res = await axios.put(`/api/estudiantes/${editId}`, {
        estudianteData,
        personaData,
      });
      setSelectedStudent(estudianteData);
       // Limpiar el estudiante seleccionado
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


  // Manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGraduacion({
      ...graduacion,
      [name]: value,
    });
  };

const handleClearSearch = () => {
  setSearchQuery("");
  setCurrentPage(1); // Reiniciar a la primera página
}; 

const handleSubmitGraduacion = async (e) => {
  e.preventDefault();


  try {

    graduacion.Creado_Por=user.id;
    graduacion.Modificado_Por=user.id;
    graduacion.Estudiante=selectedStudent;  
    graduacion.Id_Estudiante=selectedStudent.Id_Estudiante;

    if (!isEditing){

      
      await axios.post('/api/graduando', graduacion);
      
      toast.success('graduando agregado exitosamente',
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
      

    }else{
      await axios.put(`/api/graduando/${graduacion.Id_Graduando}`, graduacion);

      
      toast.success('graduando actualizado exitosamente',
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

 //   resetForm();
    // Recargar los graduandos después de agregar uno nuevo
    const response = await axios.get('/api/graduando');

   // setGraduandos(response.data);
  } catch (error) {
    toast.error('Error al crear un graduando:', error);
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
      Id_Municipio: "",
      Id_Tipo_Persona:1,
      Estado:1
    });

    setEstudianteData({
      Id_Beneficio: "",
      Id_Area: "",
      Id_Instituto: "",
      Creado_Por: "",
      Relaciones: [], 

    });

    setEstudianteTemp(null);

    setSelectedStudent(null)
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
      Id_Estudiante:estudiante.Id_Estudiante,
      Relaciones:estudiante.Relaciones
    });

    setEditPersonaId(estudiante.Persona.Id_Persona);
    setPersonaData(estudiante.Persona);

    graduacion.Id_Estudiante=estudiante.Id_Estudiante;
    fetchGraduacion(estudiante.Id_Estudiante)

    if (estudiante.Persona.Id_Departamento) {
      fetchMunicipios(estudiante.Persona.Id_Departamento);
    }
     // **Posicionar el scroll al inicio**
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Hace el scroll suave
  });
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
  Estado:tutor.Estado,
  Update:true,
  esNuevo:false,
  Id: tutor.Id,
  Id_Tipo_Persona:tutor.Id_Tipo_Persona


})

switch (personaDataRelacion.Id_Tipo_Persona) {
  case value:
    showModal("modalRelacion")
    break;

    case value:
      showModal("modalRelacionBenefactor")
      break;


}
    
//showModal("modalRelacion")modalRelacionBenefactor

  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/estudiantes/${id}`);
      fetchEstudiantes();
      if (selectedStudent?.Id_Estudiante === id) {
        setSelectedStudent(null); // Limpiar la selección si fue eliminado
      }
      closeModal("")
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

<div className="mb-1 flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
  {/* Barra de búsqueda */}
  <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
    <MagnifyingGlassIcon className="h-6 w-6 mr-2 text-gray-600" />



<input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      className="border-none focus:ring-0 w-200 text-gray-700 bg-transparent"
      placeholder="Buscar por nombre o correo"
    />
  </div>

  {/* Título de la sección */}
  <p className="text-3xl font-bold text-blue-700">📋Nuevo Registro Estudiante</p>

  {/* Botones de acciones */}
  <div className="flex gap-x-2">

    {/* Botón para abrir el modal de agregar usuario */}
<button
  onClick={() => (window.location.href = "/estudiante/reporte")}
  className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
>
  <EyeIcon className="h-5 w-5 mr-2" /> Estudiantes
</button>
    



  </div>
  </div>

         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-10">
  {/* Pestañas */}
  {/* <div className="flex border-b-2">
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
  </div> */}

  {/* Sección Estudiante */}
{/* Sección Estudiante */}
{activeTab === 1 && (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold text-gray-800">Datos del Estudiante</h2>

    <table className="w-full border border-gray-300 text-sm">
      <tbody>
        <tr>
          <td className="border p-2 font-medium text-gray-700">Primer Nombre</td>
          <td className="border p-2">
            <input id="Primer_Nombre" type="text" name="Primer_Nombre" placeholder="Primer Nombre" value={personaData.Primer_Nombre} onChange={handlePersonaInputChange} required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
          <td className="border p-2 font-medium text-gray-700">Primer Apellido</td>
          <td className="border p-2">
            <input id="Primer_Apellido" type="text" name="Primer_Apellido" placeholder="Primer Apellido" value={personaData.Primer_Apellido} onChange={handlePersonaInputChange} required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
        </tr>

        <tr>
          <td className="border p-2 font-medium text-gray-700">Segundo Nombre</td>
          <td className="border p-2">
            <input id="Segundo_Nombre" type="text" name="Segundo_Nombre" placeholder="Segundo Nombre" value={personaData.Segundo_Nombre} onChange={handlePersonaInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
          <td className="border p-2 font-medium text-gray-700">Segundo Apellido</td>
          <td className="border p-2">
            <input id="Segundo_Apellido" type="text" name="Segundo_Apellido" placeholder="Segundo Apellido" value={personaData.Segundo_Apellido} onChange={handlePersonaInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
        </tr>

        <tr>
          <td className="border p-2 font-medium text-gray-700">Número de Identidad</td>
          <td className="border p-2">
            <input id="Identidad" type="text" name="Identidad" placeholder="Número de Identidad" value={personaData.Identidad} onChange={handlePersonaInputChange} required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
          <td className="border p-2 font-medium text-gray-700">Sexo</td>
          <td className="border p-2">
            <select id="Sexo" name="Sexo" value={personaData.Sexo} onChange={handlePersonaInputChange} required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300">
              <option value="">Seleccione un sexo</option>
              {sexos.map((sexo) => (
                <option key={sexo.id} value={sexo.id}>{sexo.descripcion}</option>
              ))}
            </select>
          </td>
        </tr>

        <tr>
          <td className="border p-2 font-medium text-gray-700">Fecha de Nacimiento</td>
          <td className="border p-2">
            <input id="Fecha_Nacimiento" type="date" name="Fecha_Nacimiento" value={personaData.Fecha_Nacimiento} onChange={handlePersonaInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
          <td className="border p-2 font-medium text-gray-700">Lugar de Nacimiento</td>
          <td className="border p-2">
            <input id="Lugar_Nacimiento" type="text" name="Lugar_Nacimiento" value={personaData.Lugar_Nacimiento} onChange={(e) => setPersonaData({ ...personaData, [e.target.name]: e.target.value })} placeholder="Lugar de nacimiento" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" required />
          </td>
        </tr>

        <tr>
          <td className="border p-2 font-medium text-gray-700">Departamento</td>
          <td className="border p-2">
            <select id="Id_Departamento" name="Id_Departamento" value={personaData.Id_Departamento} onChange={handlePersonaInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" required>
              <option value="">Seleccione un Departamento</option>
              {departamentos.map((departamento) => (
                <option key={departamento.Id_Departamento} value={departamento.Id_Departamento}>{departamento.Nombre_Departamento}</option>
              ))}
            </select>
          </td>
          <td className="border p-2 font-medium text-gray-700">Municipio</td>
          <td className="border p-2">
            <select id="Id_Municipio" name="Id_Municipio" value={personaData.Id_Municipio} onChange={handlePersonaInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" required>
              <option value="">Seleccione un Municipio</option>
              {municipios.map((municipio) => (
                <option key={municipio.Id_Municipio} value={municipio.Id_Municipio}>{municipio.Nombre_Municipio}</option>
              ))}
            </select>
          </td>
        </tr>

        <tr>
          <td className="border p-2 font-medium text-gray-700">Dirección</td>
          <td className="border p-2">
            <input id="Direccion" type="text" name="Direccion" placeholder="Dirección" value={personaData.Direccion} onChange={handlePersonaInputChange} required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
          <td className="border p-2 font-medium text-gray-700">Teléfono</td>
          <td className="border p-2">
            <input id="Telefono" type="text" name="Telefono" placeholder="Teléfono" value={personaData.Telefono} onChange={handlePersonaInputChange} required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
        </tr>

        <tr>
          <td className="border p-2 font-medium text-gray-700">Área</td>
          <td className="border p-2">
            <select id="Id_Area" name="Id_Area" value={estudianteData.Id_Area} onChange={handleEstudianteInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" required>
              <option value="">Selecciona un Área</option>
              {areas.map((area) => (
                <option key={area.Id_Area} value={area.Id_Area}>{area.Nombre_Area}</option>
              ))}
            </select>
          </td>
          <td className="border p-2 font-medium text-gray-700">Instituto</td>
          <td className="border p-2">
            <select id="Id_Instituto" name="Id_Instituto" value={estudianteData.Id_Instituto} onChange={handleEstudianteInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" required>
              <option value="">Selecciona un Instituto</option>
              {institutos.map((instituto) => (
                <option key={instituto.Id_Instituto} value={instituto.Id_Instituto}>{instituto.Nombre_Instituto}</option>
              ))}
            </select>
          </td>
        </tr>

        <tr>
          <td className="border p-2 font-medium text-gray-700">Beneficio</td>
          <td className="border p-2">
            <select id="Id_Beneficio" name="Id_Beneficio" value={estudianteData.Id_Beneficio} onChange={handleEstudianteInputChange} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" required>
              <option value="">Selecciona un Beneficio</option>
              {beneficios.map((beneficio) => (
                <option key={beneficio.Id_Beneficio} value={beneficio.Id_Beneficio}>{beneficio.Nombre_Beneficio}</option>
              ))}
            </select>
          </td>
          <td className="border p-2 font-medium text-gray-700">Estado</td>
          <td className="border p-2">
            <select id="Estado" name="Estado" value={personaData.Estado} onChange={handlePersonaInputChange} required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300">
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </td>
        </tr>
        <tr>
          <td colSpan={4}>
            
    <div className="flex justify-between mt-4">
      {editId ? (
        permisos.Permiso_Actualizar === "1" && (
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Actualizar
          </button>
        )
      ) : (
        permisos.Permiso_Insertar === "1" && (
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Agregar
          </button>
        )
      )}

      <button type="button" onClick={handleCancel} className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
        Cancelar
      </button>
    </div>
          </td>
        </tr>
      </tbody>

      
    </table>


    <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold text-gray-700">
    <strong>Tutores</strong>
  </h2>
  
  <button
    onClick={() => nuevoTutor(2)}
    type="button"
    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    + Agregar Tutor
  </button>


  <ModalGenerico
  isOpen={modals["modalRelacion"]}
  onClose={() => closeModal("modalRelacion")}
  titulo={personaDataRelacion?.esNuevo ? "Agregar Tutor" : "Actualizar Tutor"}
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
/>

</ModalGenerico>
</div>



  <table className="xls_style-excel-table">
    <thead className="bg-gray-100">
      <tr>
        <th className="">Identidad</th>
        <th className="">Persona Relacionada</th>
        <th className="">Estado</th>
        <th className="">Observaciones</th>
        <th className="">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {estudianteData.Relaciones?.length > 0 ? (
        estudianteData.Relaciones
          .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2)
          .map((relacion) => {
            const estado = estados.find(e => e.Codigo_Estado === relacion.Estado);
            return (
              <tr key={relacion.Id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-sm text-center border-b">{relacion.Persona?.Identidad}</td>
                <td className="px-4 py-2 text-sm text-center border-b">
                  {relacion.Persona?.Primer_Nombre} {relacion.Persona?.Primer_Apellido}
                </td>
                <td className="px-4 py-2 text-sm text-center border-b">
                  {estado ? estado.Nombre_Estado : "Desconocido"}
                </td>
                <td className="px-4 py-2 text-sm text-center border-b">{relacion.Observaciones}</td>
                <td className="px-4 py-2 text-sm text-center border-b">
                  <div className="flex justify-center gap-2">
                    {permisos.Permiso_Actualizar === "1" && (
                      <button
                        type="button"
                        onClick={() => handleEditTutor(relacion)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    )}
                    {permisos.Permiso_Eliminar === "1" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRelacion(relacion.Id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
      ) : (
        <tr>
          <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
            No hay tutores registrados.
          </td>
        </tr>
      )}
    </tbody>
  </table>

  <h2 className="text-xl font-semibold text-gray-800 mb-4">Benefactores </h2>

  
  <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold text-gray-700">
    <strong>Tutores</strong>
  </h2>
  
  <button
    onClick={() => nuevoTutor(3)}
    type="button"
    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    + Agregar Benefactor
  </button>
  </div>



  <ModalGenerico
  isOpen={modals["modalRelacionBenefactor"]}
  onClose={() => closeModal("modalRelacionBenefactor")}
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
  formId="formbenefactor" // 👈 útil para validación DOM con ID
/>

</ModalGenerico>


<h2 className="text-xl font-semibold text-gray-800 mb-4">Información de Graduación</h2>

  <table className="xls_style-excel-table">
    <thead className="bg-gray-100">
      <tr>
        <th className="">Año</th>
        <th className="">Fecha de Inicio</th>
        <th className="">Fecha de Finalización</th>
        <th className="">Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr className="text-center hover:bg-gray-50">
        <td className="border px-4 py-2">{graduacion.Anio}</td>
        <td className="border px-4 py-2">{graduacion.Fecha_Inicio}</td>
        <td className="border px-4 py-2">{graduacion.Fecha_Final || "No finalizada"}</td>
        <td className="border px-4 py-2">
          {
            estados.find(e => e.Codigo_Estado === graduacion.Estado)?.Nombre_Estado || "Desconocido"
          }
        </td>
      </tr>
    </tbody>
  </table>






  </div>
)}

{/* Sección Tutor/Padre */}
{activeTab === 2 && (
<table>

</table>

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

                    {/* Campo de estado genérico */}
                    <label>Estado:</label>
            <select             className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="Estado" value={personaDataRelacion.Estado || ""} onChange={handleTutorInputChange} required>
                <option value="">Seleccione un estado</option>
                {estados.map((estado) => (
                    <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
                        {estado.Nombre_Estado}
                    </option>
                ))}
            </select>
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


  <div>



<form onSubmit={handleSubmitGraduacion}>



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
<div>
  <label htmlFor="Anio" className="block mb-2 text-sm font-medium text-gray-700">
    Año:
  </label>
  <input
    type="number"
    name="Anio"
    value={graduacion.Anio}
    onChange={handleChange}
    required
    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Ingrese el año"
  />
</div>

<div>
  <label htmlFor="Fecha_Inicio" className="block mb-2 text-sm font-medium text-gray-700">
    Fecha de Inicio:
  </label>
  <input
    type="date"
    name="Fecha_Inicio"
    value={graduacion.Fecha_Inicio}
    onChange={handleChange}
    required
    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div>
  <label htmlFor="Fecha_Final" className="block mb-2 text-sm font-medium text-gray-700">
    Fecha de Finalización:
  </label>
  <input
    type="date"
    name="Fecha_Final"
    value={graduacion.Fecha_Final}
    onChange={handleChange}
    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
<div>
                    {/* Campo de estado genérico */}
                    <label>Estado:</label>
            <select             className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="Estado" value={graduacion.Estado || ""} onChange={handleChange} required>
                <option value="">Seleccione un estado</option>
                {estados.map((estado) => (
                    <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
                        {estado.Nombre_Estado}
                    </option>
                ))}
            </select>
</div>
<br></br>

<div className="flex justify-end">
{isEditing
? // Mostrar botón "Actualizar" solo si tiene permisos de actualización
permisos.Permiso_Actualizar === "1" && (
  <button
  onClick={handleSubmitGraduacion}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Actualizar
  </button>
)
: // Mostrar botón "Agregar" solo si tiene permisos de inserción
permisos.Permiso_Insertar === "1" && (
  <button
  onClick={handleSubmitGraduacion}
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

            
 
  <ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(estudianteData?.Id_Estudiante)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={estudianteData?.Persona?.Primer_Nombre}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>


          </div>
       

    </Layout>
  );
};

export default EstudiantesCrud;
