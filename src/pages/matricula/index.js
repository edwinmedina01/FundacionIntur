import { useState, useEffect, useContext, use } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import AuthContext from "../../context/AuthContext";
import { ShieldExclamationIcon,HomeIcon, PencilSquareIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const MatriculaCrud = () => {
  const router = useRouter();
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
  const [modalidades, setModalidades] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]);
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
      fetchModalidades();
      fetchGrados();
      fetchSecciones();
      fetchPermisos(user.rol);

    }
  }, [user]);
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
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);

    switch(tabIndex){
      
      case 1:

      personaData.Id_Tipo_Persona=1;
        

      break;
   
      case 2:
        
        personaDataRelacion.Id_Tipo_Persona=2;


      break;
           
      case 3:

      personaDataRelacion.Id_Tipo_Persona=3;


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

  const fetchModalidades = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/modalidades');
      setModalidades(response.data);
    } catch (error) {
      console.error('Error fetching modalidades:', error);
    }
  };

  
  const fetchGrados = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/grado');
      setGrados(response.data);
    } catch (error) {
      console.error('Error fetching modalidades:', error);
    }
  };

    
  const fetchSecciones = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/seccion');
      setSecciones(response.data);
    } catch (error) {
      console.error('Error fetching modalidades:', error);
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





const handleClearSearch = () => {
  setSearchQuery("");
  setCurrentPage(1); // Reiniciar a la primera página
}; 

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (estudianteData.Id_Matricula != null) {
      // Actualización de registro
      let res = await axios.put(`/api/matricula/${estudianteData.Id_Matricula}`, {
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

      let res = await axios.post("/api/matricula", { personaData, estudianteData });
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
    toast.error("Error al guardar estudiante y persona", {
      style: {
        backgroundColor: '#ffebee', // Fondo suave rojo
        color: '#d32f2f', // Texto rojo oscuro
        fontWeight: 'bold',
        border: '1px solid #f5c6cb',
        padding: '16px',
        borderRadius: '12px',
      },
      position: 'bottom-right', // Posición en la esquina inferior derecha
      autoClose: 5000, // Cierra automáticamente en 5 segundos
      hideProgressBar: true, // Ocultar barra de progreso
    });
    console.error(error);
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
      MatriculaId:null

    });
    
    setEditId(null); //correccion para el estado del boton "registrar estudiante, y no se quede en actualizar cuando se cancele"
  };

  const handleEdit = (estudiante) => {

    setPersonaDataRelacion({
      ...personaDataRelacion,
      Estudiante: estudiante, // Guarda el objeto completo del estudiante
    });

 console.log("handleEdit")
 console.log(estudiante)

    setSelectedStudent(estudiante); 
    setEditId(estudiante.Id_Estudiante);
    setEstudianteTemp(estudiante);
    setEstudianteData({
      Id_Beneficio: estudiante.Id_Beneficio,
      Id_Area: estudiante.Id_Area,
      Id_Instituto: estudiante.Id_Instituto,
      Creado_Por: estudiante.Creado_Por,
   
      Id_Estudiante:estudiante.Id_Estudiante,
      Id_Matricula:  estudiante.Matriculas.length>0?estudiante.Matriculas[0].Id_Matricula:null,
      Id_Grado:estudiante.Matriculas.length>0?estudiante.Matriculas[0].Id_Grado:null,
      Id_Seccion:estudiante.Matriculas.length>0?estudiante.Matriculas[0].Id_Seccion:null,
      Id_Modalidad:estudiante.Matriculas.length>0?estudiante.Matriculas[0].Id_Modalidad:null
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
      toast.error("Error al eliminar estudiante", error);
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

        <div className="mb-6">
          
            <input
              type="text"
              placeholder="Buscar estudiante "
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 w-full mb-4"
            />    {/* Botón para ir a matricula */}
            <button
            onClick={() => router.push('/matriculageneral')}
            className="bg-cyan-900 text-white px-3 py-1 rounded hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
            ><strong>
            Ver Matriculas
          </strong></button>
                    {/* <label htmlFor="Id_Grado" className="text-gray-700">Estudiante</label>
                    <select
  id="Id_Estudiante"
  name="Id_Estudiante"
  value={estudianteData.Id_Grado || ""} // Agregar un valor por defecto si es undefined
  onChange={(e) => {
    const idGradoSeleccionado = e.target.value;
    const estudianteSeleccionado = filteredEstudiantes.find(
      (estudianteitem) => estudianteitem.Id_Estudiante === idGradoSeleccionado
    );
    handleEdit(estudianteSeleccionado, e); // Pasar el estudiante seleccionado
  }}
  className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 w-full mb-4"
  required
>
  <option value="">Selecciona un Estudiante</option>
  {filteredEstudiantes.map((estudianteitem) => (
    <option key={estudianteitem.Id_Estudiante} value={estudianteitem.Id_Estudiante}>
      {estudianteitem.Persona.Identidad +
        " - " +
        estudianteitem.Persona.Primer_Nombre +
        " " +
        estudianteitem.Persona.Primer_Apellido}
    </option>
  ))}
</select> */}

            <table className="min-w-full mt-4 border border-gray-300">
              <thead>
                <tr classname ="bg-gray-100">
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Identidad</th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Nombre</th>
                <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Modalidad
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Grado
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Seccion
    </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-center">Acciones</th>

                </tr>
              </thead>
              {permisos?.Permiso_Consultar === "1" && (
              <tbody>
                {filteredEstudiantes.map((estudiante) => (
                  <tr key={estudiante.Id_Estudiante} className="hover:bg-gray-50">
                    <td className="border p-3 text-center">{`${estudiante.Persona.Identidad} `}</td>
                
                    <td className="border p-3 text-center">{`${estudiante.Persona.Primer_Nombre} ${estudiante.Persona.Primer_Apellido}`}</td>
                
                    <td className="py-4 px-6 border-b">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Modalidad?.Nombre || "-"}
                  </td>

                  <td className="py-4 px-6 border-b">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Grado?.Nombre || "-"}
                  </td>
                  <td className="py-4 px-6 border-b">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Seccion?.Nombre_Seccion || "-"}
                  </td>
                    <td className="p-3 border-b flex justify-center items-center space-x-2">
  {permisos.Permiso_Actualizar === "1" && (
    <button
      onClick={() => handleEdit(estudiante)}
      className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      <PencilSquareIcon className="h-6 w-6" />
    </button>
  )}

  {/* {permisos.Permiso_Eliminar === "1" && (
    // <button
    //   onClick={() => handleDelete(estudiante.Id_Estudiante)}
    //   className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-700"
    // >
    //   <TrashIcon className="h-6 w-6" />
    // </button>
  )} */}
</td>

                  </tr>
                ))}
              </tbody>)}
            </table>
          </div>
         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-10">

  {/* Sección Estudiante */}
  {activeTab === 1 && (
    <div className="space-y-6">
  {/* Datos Personales */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Datos del Estudiante</h2>

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
            {/* Modalidad */}
            <div className="flex flex-col">
        <label htmlFor="Id_Modalidad" className="text-gray-700">Modalidad</label>
        <select
          id="Id_Modalidad"
          name="Id_Modalidad"
          value={estudianteData.Id_Modalidad}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Modalidad</option>
          {modalidades.map((modalidaditem) => (
            <option key={modalidaditem.Id_Modalidad} value={modalidaditem.Id_Modalidad}>
              {modalidaditem.Nombre}
            </option>
          ))}
        </select>
      </div>
           {/* Curso */}
           <div className="flex flex-col">
        <label htmlFor="Id_Grado" className="text-gray-700">Curso/Grado</label>
        <select
          id="Id_Grado"
          name="Id_Grado"
          value={estudianteData.Id_Grado}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Grado</option>
          {grados.map((gradoitem) => (
            <option key={gradoitem.Id_Grado} value={gradoitem.Id_Grado}>
              {gradoitem.Nombre}
            </option>
          ))}
        </select>
      </div>




    </div>

    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">-</h2>
     {/* Nombre Completo */}
<div className="flex flex-col">
  <label htmlFor="Nombre_Completo" className="text-gray-700">Nombre Completo</label>
  <input
    id="Nombre_Completo"
    type="text"
    name="Nombre_Completo"
    placeholder="Nombre Completo"
    value={`${personaData.Primer_Nombre} ${personaData.Segundo_Nombre} ${personaData.Primer_Apellido} ${personaData.Segundo_Apellido}`}
    readOnly
    required
    className="border border-gray-300 p-3 rounded bg-gray-100 cursor-not-allowed mt-2"
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

           {/* Seccion */}
           <div className="flex flex-col">
        <label htmlFor="Id_Seccion" className="text-gray-700">Seccion</label>
        <select
          id="Id_Seccion"
          name="Id_Seccion"
          value={estudianteData.Id_Seccion}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Seccion</option>
          {secciones.map((instituto) => (
            <option key={instituto.Id_Seccion} value={instituto.Id_Seccion}>
              {instituto.Nombre_Seccion}
            </option>
          ))}
        </select>
      </div>

    </div>
  </div>


  <br></br>
          <div className="flex justify-between">
          {estudianteData?.Id_Matricula
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
                    Guardar
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



        </form>


     
        </div>

    </Layout>
  );
};

export default MatriculaCrud;
