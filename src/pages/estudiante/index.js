import { useState, useEffect, useContext,useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import AuthContext from "../../context/AuthContext";
import { DocumentArrowDownIcon,ArrowDownCircleIcon ,ShieldExclamationIcon,HomeIcon, PencilSquareIcon, TrashIcon, CheckIcon,MagnifyingGlassIcon,UserPlusIcon, EyeIcon   } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
//import GraduandoTable from '../../components/GraduandoTable';
//import GraduandoInner from '../../components/GraduandoInner';
import { useRouter } from 'next/router';




import ModalConfirmacion from '../../utils/ModalConfirmacion';
//import ModalGenerico from '../../utils/ModalGenerico'; 
// ✅ Importación correcta para "export default"
import ModalGenerico from "../../utils/ModalGenerico";

import RelacionForm from '../../components/basicos/RelacionForm';
import MatriculaForm from '../../components/basicos/MatriculaForm';
import GraduacionForm from '../../components/basicos/GraduacionForm';
import FotoCarnetUpload from '../../components/basicos/FotoCarnetUpload';
import useModal from "../../hooks/useModal";
//import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import { obtenerEstados } from "../../utils/api"; // Importar la función

import { validarFormulario } from "../../utils/validaciones";
//import ModalGeneral from '../../utils/ModalGeneral'; // 👈 esto suele arreglarlo si el .js no lo resuelve implícitamente


import { reglasValidacionEstudiante, reglasValidacionGraduando, reglasValidacionPersona ,reglasValidacionRelacion} from "../../../models/ReglasValidacionModelos";
const EstudiantesCrud = () => {
  //const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [estados, setEstados] = useState([]);
  // const [modals, setModals] = useState({
  //   modalConfirmacion: false,Estudian
  //   modalEliminarTutor: false,
  //   modalEliminarBenefactor: false,
  // });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingGraduacion, setIsEditinggraduacion] = useState(false);
  const openModal = (modalKey) => {
   // setModals(prev => ({ ...prev, [modalKey]: true }));
  };
  const [modalPendiente, setModalPendiente] = useState(null);
  const [matricula, setMatricula] = useState(null);  // Estado para almacenar la matrícula

  
  //const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales

  const [fotoActual, setFotoActual] = useState(null);
  const [fotoBase64, setFotoBase64] = useState(null);

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


  const {  idEstudiante } = router.query;
  //const [activeTab, setActiveTab] = useState(1); // para las pestañas en el mismo formulario
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




const [currentStep, setCurrentStep] = useState(1); // Estado para el paso actual

const nextStep = () => {
  if (currentStep < 4) setCurrentStep(currentStep + 1);
};

const prevStep = () => {
  if (currentStep > 1) setCurrentStep(currentStep - 1);
};


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


  const fetchMatricula = async () => {
    try {
      // Realizamos la solicitud a la API para obtener la matrícula
      const response = await fetch(`/api/matriculabyestudianteid?id_estudiante=${idEstudiante}`);

      if (!response.ok) {
        //throw new Error('No se encontró la matrícula para este estudiante.');
      }

      // Convertimos la respuesta en JSON
      const data = await response.json();

      // Almacenamos los datos de la matrícula
      setMatricula(data);
    } catch (err) {
      setError(err.message);  // Si hay un error, lo almacenamos
    } finally {
     // setLoading(false);  // Finaliza el proceso de carga
    }
  };


 
  const handleExportToPDFv1 = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(18);
  
    const fechaImpresion = new Date().toLocaleDateString();
    doc.text(`FICHA ESTUDIANTIL`, 71, 20);
    doc.addImage('/img/intur.png', 'PNG', 10, 10, 40, 15);
  
    if (fotoActual) {
      doc.addImage(fotoActual, 'JPEG', 170, 10, 30, 30);
    } else {
      doc.rect(170, 10, 30, 30);
      doc.setFontSize(10);
      doc.text("Foto", 180, 25);
    }
  
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("DATOS DEL ESTUDIANTE", 71, 40);
    doc.setFont("times", "normal");
  
    let y = 60;
  
    const agregarCampo = (label, value) => {
      doc.text(label, 20, y);
      doc.text(value || "N/A", 71, y);
      doc.line(70, y + 2, 185, y + 2);
      y += 10;
    };
  
    agregarCampo("Primer Nombre:", personaData.Primer_Nombre);
    agregarCampo("Primer Apellido:", personaData.Primer_Apellido);
    agregarCampo("Segundo Nombre:", personaData.Segundo_Nombre);
    agregarCampo("Segundo Apellido:", personaData.Segundo_Apellido);
    agregarCampo("Número de Identidad:", personaData.Identidad);
    agregarCampo("Sexo:", personaData.Sexo === "1" ? "Masculino" : "Femenino");
    agregarCampo("Fecha de Nacimiento:", personaData.Fecha_Nacimiento);
    agregarCampo("Lugar de Nacimiento:", personaData.Lugar_Nacimiento);
  
    const departamentoNombre = departamentos.find(d => d.Id_Departamento === personaData.Id_Departamento)?.Nombre_Departamento || "Desconocido";
    agregarCampo("Departamento:", departamentoNombre);
  
    const municipioNombre = municipios.find(m => m.Id_Municipio === personaData.Id_Municipio)?.Nombre_Municipio || "Desconocido";
    agregarCampo("Municipio:", municipioNombre);
  
    // 📌 Dirección con ajuste automático de línea
    doc.text("Dirección:", 20, y);
    const direccionDividida = doc.splitTextToSize(personaData.Direccion, 110);
    doc.text(direccionDividida, 71, y);
    y += direccionDividida.length * 6;
    doc.line(70, y, 185, y);
    y += 8;
  
    agregarCampo("Teléfono:", personaData.Telefono);
  
    const areaNombre = areas.find(area => area.Id_Area === estudianteData.Id_Area)?.Nombre_Area || "Desconocido";
    agregarCampo("Área:", areaNombre);
  
    const institutoNombre = institutos.find(inst => inst.Id_Instituto === estudianteData.Id_Instituto)?.Nombre_Instituto || "Desconocido";
    agregarCampo("Instituto:", institutoNombre);
  
    const beneficioNombre = beneficios.find(b => b.Id_Beneficio === estudianteData.Id_Beneficio)?.Nombre_Beneficio || "Desconocido";
    agregarCampo("Beneficio:", beneficioNombre);
  
    const estadoTexto = personaData.Estado === "1" ? "Activo" : "Inactivo";
    agregarCampo("Estado:", estadoTexto);
  
    // ➕ Página nueva
    doc.addPage();
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("TUTORES", 71, 20);
    doc.setFont("times", "normal");
  
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("Identidad", 20, 40);
    doc.text("Nombre", 60, 40);
    doc.text("Telefono", 90, 40);
    doc.text("Dirección", 140, 40);
    doc.line(20, 42, 200, 42);
  


 // ➕ Página nueva
 doc.addPage();
 doc.setFontSize(12);
 doc.setFont("times", "bold");
 doc.text("MATRÍCULA", 71, 20);
 doc.setFont("times", "normal");

 // Agregar los datos de matrícula
 if (estudianteData.Matricula) {
   doc.setFontSize(11);
   doc.text("Modalidad", 20, 40);
   doc.text("Grado", 60, 40);
   doc.text("Sección", 100, 40);
   doc.text("Fecha de Matrícula", 140, 40);
   doc.line(20, 42, 200, 42);

   // Mostrar los detalles de la matrícula
   let currentY = 50;
   doc.text(estudianteData.Matricula.Modalidad || "Desconocido", 20, currentY);
   doc.text(estudianteData.Matricula.Grado || "Desconocido", 60, currentY);
   doc.text(estudianteData.Matricula.Seccion || "Desconocido", 100, currentY);
   doc.text(estudianteData.Matricula.Fecha_Matricula || "Desconocido", 140, currentY);
   currentY += 10;
 } else {
   // Si no hay matrícula, mostrar un mensaje
   doc.setFontSize(12);
   doc.text("Este alumno aún no está matriculado", 20, 40);
 }


    let currentY = 50;

// TUTORES (Id_Tipo_Persona === 2)
doc.setFont("times", "normal");
currentY = renderRelacionesPorTipoPersona(doc, estudianteData.Relaciones, 2, currentY);
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("BENEFACTORES", 70, currentY + 10);
    doc.setFont("times", "normal");
  
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("Identidad", 20, currentY + 20);
    doc.text("Nombre", 60, currentY + 20);
    doc.text("Telefono", 90, currentY + 20);
    doc.text("Dirección", 140, currentY + 20);
    doc.line(20, currentY + 22, 200, currentY + 22);
    currentY += 30;
    doc.setFont("times", "normal");
    currentY = renderRelacionesPorTipoPersona(doc, estudianteData.Relaciones, 3, currentY);
  
    currentY += 20;
    doc.setFont(undefined, 'bold');
    doc.text("Información de Graduación", 20, currentY);
    currentY += 10;
    doc.setFont(undefined, 'normal');
  
    doc.text("Año", 20, currentY);
    doc.text("Inicio", 60, currentY);
    doc.text("Finalización", 100, currentY);
    doc.text("Estado", 150, currentY);
    currentY += 8;
  
    const estadoGraduacion = estados.find(e => e.Codigo_Estado === graduacion.Estado)?.Nombre_Estado || "Desconocido";
    doc.text(`${graduacion.Anio || "-"}`, 20, currentY);
    doc.text(`${graduacion.Fecha_Inicio || "-"}`, 60, currentY);
    doc.text(`${graduacion.Fecha_Final || "No finalizada"}`, 100, currentY);
    doc.text(estadoGraduacion, 150, currentY);
    currentY += 20;
  
    doc.save("Ficha_Estudiantil.pdf");
  };
  



  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(18);
  
    const fechaImpresion = new Date().toLocaleDateString();
//    doc.text("Fundación Intur", 20, 15);  // Nombre de la institución
    doc.text("FICHA ESTUDIANTIL", 80, 30);
  //  doc.text(`AÑO LECTIVO: 2020 - 2021`, 70, 35);
  
    doc.addImage("/img/intur.png", "PNG", 20, 5, 40, 20);
  
    // Verificar si existe la foto del estudiante
    if (fotoActual) {
      doc.addImage(fotoActual, "JPEG", 150, 10, 50, 30);
    } else {
      doc.rect(170, 30, 30, 30);
      doc.setFontSize(10);
      doc.text("Foto", 180, 45);
    }
  
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("DATOS DEL ESTUDIANTE", 20, 50);
    doc.setFont("times", "normal");
  
    let y = 60;
  
    // Función para agregar los campos
    const agregarCampo = (label, value) => {
      doc.text(label, 20, y);
      doc.text(value || "N/A", 60, y);
      doc.line(60, y + 2, 200, y + 2);
      y += 10;
    };
  
    agregarCampo("Apellidos y Nombres:", `${personaData.Primer_Apellido} ${personaData.Segundo_Apellido}, ${personaData.Primer_Nombre} ${personaData.Segundo_Nombre}`);
    agregarCampo("Número de Identidad:", personaData.Identidad);
    agregarCampo("Sexo:", personaData.Sexo === "1" ? "Masculino" : "Femenino");
    agregarCampo("Fecha de Nacimiento:", personaData.Fecha_Nacimiento);
    agregarCampo("Lugar de Nacimiento:", personaData.Lugar_Nacimiento);
  
    // Dirección con ajuste automático de línea
    doc.text("Dirección:", 20, y);
    const direccionDividida = doc.splitTextToSize(personaData.Direccion, 110);
    doc.text(direccionDividida, 60, y);
    y += direccionDividida.length * 6;
    doc.line(60, y, 200, y);
    y += 8;
  
    agregarCampo("Teléfono:", personaData.Telefono);
  
    // Departamento y municipio
    const departamentoNombre = departamentos.find(d => d.Id_Departamento === personaData.Id_Departamento)?.Nombre_Departamento || "Desconocido";
    agregarCampo("Departamento:", departamentoNombre);
  
    const municipioNombre = municipios.find(m => m.Id_Municipio === personaData.Id_Municipio)?.Nombre_Municipio || "Desconocido";
    agregarCampo("Municipio:", municipioNombre);
  
    // Matrícula
    doc.setFont("times", "bold");
    doc.text("MATRÍCULA", 20, y);
    doc.setFont("times", "normal");
  
    y += 10;
  
    if (estudianteData.Matricula) {
      agregarCampo("Modalidad:", estudianteData.Matricula.Modalidad || "Desconocido");
      agregarCampo("Grado:", estudianteData.Matricula.Grado || "Desconocido");
      agregarCampo("Sección:", estudianteData.Matricula.Seccion || "Desconocido");
      agregarCampo("Fecha de Matrícula:", estudianteData.Matricula.Fecha_Matricula || "Desconocido");
    } else {
      doc.setFontSize(12);
      doc.text("Este alumno aún no está matriculado.", 20, y);
      y += 10;
    }
    doc.addPage();// Agregar una nueva página para los tutores y benefactores
    y = 20;
    // TUTORES (Id_Tipo_Persona === 2)
    doc.setFont("times", "bold");
    doc.text("TUTORES", 20, y + 15);
    doc.setFont("times", "normal");
  
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("Identidad", 20, y + 25);
    doc.text("Nombre", 60, y + 25);
    doc.text("Teléfono", 100, y + 25);
    doc.text("Dirección", 140, y + 25);
    doc.line(20, y + 27, 200, y + 27);
    doc.setFontSize(11);
    doc.setFont("times", "normal");
    let currentY = y + 35;
    currentY = renderRelacionesPorTipoPersona(doc, estudianteData.Relaciones, 2, currentY);
  
    // BENEFACTORES
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("BENEFACTORES", 20, currentY + 10);
    doc.setFont("times", "normal");
  
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("Identidad", 20, currentY + 20);
    doc.text("Nombre", 60, currentY + 20);
    doc.text("Teléfono", 100, currentY + 20);
    doc.text("Dirección", 140, currentY + 20);
    doc.line(20, currentY + 22, 200, currentY + 22);
    currentY += 30;
    doc.setFont("times", "normal");
    currentY = renderRelacionesPorTipoPersona(doc, estudianteData.Relaciones, 3, currentY);
  
    // Información de Graduación
    currentY += 20;
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("INFORMACION DE GRADUACION", 20, currentY);
    currentY += 10;
 
    doc.setFont("times", "bold");
    doc.text("Año", 20, currentY);
    doc.text("Inicio", 60, currentY);
    doc.text("Finalización", 100, currentY);
    doc.text("Estado", 150, currentY);
    currentY += 8;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    const estadoGraduacion = estados.find(e => e.Codigo_Estado === graduacion.Estado)?.Nombre_Estado || "Desconocido";
    doc.text(`${graduacion.Anio || "-"}`, 20, currentY);
    doc.text(`${graduacion.Fecha_Inicio || "-"}`, 60, currentY);
    doc.text(`${graduacion.Fecha_Final || "No finalizada"}`, 100, currentY);
    doc.text(estadoGraduacion, 150, currentY);
    currentY += 20;
  
    // Guardar el PDF
    doc.save("Ficha_Estudiantil.pdf");
  };
  
