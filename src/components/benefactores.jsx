import React, { useState, useEffect, useContext,useCallback  } from 'react';
import axios from 'axios';
import { ArrowDownCircleIcon, UserPlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';
import { ShieldExclamationIcon, TrashIcon,MagnifyingGlassIcon  } from '@heroicons/react/24/outline';
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
import useModal from "../hooks/useModal";
const BenefactoresManagement = () => {
  const router = useRouter();
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales

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
    console.log("handleEdit")
    console.log(data)
    router.push({
      pathname: '/estudiante', // Ruta de la página destino
      query: {
        tab: 3,
        idEstudiante: data.Id_Estudiante,
        relacionId:data.Id_Relacion
      },
    });
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


const handleExportold = async () => {
  // 1️⃣ Crear un nuevo libro y hoja de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Benefactores");

  // 2️⃣ Definir las columnas y encabezados
  worksheet.columns = [
    { header: "Identidad", key: "Identidad", width: 20 },
    { header: "Nombre Completo", key: "Nombre", width: 30 },
    { header: "Sexo", key: "Sexo", width: 15 },
    { header: "Teléfono", key: "Telefono", width: 20 },
    { header: "Dirección", key: "Direccion", width: 40 },
  ];

  // 3️⃣ Transformar los datos antes de agregarlos
  const transformedBenefactores = Benefactores.map((Benefactor) => ({
    Identidad: Benefactor.Identidad,
    Nombre: `${Benefactor.Primer_Nombre} ${Benefactor.Primer_Apellido}`,
    Sexo: Benefactor.Sexo === 1 ? "Masculino" : "Femenino",
    Telefono: Benefactor.telefono,
    Direccion: Benefactor.direccion,
  }));

  // 4️⃣ Agregar los datos a la hoja de cálculo
  transformedBenefactores.forEach((Benefactor) => {
    worksheet.addRow(Benefactor);
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

  saveAs(fileBlob, "Benefactores.xlsx");
};

const handleExport = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Benefactores");

  // 📌 **Obtener la Imagen en Base64**
  const logoBase64 = await getBase64ImageFromUrl("/img/intur.png");
  const imageId = workbook.addImage({
    base64: logoBase64,
    extension: "png",
  });

  // 📌 **Insertar el Logo en la Esquina Izquierda**
  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 120, height: 50 },
  });

  // 📌 **Insertar el Título en la Fila 1**
  worksheet.mergeCells("B1", "G1");
  worksheet.getCell("B1").value = "Reporte de Benefactores";
  worksheet.getCell("B1").font = { bold: true, size: 16 };
  worksheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };

  // 📌 **Fecha de Exportación en la Fila 2**
  worksheet.mergeCells("B2", "G2");
  worksheet.getCell("B2").value = `Fecha de Exportación: ${new Date().toLocaleDateString("es-ES")}`;
  worksheet.getCell("B2").font = { italic: true, size: 12 };
  worksheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

  // 📌 **Criterios de Búsqueda en la Fila 3**
  const filterCriteria = Object.entries(searchQuery || {})
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ") || "Sin filtros";

  worksheet.mergeCells("B3", "G3");
  worksheet.getCell("B3").value = `Criterios de Búsqueda: ${filterCriteria}`;
  worksheet.getCell("B3").font = { italic: true, size: 12 };
  worksheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };

  // 📌 **Agregar una Fila Vacía en la Fila 4 para Separar los Encabezados**
  worksheet.getRow(4).values = [];

  // 📌 **Definir Encabezados desde la Fila 5**
  const headers = [
    { header: "Identidad", key: "Identidad", width: 20 },
    { header: "Nombre Completo", key: "Nombre", width: 30 },
    { header: "Sexo", key: "Sexo", width: 15 },
    { header: "Teléfono", key: "Telefono", width: 20 },
    { header: "Dirección", key: "Direccion", width: 40 },
  ];

  const headerRow = worksheet.getRow(5);
  headerRow.values = headers.map((h) => h.header);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };

  // 📌 **Ajustar el Ancho de las Columnas**
  headers.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width;
  });

  // 📌 **Filtrar Benefactores con deepSearch**
  const filteredBenefactores = Benefactores.filter((benefactor) => deepSearch(benefactor, searchQuery));
 console.log("filteredBenefactores",filteredBenefactores)
  // 📌 **Agregar Datos al Excel (A partir de la fila 6)**
  let rowIndex = 6;
  filteredBenefactores.forEach((benefactor) => {
    worksheet.getRow(rowIndex).values = [
      benefactor.Identidad,
      `${benefactor.Persona_Nombre} ${benefactor.Persona_Apellido}`,
      benefactor.Sexo === 1 ? "Masculino" : "Femenino",
      benefactor.Persona_Telefono || "-",
      benefactor.Persona_Direccion || "-",
    ];
    worksheet.getRow(rowIndex).getCell(1).numFmt = "@"; // Primera columna (Identidad)
    worksheet.getRow(rowIndex).getCell(1).alignment = { horizontal: "left" }; // Asegurar alineación izquierda

    rowIndex++;
  });

  // 📌 **Descargar el Archivo**
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, "Benefactores.xlsx");
};