const handleExportToPDFv3 = () => {
  const doc = new jsPDF();
  doc.setFont("times", "normal");
  doc.setFontSize(18);

  const fechaImpresion = new Date().toLocaleDateString();
  doc.text("Fundación Intur", 20, 15);
  doc.text("FICHA ESTUDIANTIL", 70, 30);
  doc.text(`AÑO LECTIVO: 2020 - 2021`, 70, 35);

  doc.addImage("/img/intur.png", "PNG", 150, 5, 40, 20);

  // Verificar si existe la foto del estudiante
  if (fotoActual) {
    doc.addImage(fotoActual, "JPEG", 170, 30, 30, 30);
  } else {
    doc.rect(170, 30, 30, 30);
    doc.setFontSize(10);
    doc.text("Foto", 180, 45);
  }

  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("DATOS DEL ESTUDIANTE", 20, 50);
  doc.setFont("times", "normal");

  let y = 60;

  // Función para agregar los campos
  const agregarCampo = (label, value) => {
    doc.text(label, 20, y);
    doc.text(value || "N/A", 60, y);
    doc.line(60, y + 2, 200, y + 2);
    y += 10;
  };

  agregarCampo("Apellidos y Nombres:", `${personaData.Primer_Apellido} ${personaData.Segundo_Apellido}, ${personaData.Primer_Nombre} ${personaData.Segundo_Nombre}`);
  agregarCampo("Número de Identidad:", personaData.Identidad);
  agregarCampo("Sexo:", personaData.Sexo === "1" ? "Masculino" : "Femenino");
  agregarCampo("Fecha de Nacimiento:", personaData.Fecha_Nacimiento);
  agregarCampo("Lugar de Nacimiento:", personaData.Lugar_Nacimiento);

  // Dirección con ajuste automático de línea
  doc.text("Dirección:", 20, y);
  const direccionDividida = doc.splitTextToSize(personaData.Direccion, 110);
  doc.text(direccionDividida, 60, y);
  y += direccionDividida.length * 6;
  doc.line(60, y, 200, y);
  y += 8;

  agregarCampo("Teléfono:", personaData.Telefono);

  // Departamento y municipio
  const departamentoNombre = departamentos.find(d => d.Id_Departamento === personaData.Id_Departamento)?.Nombre_Departamento || "Desconocido";
  agregarCampo("Departamento:", departamentoNombre);

  const municipioNombre = municipios.find(m => m.Id_Municipio === personaData.Id_Municipio)?.Nombre_Municipio || "Desconocido";
  agregarCampo("Municipio:", municipioNombre);

  // Matrícula
  doc.setFont("times", "bold");
  doc.text("MATRÍCULA", 20, y);
  doc.setFont("times", "normal");

  y += 10;

  if (estudianteData.Matricula) {
    agregarCampo("Modalidad:", estudianteData.Matricula.Modalidad || "Desconocido");
    agregarCampo("Grado:", estudianteData.Matricula.Grado || "Desconocido");
    agregarCampo("Sección:", estudianteData.Matricula.Seccion || "Desconocido");
    agregarCampo("Fecha de Matrícula:", estudianteData.Matricula.Fecha_Matricula || "Desconocido");
  } else {
    doc.setFontSize(12);
    doc.text("Este alumno aún no está matriculado.", 20, y);
    y += 10;
  }

  // TUTORES (Id_Tipo_Persona === 2)
  doc.setFont("times", "bold");
  doc.text("TUTORES", 20, y + 15);
  doc.setFont("times", "normal");

  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Identidad", 20, y + 25);
  doc.text("Nombre", 60, y + 25);
  doc.text("Teléfono", 100, y + 25);
  doc.text("Dirección", 140, y + 25);
  doc.line(20, y + 27, 200, y + 27);

  let currentY = y + 35;
  currentY = renderRelacionesPorTipoPersona(doc, estudianteData.Relaciones, 2, currentY);

  // BENEFACTORES
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("BENEFACTORES", 20, currentY + 10);
  doc.setFont("times", "normal");

  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Identidad", 20, currentY + 20);
  doc.text("Nombre", 60, currentY + 20);
  doc.text("Teléfono", 100, currentY + 20);
  doc.text("Dirección", 140, currentY + 20);
  doc.line(20, currentY + 22, 200, currentY + 22);
  currentY += 30;
  doc.setFont("times", "normal");
  currentY = renderRelacionesPorTipoPersona(doc, estudianteData.Relaciones, 3, currentY);

  // Información de Graduación
  currentY += 20;
  doc.setFont(undefined, 'bold');
  doc.text("Información de Graduación", 20, currentY);
  currentY += 10;
  doc.setFont(undefined, 'normal');

  doc.text("Año", 20, currentY);
  doc.text("Inicio", 60, currentY);
  doc.text("Finalización", 100, currentY);
  doc.text("Estado", 150, currentY);
  currentY += 8;

  const estadoGraduacion = estados.find(e => e.Codigo_Estado === graduacion.Estado)?.Nombre_Estado || "Desconocido";
  doc.text(`${graduacion.Anio || "-"}`, 20, currentY);
  doc.text(`${graduacion.Fecha_Inicio || "-"}`, 60, currentY);
  doc.text(`${graduacion.Fecha_Final || "No finalizada"}`, 100, currentY);
  doc.text(estadoGraduacion, 150, currentY);
  currentY += 20;

  // Guardar el PDF
  doc.save("Ficha_Estudiantil.pdf");
};



  const handleExportToPDFv2 = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(18);
  
    const fechaImpresion = new Date().toLocaleDateString();
    doc.text("Escuela de Educación Básica N° 462 \"Cerro del Carmen\"", 20, 15);
    doc.text("FICHA ESTUDIANTIL", 70, 30);
    doc.text(`AÑO LECTIVO: 2020 - 2021`, 70, 35);
  
    doc.addImage("/img/intur.png", "PNG", 150, 5, 40, 20);
  
    if (fotoActual) {
      doc.addImage(fotoActual, "JPEG", 170, 30, 30, 30);
    } else {
      doc.rect(170, 30, 30, 30);
      doc.setFontSize(10);
      doc.text("Foto", 180, 45);
    }
  
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("DATOS DEL ESTUDIANTE", 20, 50);
    doc.setFont("times", "normal");
  
    let y = 60;
  
    // Función para agregar los campos
    const agregarCampo = (label, value) => {
      doc.text(label, 20, y);
      doc.text(value || "N/A", 60, y);
      doc.line(60, y + 2, 200, y + 2);
      y += 10;
    };
  
    agregarCampo("Apellidos y Nombres:", `${personaData.Primer_Apellido} ${personaData.Segundo_Apellido}, ${personaData.Primer_Nombre} ${personaData.Segundo_Nombre}`);
    agregarCampo("Número de Identidad:", personaData.Identidad);
    agregarCampo("Sexo:", personaData.Sexo === "1" ? "Masculino" : "Femenino");
    agregarCampo("Fecha de Nacimiento:", personaData.Fecha_Nacimiento);
    agregarCampo("Lugar de Nacimiento:", personaData.Lugar_Nacimiento);
  
    // Dirección con ajuste automático de línea
    doc.text("Dirección:", 20, y);
    const direccionDividida = doc.splitTextToSize(personaData.Direccion, 110);
    doc.text(direccionDividida, 60, y);
    y += direccionDividida.length * 6;
    doc.line(60, y, 200, y);
    y += 8;
  
    agregarCampo("Teléfono:", personaData.Telefono);
  
    // Departamento y municipio
    const departamentoNombre = departamentos.find(d => d.Id_Departamento === personaData.Id_Departamento)?.Nombre_Departamento || "Desconocido";
    agregarCampo("Departamento:", departamentoNombre);
  
    const municipioNombre = municipios.find(m => m.Id_Municipio === personaData.Id_Municipio)?.Nombre_Municipio || "Desconocido";
    agregarCampo("Municipio:", municipioNombre);
  
    // Matrícula
    doc.setFont("times", "bold");
    doc.text("MATRÍCULA", 20, y);
    doc.setFont("times", "normal");
  
    y += 10;
  
    if (estudianteData.Matricula) {
      agregarCampo("Modalidad:", estudianteData.Matricula.Modalidad || "Desconocido");
      agregarCampo("Grado:", estudianteData.Matricula.Grado || "Desconocido");
      agregarCampo("Sección:", estudianteData.Matricula.Seccion || "Desconocido");
      agregarCampo("Fecha de Matrícula:", estudianteData.Matricula.Fecha_Matricula || "Desconocido");
    } else {
      doc.text("Este alumno aún no está matriculado.", 20, y);
      y += 10;
    }
  
    // TUTORES (Id_Tipo_Persona === 2)
    doc.setFont("times", "bold");
    doc.text("TUTORES", 20, y + 15);
    doc.setFont("times", "normal");
  
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("Identidad", 20, y + 25);
    doc.text("Nombre", 60, y + 25);
    doc.text("Teléfono", 100, y + 25);
    doc.text("Dirección", 140, y + 25);
    doc.line(20, y + 27, 200, y + 27);
  
    let currentY = y + 35;
    currentY = renderRelacionesPorTipoPersona(doc, estudianteData.Relaciones, 2, currentY);
  
    // BENEFACTORES
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("BENEFACTORES", 20, currentY + 10);
    doc.setFont("times", "normal");
  
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("Identidad", 20, currentY + 20);
    doc.text("Nombre", 60, currentY + 20);
    doc.text("Teléfono", 100, currentY + 20);
    doc.text("Dirección", 140, currentY + 20);
    doc.line(20, currentY + 22, 200, currentY + 22);
    currentY += 30;
    doc.setFont("times", "normal");
    currentY = renderRelacionesPorTipoPersona(doc, estudianteData.Relaciones, 3, currentY);
  
    // Información de Graduación
    currentY += 20;
    doc.setFont(undefined, 'bold');
    doc.text("Información de Graduación", 20, currentY);
    currentY += 10;
    doc.setFont(undefined, 'normal');
  
    doc.text("Año", 20, currentY);
    doc.text("Inicio", 60, currentY);
    doc.text("Finalización", 100, currentY);
    doc.text("Estado", 150, currentY);
    currentY += 8;
  
    const estadoGraduacion = estados.find(e => e.Codigo_Estado === graduacion.Estado)?.Nombre_Estado || "Desconocido";
    doc.text(`${graduacion.Anio || "-"}`, 20, currentY);
    doc.text(`${graduacion.Fecha_Inicio || "-"}`, 60, currentY);
    doc.text(`${graduacion.Fecha_Final || "No finalizada"}`, 100, currentY);
    doc.text(estadoGraduacion, 150, currentY);
    currentY += 20;
  
    // Guardar el PDF
    doc.save("Ficha_Estudiantil.pdf");
  };
  
  

function renderRelacionesPorTipoPersona(doc, relaciones, tipoPersonaId, currentY) {
  relaciones?.forEach((relacion) => {
    if (relacion.TipoPersona?.Id_Tipo_Persona === tipoPersonaId) {
      const identidad = relacion.Persona?.Identidad || "";
      const telefono = relacion.Persona?.Telefono || "";
      const nombreCompleto = `${relacion.Persona?.Primer_Nombre || ""} ${relacion.Persona?.Primer_Apellido || ""}`;
      const direccionTexto = relacion.Persona?.Direccion || "N/A";

      const nombreLineas = doc.splitTextToSize(nombreCompleto, 25);     // ancho columna nombre
      const direccionLineas = doc.splitTextToSize(direccionTexto, 50);  // ancho columna dirección

      const lineCount = Math.max(nombreLineas.length, direccionLineas.length);

      for (let i = 0; i < lineCount; i++) {
        // Solo en la primera línea
        if (i === 0) {
          doc.text(identidad, 20, currentY + (i * 6));
          if (telefono) doc.text(telefono, 90, currentY + (i * 6));
        }

        // Línea actual de nombre y dirección si existe
        if (nombreLineas[i]) doc.text(nombreLineas[i], 60, currentY + (i * 6));
        if (direccionLineas[i]) doc.text(direccionLineas[i], 140, currentY + (i * 6));
      }

      // Avanzar el Y según la línea más larga
      currentY += lineCount * 6;
    }
  });

  return currentY;
}

  

 




  const handleCancelRelacion = (tipo) => {
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
      Direccion: "",
      Telefono: "",
      esNuevo: true,
      

    }));
    
    
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
      fetchMatricula();
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
      console.log("updatedStudent")
      console.log(updatedStudent)
      setSelectedStudent(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe
  
      handleEdit(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe

 

    }
      console.log(response.data)
    } catch (error) {
      setEstudiantes([]);
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
    Id_Estudiante:estudianteData.Id_Estudiante,
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
  


  })

 // personaDataRelacion.Estudiante.Persona=personaData;
  //personaDataRelacion.Id_Tipo_Persona=tipo;


    switch (tipo) {
      case 2:
     //   showModal("modalRelacion");
        setModalPendiente("modalRelacion");
        break;
      case 3:
        setModalPendiente("modalRelacionBenefactor");
    //    showModal("modalRelacionBenefactor");
        break;
    }


}