const handleExportv2 = async () => {
  // 📌 Crear un nuevo libro y hoja de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Benefactores");

  // 📌 Agregar el Logo en la esquina izquierda
  const logoBase64 = await getBase64ImageFromUrl("/img/intur.png");
  const imageId = workbook.addImage({ base64: logoBase64, extension: "png" });
  worksheet.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 120, height: 50 } });

  // 📌 Insertar el título
  worksheet.mergeCells("B1", "H1");
  worksheet.getCell("B1").value = "Reporte de Benefactores";
  worksheet.getCell("B1").font = { bold: true, size: 16 };
  worksheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };

  // 📌 Fecha de Exportación
  worksheet.mergeCells("B2", "H2");
  worksheet.getCell("B2").value = `Fecha de Exportación: ${new Date().toLocaleDateString("es-ES")}`;
  worksheet.getCell("B2").font = { italic: true, size: 12 };
  worksheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

  // 📌 Criterios de búsqueda
  const filterCriteria = Object.entries(searchQuery || {})
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ") || "Sin filtros";

  worksheet.mergeCells("B3", "H3");
  worksheet.getCell("B3").value = `Criterios de Búsqueda: ${filterCriteria}`;
  worksheet.getCell("B3").font = { italic: true, size: 12 };
  worksheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };

  // 📌 Espacio antes de los encabezados
  worksheet.getRow(4).values = [];

  // 📌 Definir Encabezados en la fila 5
  const headers = [
    { header: "Identidad", key: "Identidad", width: 20 },
    { header: "Nombre Completo", key: "Nombre", width: 30 },
    { header: "Sexo", key: "Sexo", width: 15 },
    { header: "Teléfono", key: "Telefono", width: 20 },
    { header: "Dirección", key: "Direccion", width: 40 },
    { header: "Estado", key: "Estado", width: 15 },  // Agregando Estado
  ];

  // 📌 Aplicar estilos a los encabezados
  const headerRow = worksheet.getRow(5);
  headerRow.values = headers.map((h) => h.header);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };

  // 📌 Aplicar anchos de columna
  headers.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width;
  });

  // 📌 Transformar los datos antes de agregarlos
  const transformedBenefactores = filteredBenefactores.map((Benefactor) => {
    const estado = estados.find(e => e.Codigo_Estado === Benefactor.Estado)?.Nombre_Estado || "Desconocido";

    return {
      Identidad: Benefactor.Identidad ? String(Benefactor.Identidad) : "-",
      Nombre: `${Benefactor.Primer_Nombre ?? "-"} ${Benefactor.Primer_Apellido ?? "-"}`,
      Sexo: Benefactor.Sexo === 1 ? "Masculino" : Benefactor.Sexo === 0 ? "Femenino" : "Desconocido",
      Telefono: Benefactor.Telefono ?? "-",
      Direccion: Benefactor.Direccion ?? "-",
      Estado: estado,
    };
  });

  console.log("transformedBenefactores", transformedBenefactores);
  // 📌 Agregar los datos a la hoja de cálculo (Desde fila 6)
  transformedBenefactores.forEach((Benefactor) => {
    worksheet.addRow(Benefactor);
  });

  // 📌 Descargar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const fileBlob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(fileBlob, "Benefactores.xlsx");
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
  titleIcon={MagnifyingGlassIcon}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  handleClearSearch={handleClearSearch}
  onExport={handleExport}
/>


      {/* Mensajes de notificación */}
      {notification && <div className="text-green-600">{notification}</div>}
      {updateNotification && <div className="text-yellow-600">{updateNotification}</div>}
      {deleteNotification && <div className="text-red-600">{deleteNotification}</div>}

{/* Tabla de Benefactores */}
<div >
<ModalGenerico
  id="modalRelacionBenefactor"
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
  tipoRelacion="Benefactor" // 👈 útil para validación DOM con ID

  formId="formTutor" // 👈 útil para validación DOM con ID
/>

</ModalGenerico>

<table className="xls_style-excel-table">
  <thead>
    <tr className="bg-blue-200 text-black uppercase text-sm font-semibold">
      <th className="py-4 px-6  font-semibold text-left">Identidad</th>
      <th className="py-4 px-6  font-semibold text-left">Nombre y Apellido</th>
      <th className="py-4 px-6  font-semibold text-left">Sexo</th>
      <th className="py-4 px-6  font-semibold text-left">Telefono</th>
      <th className="py-4 px-6  font-semibold text-left">Direccion</th>
      <th className="py-4 px-6  font-semibold text-left">Identidad E.</th>
      <th className="py-4 px-6  font-semibold text-left">Estudiante</th>
      <th className="py-4 px-6  font-semibold text-left">Estado</th> {/* Nueva columna de Estado */}
      <th className="py-4 px-6  font-semibold text-left">Acciones</th>
    </tr>
  </thead>

  <tbody>
    {Benefactores && Benefactores.length > 0 ? (
      currentBenefactores.map((Benefactor) => {
        // Buscar el estado correspondiente en el diccionario de estados
        const estado = estados.find(e => e.Codigo_Estado === Benefactor.Estado );

        return (
          <tr key={Benefactor.Id_Persona}>
            <td className="border px-4 py-2">{Benefactor.Identidad}</td>
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

            <td className='xls_center'>
              {permisos.Permiso_Actualizar === "1" && (
                <button
                  onClick={() => handleEdit(Benefactor)}
                  className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </button>
              )}
            </td>
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