useEffect(() => {
  if (modalPendiente && personaDataRelacion?.esNuevo) {
    showModal(modalPendiente);
    setModalPendiente(null);
  }
}, [personaDataRelacion]);

const editGraduacion= ()=>{


  if(graduacion.Id_Graduando){
    setIsEditinggraduacion(true);
  }
  showModal("modalGraduacion")

}




  // const handleTabChange = (tabIndex) => {
    
    
  //   if (selectedStudent==null) {
  //     toast.error("Seleccione un estudiante", error);
  //     return;
  //   }
    
 

  //   switch(tabIndex){
      
  //     case 1:

  //     personaData.Id_Tipo_Persona=1;

  //     if(estudianteData==null){
  //       personaDataRelacion.esNuevo=true;
  //       personaDataRelacion.Id_Persona=null;
        
  //     }
    
        

  //     break;
   
  //     case 2:
  //       if (selectedStudent==null) {
  //         toast.error("Seleccione un estudiante", error);
  //         return;
  //       }
        
  //       personaDataRelacion.Id_Tipo_Persona=2;
  //       personaDataRelacion.esNuevo=true;
  //       personaDataRelacion.Id_Persona=null;
  //       resizeTo();

  //     break;
           
  //     case 3:
  //       if (selectedStudent==null) {
  //         toast.error("Seleccione un estudiante", error);
  //         return;
  //       }
        
  //       personaDataRelacion.Id_Tipo_Persona=3;
  //       personaDataRelacion.esNuevo=true;
  //       personaDataRelacion.Id_Persona=null;


  //     resizeTo();
  //     break;

  //     case 4:
  //       if (selectedStudent==null) {
  //         toast.error("Seleccione un estudiante", error);
  //         return;
  //       }
        

   

  //       setSelectedStudent(estudianteTemp);
  //       personaDataRelacion.esNuevo=false;
  //       personaDataRelacion.Id_Persona=null;


  //     resizeTo();

  //     break;


  //   }

  //   setActiveTab(tabIndex);
  // };
  
  const fetchInstitutos = async () => {
    try {
      const response = await axios.get("/api/institutos");
      setInstitutos(response.data);
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
console.log(personaDataRelacion)

    personaDataRelacion.Creado_Por=user.id;
    personaDataRelacion.Modificado_Por=user.id;
    personaDataRelacion.Fecha_Nacimiento='2000-01-01';
    personaDataRelacion.Estado=Number(personaDataRelacion.Estado) 
  
    const errores = validarFormulario(personaDataRelacion, reglasValidacionRelacion,personaDataRelacion.Id_Tipo_Persona==2? "formTutor":"formBenefactor");

      if (errores.length > 0) {
     
       // const idsConErrores = errores.map(e => e.id); // ⬅️ Solo los IDs

       // console.log("Campos con error:", idsConErrores);
        
        // Ejemplo: mostrar mensaje general
        toast.error("Verifique la información.");;
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
  estudianteData.Estado=Number(personaData.Estado);
 const errores = validarFormulario(personaData, reglasValidacionPersona);

    if (errores.length > 0) {
   
      console.log("validarFormulario Errores");
      console.log(personaData);
      console.log(errores);
    //toast.error(errores.join("\n"), error);
      return;
   
    }

    const errores2 = validarFormulario(estudianteData, reglasValidacionEstudiante);

    if (errores2.length > 0) {
   
      console.log("validarFormulario Estudiante");
      console.log(estudianteData);
      console.log(errores2);
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
      idEstudiante = res?.data?.Id_Estudiante;
    }

    // Resetear los formularios
    // setPersonaData({
    //   Primer_Nombre: "",
    //   Segundo_Nombre: "",
    //   Primer_Apellido: "",
    //   Segundo_Apellido: "",
    //   Sexo: "",
    //   Fecha_Nacimiento: "",
    //   Direccion: "",
    //   Telefono: "",
    //   Lugar_Nacimiento: "",
    //   Identidad: "",
    //   Creado_Por: "",
    //   esEstudiente: true,
    // });
    // setEstudianteData({
    //   Id_Beneficio: "",
    //   Id_Area: "",
    //   Id_Instituto: "",
    //   Creado_Por: "",
    //   Relaciones: [],
    // });




    // Recargar lista de estudiantes
    fetchEstudiantes();
  } catch (error) {
    // Notificación de error
    // console.error('Error al guardar estudiante y persona', {
    //   style: {
    //     backgroundColor: '#ffebee', // Fondo suave rojo
    //     color: '#d32f2f', // Texto rojo oscuro
    //     fontWeight: 'bold',
    //     border: '1px solid #f5c6cb', // Borde rojo claro
    //     padding: '16px',
    //     borderRadius: '12px',
    //   },
    //   position: 'bottom-right', // Posición en la esquina inferior derecha
    //   autoClose: 5000, // Cierra automáticamente en 5 segundos
    //   hideProgressBar: true, // Ocultar barra de progreso
    // });
    // console.error("Error al guardar estudiante y persona", error);


    const mensaje = error?.response?.data?.error || "Error desconocido al guardar el estudiante.";
    toast.error(mensaje);
    console.error("Error al guardar estudiante:", error);
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
    graduacion.Estado=Number(graduacion.Estado);


    
    const errores2 = validarFormulario(graduacion, reglasValidacionGraduando,"formGraduacion");

    if (errores2.length > 0) {
   
      console.log("validarFormulario Estudiante");
   //   console.log(estudianteData);
    //  toast.error(errores2.join("\n"), error);
      return;
    }


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

      fetchGraduacion(idEstudiante)
      closeModal("modalGraduacion")
      

    }else{
      await axios.put(`/api/graduando/${graduacion.Id_Graduando}`, graduacion);
      fetchGraduacion(idEstudiante)
      closeModal("modalGraduacion")
      
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
    console.error('Error al crear un graduando:', error);
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


  const handleEditTutor = (tutor,tipo) => {
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
  Id_Tipo_Persona:tutor.TipoPersona.Id_Tipo_Persona


})

switch (tipo) {
  case 2:
    showModal("modalRelacion")
    break;

    case 3:
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
  <div className="flex items-center   p-1 bg-white shadow-sm">
    




  </div>

  {/* Título de la sección */}
  <p className="text-3xl font-bold text-blue-700">📋 Registro de Estudiante</p>

  {/* Botones de acciones */}
  <div className="flex gap-x-1">

    {/* Botón para abrir el modal de agregar usuario */}
<button
  onClick={() => (window.location.href = "/estudiante/reporte")}
  className="flex items-center bg-orange-500 text-white px-4 py- rounded-lg hover:bg-orange-600 transition-colors shadow-md"
>


  <EyeIcon className="h-5 w-5 mr-2" /> Estudiantes
</button>
    
<button 
        onClick={handleExportToPDF} 
      className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
      >
      
        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />   FICHA
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

  <div className="space-y-6" id="fichaEstudiantil">
 
    <h2 className="text-2xl font-semibold text-gray-700">
    <strong>Datos del Estudiante</strong>
  </h2>

    <table className="w-full border border-gray-300 text-sm">
      <tbody>
        <tr>
          <td className="border p-2 font-medium text-gray-700">Primer Nombre</td>
          <td className="border p-2">
            <input id="Primer_Nombre" type="text" name="Primer_Nombre" placeholder="Primer Nombre" value={personaData.Primer_Nombre} onChange={handlePersonaInputChange} required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300" />
          </td>
      
          <td rowSpan={2} colSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
          <FotoCarnetUpload
  idEstudiante={estudianteData.Id_Estudiante}
  onFotoActualizada={(base64) => setFotoActual(base64)}
/>
</td>     </tr>
        <tr>

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
          <td className="border p-2 align-top">
  <textarea
    id="Direccion"
    name="Direccion"
    placeholder="Dirección"
    value={personaData.Direccion}
    onChange={handlePersonaInputChange}
    required
    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 resize-none text-sm overflow-hidden"
    style={{ minHeight: '2.5rem', lineHeight: '1.25rem' }}
    onInput={(e) => {
      e.target.style.height = 'auto'; // 🧼 Reset
      e.target.style.height = `${e.target.scrollHeight}px`; // 📏 Ajuste
    }}
  />
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
            
    <div className="flex justify-end  mt-4">
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
    className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    + Agregar Tutor
  </button>

{
  <ModalGenerico
    id="modalRelacion"
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
  tipoRelacion="Tutor" // 👈 útil para validación DOM con ID
/>

</ModalGenerico> }
</div>



  <table className="xls_style-excel-table">
    <thead className="bg-gray-100">
      <tr>
        <th className="">Identidad</th>
        <th className="">Nombre Completo</th>
        <th className="">Estado</th>
        <th className="">Dirección</th>
        <th className="">Teléfono</th>
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
                <td className="px-4 py-2 text-sm text-center border-b">{relacion.Persona?.Direccion}</td>
                <td className="px-4 py-2 text-sm text-center border-b">{relacion.Persona?.Telefono}</td>
                <td className="px-4 py-2 text-sm text-center border-b">
                  <div className="flex justify-center gap-2">
                    {permisos.Permiso_Actualizar === "1" && (
                      <button
                        type="button"
                        onClick={() => handleEditTutor(relacion,2)}
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

  formId="formBenefactor" // 👈 útil para validación DOM con ID
/>

</ModalGenerico> 
 
  <ModalGenerico
     id="modalGraduacion"
  isOpen={modals["modalGraduacion"]}
  onClose={() => closeModal("modalGraduacion")}
  titulo={personaDataRelacion?.esNuevo ? "Agregar Graduación" : "Actualizar Graduación"}
  tamano="max-w-4xl"
>


<GraduacionForm
          personaData={personaData}
          graduacion={graduacion}
          handleChange={handleChange}
          handleSubmitGraduacion={handleSubmitGraduacion}
          isEditing={isEditingGraduacion}
          permisos={permisos}
          resetForm={resetForm}
          estados={estados}
        />
</ModalGenerico> 
<ModalGenerico
  id="modalGraduacion"
  isOpen={modals["modalGraduacion"]}
  onClose={() => closeModal("modalGraduacion")}
  titulo={personaDataRelacion?.esNuevo ? "Agregar Graduación" : "Actualizar Graduación"}
  tamano="max-w-4xl"
>
  <GraduacionForm
    personaData={personaData}
    graduacion={graduacion}
    handleChange={handleChange}
    handleSubmitGraduacion={handleSubmitGraduacion}
    isEditing={isEditingGraduacion}
    permisos={permisos}
    closeModal={closeModal}  // Se pasa closeModal aquí
    resetForm={resetForm}  // Se pasa resetForm aquí
    shouldReset={false}  // Si deseas resetear el formulario al cerrar
    estados={estados}
  />
</ModalGenerico>

<div>
<div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold text-gray-700">
    <strong>Benefactores</strong>
  </h2>
  
  <button
    onClick={() => nuevoTutor(3)}
    type="button"
    className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    + Agregar Benefactor
  </button>
  </div>

  <table className="xls_style-excel-table">
          <thead>
            <tr className="bg-gray-100">
            <th>Identidad</th>
              <th >Nombre Completo</th>
              <th>Estado</th>
              <th className="">Dirección</th>
              <th className="">Teléfono</th>
              <th>Acciones</th>

            </tr>
          </thead>
          <tbody>
          {estudianteData.Relaciones?.length > 0 ? (
        estudianteData.Relaciones
          .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3)
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
                <td className="px-4 py-2 text-sm text-center border-b">{relacion.Persona?.Direccion}</td>
                <td className="px-4 py-2 text-sm text-center border-b">{relacion.Persona?.Telefono}</td>
                <td className="px-4 py-2 text-sm text-center border-b">
                  <div className="flex justify-center gap-2">
                    {permisos.Permiso_Actualizar === "1" && (
                      <button
                        type="button"
                        onClick={() => handleEditTutor(relacion,3)}
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
      <td colSpan="4" className="text-center border px-4 py-2">
        No hay relaciones disponibles.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700">

  </h2>

  <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold text-gray-700">
    <strong>Información de Matrícula</strong>
  </h2>

  <button
    onClick={() => setModalPendiente('modalAddMatricula')} // Función para editar la matrícula
    type="button"
    className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-700"
  >
    + Matrícula
  </button>
</div>

   <ModalGenerico
        id="modalAddMatricula"
        isOpen={modals['modalAddMatricula']}
        onClose={() => closeModal('modalAddMatricula')}
        titulo={isEditing ? 'Editar Matrícula' : 'Agregar Matrícula'}
      >
        <MatriculaForm
          formData={matricula}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onClose={() => closeModal('modalAddMatricula')}
          
        />
      </ModalGenerico>

<table className="xls_style-excel-table">
  <thead className="bg-gray-100">
    <tr>
      <th className="">Modalidad</th>
      <th className="">Grado</th>
      <th className="">Sección</th>
      <th className="">Fecha de Matrícula</th>
    </tr>
  </thead>
  <tbody>
    <tr className="text-center hover:bg-gray-50">
      <td className="border px-4 py-2">{matricula?.Modalidad || "Desconocido"}</td>
      <td className="border px-4 py-2">{matricula?.Grado || "Desconocido"}</td>
      <td className="border px-4 py-2">{matricula?.Seccion || "Desconocido"}</td>
      <td className="border px-4 py-2">
        {matricula?.Fecha_Matricula || "Desconocido"}
      </td>
    </tr>
  </tbody>
</table>



  <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold text-gray-700">
  <strong>Información de Graduación</strong>
  </h2>
  
  <button
    onClick={() => editGraduacion()}
    type="button"
    className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    + Graduación
  </button>
  </div>

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






        </form>


         


            
 
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


         
       

    </Layout>
  );
};

export default EstudiantesCrud;
