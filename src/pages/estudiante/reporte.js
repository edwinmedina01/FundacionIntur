import { useState, useEffect, useContext,useCallback,useMemo } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import Link from "next/link";
//import * as XLSX from "xlsx"; // Importar la librería xlsx
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import AuthContext from "../../context/AuthContext";
import { useRouter } from 'next/router';
import {
  MagnifyingGlassIcon,
  ShieldExclamationIcon, TrashIcon, PencilSquareIcon , ArrowDownCircleIcon, UserPlusIcon
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deepSearch } from "../../utils/deepSearch";


const EstudiantesReporte = ({token}) => {
  const { user } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
   

  });
  const [currentPage, setCurrentPage] = useState(1); // Página actual
   const [recordsPerPage, setUsersPerPage] = useState(10); // Valor inicial
  const [permisos, setPermisos] = useState([]);
  const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
 // const [currentEstudiantes, setCurrentEstudiantes] = useState([]);
 const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  useEffect(() => {
    document.title = "Estudiantes";
}, []);

  useEffect(() => {
    if (user && user.rol) {
      fetchEstudiantes();
      fetchPermisos(user.rol);
    }
  }, [user]);


  // 📌 Limpiar búsqueda
const handleClearSearch = () => {
  setSearchQuery({ general: "" });
  setCurrentPage(1); // Reiniciar a la primera página
};
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get("/api/estudiantes");
      setEstudiantes(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

  const fetchPermisos = async (rolId) => {
    try {
      const response = await axios.get(`/api/permisos?rolId=${rolId}`);
      // Convierte la lista de permisos en un objeto de permisos
      const permisosMap = response.data.reduce((acc, permiso) => {
        acc[permiso.Id_Objeto] = {
          insertar: permiso.Permiso_Insertar === "1",
          actualizar: permiso.Permiso_Actualizar === "1",
          eliminar: permiso.Permiso_Eliminar === "1",
          consultar: permiso.Permiso_Consultar === "1",
        };
        return acc;
      }, {});
      setPermisos(permisosMap);
    } catch (error) {
      console.error("Error al obtener permisos", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/estudiantes/${id}`);
      toast.error("Estudiante Eliminado Con Exito!",{
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
      fetchEstudiantes();
    } catch (error) {
      toast.error("Error al eliminar estudiante", error);
    }
  };
  const handleSearch = (e) => {

  };



  const handleEdit = (item) => {
    router.push({
      pathname: '/estudiante', // Ruta de la página destino
      query: {
        tab: 1,
        idEstudiante: item.Id_Estudiante,
      },
    });
  };

  const router = useRouter();


  
  
    



 
  // Cambiar página
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  useEffect(() => {
    if (estudiantes.length > 0) {  // Evitar que se ejecute con datos vacíos
        const filteredData = estudiantes.filter((estudiante) =>
            deepSearch(estudiante, searchQuery,0, 4)
        );
        setFilteredEstudiantes(filteredData);
        
        // 🔥 Ajustar la página si el filtro cambia el total de páginas
        if (currentPage > Math.ceil(filteredData.length / recordsPerPage)) {
            setCurrentPage(1);
        }
    }
}, [estudiantes, searchQuery]);
// 📌 **Calcular los Límites de Paginación**
const totalPages = filteredEstudiantes.length > 0 ? Math.ceil(filteredEstudiantes.length / recordsPerPage) : 1;
const indexOfFirst = Math.max(0, (currentPage - 1) * recordsPerPage);
const indexOfLast = Math.min(filteredEstudiantes.length, indexOfFirst + recordsPerPage);

// 📌 **Obtener los Estudiantes para la Página Actual**
const currentEstudiantes = useMemo(() => {
    return filteredEstudiantes.slice(indexOfFirst, indexOfLast);
}, [filteredEstudiantes, indexOfFirst, indexOfLast]);
  

  const exportToExcelold = async () => {
    // 1️⃣ Crear un nuevo libro y hoja de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Estudiantes");
  
    // 2️⃣ Definir las columnas y encabezados
    worksheet.columns = [
      { header: "#", key: "Index", width: 5 },
      { header: "Fecha Registro", key: "Fecha_Creacion", width: 15 },
      { header: "Beneficio", key: "Beneficio", width: 20 },
      { header: "Área", key: "Area", width: 20 },
      { header: "Identidad", key: "Identidad", width: 20 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Sexo", key: "Sexo", width: 10 },
      { header: "Año Matrícula", key: "Año_Matricula", width: 15 },
      { header: "Modalidad", key: "Modalidad", width: 20 },
      { header: "Grado", key: "Grado", width: 15 },
      { header: "Sección", key: "Seccion", width: 15 },
      { header: "Lugar Nacimiento", key: "Lugar_Nacimiento", width: 20 },
      { header: "Instituto", key: "Instituto", width: 30 },
      { header: "Municipio", key: "Municipio", width: 20 },
      { header: "Dirección", key: "Direccion", width: 30 },
      { header: "Teléfono", key: "Telefono", width: 15 },
      { header: "Estado", key: "Estado", width: 15 },
      { header: "Tutor Identidad", key: "Tutor_Identidad", width: 20 },
      { header: "Tutor Nombre", key: "Tutor_Nombre", width: 30 },
      { header: "Benefactor Identidad", key: "Benefactor_Identidad", width: 20 },
      { header: "Benefactor Nombre", key: "Benefactor_Nombre", width: 30 },
      { header: "Benefactor Teléfono", key: "Benefactor_Telefono", width: 15 },
      { header: "Benefactor Dirección", key: "Benefactor_Direccion", width: 30 },
    ];
  
    // 3️⃣ Transformar los datos antes de agregarlos
    const exportData = currentEstudiantes.map((estudiante, index) => ({
      Index: index + 1,
      Fecha_Creacion: estudiante.Fecha_Creacion
        ? new Date(estudiante.Fecha_Creacion).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "-",
      Beneficio: estudiante.Beneficio?.Nombre_Beneficio || "-",
      Area: estudiante.Area?.Nombre_Area || "-",
      Identidad: estudiante.Persona?.Identidad || "-",
      Nombre: `${estudiante.Persona?.Primer_Nombre || ""} ${
        estudiante.Persona?.Segundo_Nombre || ""
      } ${estudiante.Persona?.Primer_Apellido || ""} ${
        estudiante.Persona?.Segundo_Apellido || ""
      }`,
      Sexo:
        estudiante.Persona?.Sexo === 1
          ? "Masculino"
          : estudiante.Persona?.Sexo === 0
          ? "Femenino"
          : "-",
      Año_Matricula:
        Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Fecha_Matricula
          ? new Date(estudiante.Matriculas[0]?.Fecha_Matricula).getFullYear()
          : "-",
      Modalidad:
        Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Modalidad?.Nombre || "-",
      Grado:
        Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Grado?.Nombre || "-",
      Seccion:
        Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Seccion?.Nombre_Seccion ||
        "-",
      Lugar_Nacimiento: estudiante.Persona?.Lugar_Nacimiento || "-",
      Instituto: estudiante.Instituto?.Nombre_Instituto || "-",
      Municipio: estudiante.Persona?.Municipio?.Nombre_Municipio || "-",
      Direccion: estudiante.Persona?.direccion || "-",
      Telefono: estudiante.Persona?.telefono || "-",
      Estado:
        estudiante.Persona?.Estado === 1
          ? "Activo"
          : estudiante.Persona?.Estado === 0
          ? "Inactivo"
          : "-",
      Tutor_Identidad: estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2
      )
        .map((relacion) => relacion.Persona.Identidad || "-")
        .join(", "),
      Tutor_Nombre: estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2
      )
        .map(
          (relacion) =>
            `${relacion.Persona.Primer_Nombre || "-"} ${
              relacion.Persona.Primer_Apellido || "-"
            }`
        )
        .join(", "),
      Benefactor_Identidad: estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3
      )
        .map((relacion) => relacion.Persona.Identidad || "-")
        .join(", "),
      Benefactor_Nombre: estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3
      )
        .map(
          (relacion) =>
            `${relacion.Persona.Primer_Nombre || "-"} ${
              relacion.Persona.Primer_Apellido || "-"
            }`
        )
        .join(", "),
      Benefactor_Telefono: estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3
      )
        .map((relacion) => relacion.Persona?.telefono || "-")
        .join(", "),
      Benefactor_Direccion: estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3
      )
        .map((relacion) => relacion.Persona?.direccion || "-")
        .join(", "),
    }));
  
    // 4️⃣ Agregar los datos a la hoja de cálculo
    exportData.forEach((estudiante) => {
      worksheet.addRow(estudiante);
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
  
    saveAs(fileBlob, "reporte_estudiantes.xlsx");
  };
  

  
  const exportToExcelv1 = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Estudiantes");
  
      // 🖼️ 1️⃣ Agregar imagen al encabezado
      const imageId = workbook.addImage({
          base64: "data:image/png;base64,....", // Reemplaza con tu imagen en Base64
          extension: "png",
      });
      worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          br: { col: 2, row: 2 },
      });
  
      // 🏷️ 2️⃣ Agregar título
      worksheet.mergeCells("A3:G3");
      worksheet.getCell("A3").value = "Reporte de Estudiantes";
      worksheet.getCell("A3").font = { size: 16, bold: true };
      worksheet.getCell("A3").alignment = { horizontal: "center" };
  
      // 📆 3️⃣ Agregar fecha de generación
      worksheet.mergeCells("H3:J3");
      worksheet.getCell("H3").value = `Fecha: ${new Date().toLocaleDateString("es-ES")}`;
      worksheet.getCell("H3").font = { bold: true };
      worksheet.getCell("H3").alignment = { horizontal: "right" };
  
      // 📊 4️⃣ Definir encabezados
      const headers = [
          { header: "#", key: "Index", width: 5 },
          { header: "Fecha Registro", key: "Fecha_Creacion", width: 15 },
          { header: "Beneficio", key: "Beneficio", width: 20 },
          { header: "Área", key: "Area", width: 20 },
          { header: "Identidad", key: "Identidad", width: 20 },
          { header: "Nombre", key: "Nombre", width: 30 },
          { header: "Sexo", key: "Sexo", width: 10 },
          { header: "Año Matrícula", key: "Año_Matricula", width: 15 },
          { header: "Modalidad", key: "Modalidad", width: 20 },
          { header: "Grado", key: "Grado", width: 15 },
          { header: "Sección", key: "Seccion", width: 15 },
          { header: "Lugar Nacimiento", key: "Lugar_Nacimiento", width: 20 },
          { header: "Instituto", key: "Instituto", width: 30 },
          { header: "Municipio", key: "Municipio", width: 20 },
          { header: "Dirección", key: "Direccion", width: 30 },
          { header: "Teléfono", key: "Telefono", width: 15 },
          { header: "Estado", key: "Estado", width: 15 },
          { header: "Tutor Identidad", key: "Tutor_Identidad", width: 20 },
          { header: "Tutor Nombre", key: "Tutor_Nombre", width: 30 },
          { header: "Benefactor Identidad", key: "Benefactor_Identidad", width: 20 },
          { header: "Benefactor Nombre", key: "Benefactor_Nombre", width: 30 },
          { header: "Benefactor Teléfono", key: "Benefactor_Telefono", width: 15 },
          { header: "Benefactor Dirección", key: "Benefactor_Direccion", width: 30 },
      ];
  
      // Aplicar encabezados en la fila 5
      worksheet.getRow(5).values = headers.map((h) => h.header);
      worksheet.getRow(5).font = { bold: true };
      worksheet.getRow(5).alignment = { horizontal: "center" };
      
      // Aplicar anchos de columna
      headers.forEach((col, index) => {
          worksheet.getColumn(index + 1).width = col.width;
      });
  
      // 📌 5️⃣ Transformar datos y agregarlos a la tabla
      const exportData = currentEstudiantes.map((estudiante, index) => ({
          Index: index + 1,
          Fecha_Creacion: estudiante.Fecha_Creacion
              ? new Date(estudiante.Fecha_Creacion).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
              : "-",
          Beneficio: estudiante.Beneficio?.Nombre_Beneficio || "-",
          Area: estudiante.Area?.Nombre_Area || "-",
          Identidad: estudiante.Persona?.Identidad || "-",
          Nombre: `${estudiante.Persona?.Primer_Nombre || ""} ${estudiante.Persona?.Segundo_Nombre || ""} ${estudiante.Persona?.Primer_Apellido || ""} ${estudiante.Persona?.Segundo_Apellido || ""}`,
          Sexo: estudiante.Persona?.Sexo === 1 ? "Masculino" : estudiante.Persona?.Sexo === 0 ? "Femenino" : "-",
          Año_Matricula: Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Fecha_Matricula
              ? new Date(estudiante.Matriculas[0]?.Fecha_Matricula).getFullYear()
              : "-",
          Modalidad: Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Modalidad?.Nombre || "-",
          Grado: Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Grado?.Nombre || "-",
          Seccion: Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Seccion?.Nombre_Seccion || "-",
          Lugar_Nacimiento: estudiante.Persona?.Lugar_Nacimiento || "-",
          Instituto: estudiante.Instituto?.Nombre_Instituto || "-",
          Municipio: estudiante.Persona?.Municipio?.Nombre_Municipio || "-",
          Direccion: estudiante.Persona?.Direccion || "-",
          Telefono: estudiante.Persona?.Telefono || "-",
          Estado: estudiante.Persona?.Estado === 1 ? "Activo" : estudiante.Persona?.Estado === 0 ? "Inactivo" : "-",
          Tutor_Identidad: estudiante.Relaciones.filter(rel => rel.TipoPersona?.Id_Tipo_Persona === 2).map(rel => rel.Persona.Identidad || "-").join(", "),
          Tutor_Nombre: estudiante.Relaciones.filter(rel => rel.TipoPersona?.Id_Tipo_Persona === 2).map(rel => `${rel.Persona.Primer_Nombre || "-"} ${rel.Persona.Primer_Apellido || "-"}`).join(", "),
          Benefactor_Identidad: estudiante.Relaciones.filter(rel => rel.TipoPersona?.Id_Tipo_Persona === 3).map(rel => rel.Persona.Identidad || "-").join(", "),
          Benefactor_Nombre: estudiante.Relaciones.filter(rel => rel.TipoPersona?.Id_Tipo_Persona === 3).map(rel => `${rel.Persona.Primer_Nombre || "-"} ${rel.Persona.Primer_Apellido || "-"}`).join(", "),
          Benefactor_Telefono: estudiante.Relaciones.filter(rel => rel.TipoPersona?.Id_Tipo_Persona === 3).map(rel => rel.Persona?.Telefono || "-").join(", "),
          Benefactor_Direccion: estudiante.Relaciones.filter(rel => rel.TipoPersona?.Id_Tipo_Persona === 3).map(rel => rel.Persona?.Direccion || "-").join(", "),
      }));
  
      // Agregar datos a la hoja
      exportData.forEach((estudiante) => {
          worksheet.addRow(estudiante);
      });
  
      // 📌 6️⃣ Aplicar filtros
      worksheet.autoFilter = {
          from: { row: 5, column: 1 },
          to: { row: 5 + exportData.length, column: headers.length },
      };
  
      // 📥 7️⃣ Generar el archivo y descargarlo
      const buffer = await workbook.xlsx.writeBuffer();
      const fileBlob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      saveAs(fileBlob, "reporte_estudiantes.xlsx");
  };

  const getBase64ImageFromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extraer base64
        reader.readAsDataURL(blob);
    });
};


const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Estudiantes");

    // 📌 **Obtener la Imagen en Base64**
    const logoBase64 = await getBase64ImageFromUrl("/img/intur.png");
    const imageId = workbook.addImage({
        base64: logoBase64,
        extension: "png",
    });

    // 📌 **Insertar el Logo en la Esquina Izquierda**
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 }, // Posición en la celda A1
        ext: { width: 120, height: 50 }, // Tamaño del logo
    });

    // 📌 **Insertar el Título en la Fila 1**
    worksheet.mergeCells("B1", "K1");
    worksheet.getCell("B1").value = "Reporte de Estudiantes";
    worksheet.getCell("B1").font = { bold: true, size: 16 };
    worksheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };

    // 📌 **Fecha de Exportación en la Fila 2**
    worksheet.mergeCells("B2", "K2");
    worksheet.getCell("B2").value = `Fecha de Exportación: ${new Date().toLocaleDateString("es-ES")}`;
    worksheet.getCell("B2").font = { italic: true, size: 12 };
    worksheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

    // 📌 **Criterios de Búsqueda en la Fila 3**
    const filterCriteria = Object.entries(searchQuery || {})
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ") || "Sin filtros";

    worksheet.mergeCells("B3", "K3");
    worksheet.getCell("B3").value = `Criterios de Búsqueda: ${filterCriteria}`;
    worksheet.getCell("B3").font = { italic: true, size: 12 };
    worksheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };

    // 📌 **Agregar una Fila Vacía en la Fila 4 para Separar los Encabezados**
    worksheet.getRow(4).values = [];

    // 📌 **Definir Encabezados desde la Fila 5**
    const headers = [
        { header: "#", key: "Index", width: 5 },
        { header: "Fecha Registro", key: "Fecha_Creacion", width: 15 },
        { header: "Beneficio", key: "Beneficio", width: 20 },
        { header: "Área", key: "Area", width: 20 },
        { header: "Identidad", key: "Identidad", width: 20 },
        { header: "Nombre", key: "Nombre", width: 30 },
        { header: "Sexo", key: "Sexo", width: 10 },
        { header: "Año Matrícula", key: "Año_Matricula", width: 15 },
        { header: "Modalidad", key: "Modalidad", width: 20 },
        { header: "Grado", key: "Grado", width: 15 },
        { header: "Sección", key: "Seccion", width: 15 },
        { header: "Lugar Nacimiento", key: "Lugar_Nacimiento", width: 20 },
        { header: "Instituto", key: "Instituto", width: 30 },
        { header: "Municipio", key: "Municipio", width: 20 },
        { header: "Dirección", key: "Direccion", width: 30 },
        { header: "Teléfono", key: "Telefono", width: 15 },
        { header: "Estado", key: "Estado", width: 15 },
    ];

    // 📌 **Estilizar los Encabezados en la Fila 5**
    const headerRow = worksheet.getRow(5);
    headerRow.values = headers.map((h) => h.header);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };

    // 📌 **Definir Anchos de Columna**
    headers.forEach((col, index) => {
        worksheet.getColumn(index + 1).width = col.width;
    });

    // 📌 **Filtrar Estudiantes con deepSearch**
    const filteredStudents = estudiantes.filter((estudiante) => deepSearch(estudiante, searchQuery));

    // 📌 **Agregar Datos al Excel (A partir de la fila 6)**
    let rowIndex = 6;
    filteredStudents.forEach((estudiante, index) => {
        worksheet.getRow(rowIndex).values = [
            index + 1,
            estudiante.Fecha_Creacion ? new Date(estudiante.Fecha_Creacion).toLocaleDateString("es-ES") : "-",
            estudiante.Beneficio?.Nombre_Beneficio || "-",
            estudiante.Area?.Nombre_Area || "-",
            estudiante.Persona?.Identidad || "-",
            `${estudiante.Persona?.Primer_Nombre || ""} ${estudiante.Persona?.Segundo_Nombre || ""} ${estudiante.Persona?.Primer_Apellido || ""} ${estudiante.Persona?.Segundo_Apellido || ""}`.trim(),
            estudiante.Persona?.Sexo === 1 ? "Masculino" : estudiante.Persona?.Sexo === 0 ? "Femenino" : "-",
            Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Fecha_Matricula
                ? new Date(estudiante.Matriculas[0]?.Fecha_Matricula).getFullYear()
                : "-",
            Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Modalidad?.Nombre || "-",
            Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Grado?.Nombre || "-",
            Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Seccion?.Nombre_Seccion || "-",
            estudiante.Persona?.Lugar_Nacimiento || "-",
            estudiante.Instituto?.Nombre_Instituto || "-",
            estudiante.Persona?.Municipio?.Nombre_Municipio || "-",
            estudiante.Persona?.Direccion || "-",
            estudiante.Persona?.Telefono || "-",
            estudiante.Persona?.Estado === 1 ? "Activo" : estudiante.Persona?.Estado === 0 ? "Inactivo" : "-",
        ];
        rowIndex++;
    });

    // 📌 **Descargar el Archivo**
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Reporte_Estudiantes.xlsx");
};

  

if(!token){
 console.log(token)
  return (
    <Layout>
      <div className="container mx-auto p-1  min-h-screen">
    

{/* Contenedor de acciones y encabezado */}
<div className="mb-1 flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
  
 

  {/* Barra de búsqueda */}
  {permisos[1]?.consultar && (
  <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
     <MagnifyingGlassIcon className="h-6 w-6 mr-2 text-gray-600" />
     <input
   type="text"
   value={searchQuery.general}
   onChange={(e) => setSearchQuery((prev) => ({ ...prev, general: e.target.value }))} // ✅ Se mantiene la estructura
   className="border-none focus:ring-0 w-200 text-gray-700 bg-transparent"
   placeholder="Buscar por nombre o correo"
/>

 
       {/* Botón para limpiar búsqueda */}
   {searchQuery.general && (
     <button
       onClick={handleClearSearch}
       className="px-0 py-0 bg-white-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
     >
       ❌ 
     </button>
     
   )
   }
   </div>


  )}
   {/* Título de la sección */}
   <p className="text-3xl font-bold text-blue-700">📋Reporte de Estudiantes</p>

  {/* Botones de acciones */}
  <div className="flex gap-x-2">
    {permisos[1]?.insertar && (
      <button
        onClick={() => (window.location.href = "/estudiante")}
        className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
      >
        <UserPlusIcon className="h-5 w-5 mr-2" /> Agregar
      </button>
    )}

    {/* {permisos[1]?.actualizar && (
      <Link href={`/estudiante`}>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
          <PencilSquareIcon className="h-5 w-5 mr-2" /> Editar
        </button>
      </Link>
    )} */}

    {/* Botón de exportación */}
    <button
      onClick={exportToExcel}
      className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md"
    >
      <ArrowDownCircleIcon className="h-5 w-5 mr-2" /> Exportar
    </button>
  </div>

</div>


        {permisos[1]?.consultar ? (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="xls_style-excel-table  w-full">
<thead>
<tr className="bg-blue-200 text-black uppercase text-sm font-semibold">
<th rowSpan="2" className="py-2 px-4 border" >#</th>
        <th rowSpan="2" className="py-2 px-4 bg-orange-300 ">Acciones</th>
        <th rowSpan="2" className="py-2 px-4 border">Identidad</th>
        <th rowSpan="2" className="py-2 px-5 border" style={{ width: '300px' }} >Nombre</th>
        <th rowSpan="2" className="py-2 px-4 border">Fecha Registro</th>
        <th rowSpan="2" className="py-2 px-4 border">Beneficio</th>
        <th rowSpan="2" className="py-2 px-4 border">Área</th>

        <th rowSpan="2" className="py-2 px-4 border">Sexo</th>
        <th rowSpan="2" className="py-2 px-4 border">Año Matrícula</th>
        <th rowSpan="2" className="py-2 px-4 border">Modalidad</th>
        <th rowSpan="2" className="py-2 px-4 border">Grado</th>
        <th rowSpan="2" className="py-2 px-4 border">Sección</th>
        <th rowSpan="2" className="py-2 px-4 border">Lugar Nacimiento</th>
        <th rowSpan="2" className="py-2 px-4 border">Instituto</th>
        <th rowSpan="2" className="py-2 px-4 border">Municipio</th>
        <th rowSpan="2" className="py-2 px-4 border">Teléfono</th>
        <th rowSpan="2" className="py-2 px-4 border">Dirección</th>
        <th rowSpan="2" className="py-2 px-4 border">
        Estado
    {/* <select
        className="ml p-1 border border-gray-300 rounded"
        value={searchQuery.Estado}
        onChange={(e) => setSearchQuery({ ...searchQuery, EstadoDisplay: e.target.value })}
    >
        <option value="">Todos</option>
        {userStates.map((state) => (
            <option key={state.Id_EstadoUsuario} value={state.Descripcion}>
                {state.Descripcion}
            </option>
        ))}
    </select> */}
        </th>
        <th colSpan="4" className="py-2 px-4 bg-violet-400">Tutor</th>
        <th colSpan="4" className="py-2 px-4 bg-emerald-400">Benefactor</th>

      </tr>

  {/* Segunda fila con subcolumnas específicas de Tutor y Benefactor */}
  <tr className="bg-blue-200 text-black uppercase text-sm font-semibold">
        {/* Subcolumnas de Tutor */}
        <th className="py-2 px-4 bg-violet-400 ">Identidad</th>
        <th className="py-2 px-4 bg-violet-400">Nombre</th>
        <th className="py-2 px-4 bg-violet-400">Teléfono</th>
        <th className="py-2 px-4 bg-violet-400">Dirección</th>
        {/* Subcolumnas de Benefactor */}
        <th className="py-2 px-4 bg-emerald-400">Identidad</th>
        <th className="py-2 px-4 bg-emerald-400">Nombre</th>
        <th className="py-2 px-4 bg-emerald-400">Teléfono</th>
        <th className="py-2 px-4 bg-emerald-400">Dirección</th>
      </tr>
</thead>


            <tbody>
              {currentEstudiantes.map((estudiante,index) => (
                <tr key={estudiante.Id_Estudiante} className="hover:bg-blue-50">
                         <td className="py-4 px-6 border-b">
                         {index + 1}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <div className="flex gap-2">

                    {permisos[1]?.actualizar && (
    <button
      onClick={() => handleEdit(estudiante)}


      
      className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      <PencilSquareIcon className="h-5 w-6" />
    </button>
  )}


                      {permisos[1]?.eliminar && (
                        <button
                          onClick={() => handleDelete(estudiante.Id_Estudiante)}
                          className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                          <TrashIcon className="h-5 w-6" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.Identidad || "Identidad -"}
                  </td>
                  <td className="min-w-60 max-w-60 border py-4 px-6 border-b" style={{ width: '300px' }}>
                    {`${estudiante.Persona?.Primer_Nombre || ""} ${
                      estudiante.Persona?.Segundo_Nombre || ""
                    } ${estudiante.Persona?.Primer_Apellido || ""} ${
                      estudiante.Persona?.Segundo_Apellido || ""
                    }`}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Fecha_Creacion
                      ? new Date(estudiante.Fecha_Creacion).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "Fecha -"}
                  </td>
          
                  <td className="py-4 px-6 border-b">
                    {estudiante.Beneficio?.Nombre_Beneficio ||
                      "Beneficio -"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Area?.Nombre_Area || "Área -"}
                  </td>
  
                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.Sexo === 1
                      ? "Masculino"
                      : estudiante.Persona?.Sexo === 0
                      ? "Femenino"
                      : "Sexo -"}
                  </td>
                  <td className="py-4 px-6 border-b">
  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Fecha_Matricula
    ? new Date(estudiante.Matriculas[0]?.Fecha_Matricula).getFullYear()
    : "-"}
</td>

                  <td className="py-4 px-6 border-b">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Modalidad?.Nombre || "-"}
                  </td>

                  <td className="py-4 px-6 border-b">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Grado?.Nombre || "-"}
                  </td>
                  <td className="py-4 px-6 border-b">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Seccion?.Nombre_Seccion || "-"}
                  </td>


                  


                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.Lugar_Nacimiento ||
                      "Lugar de nacimiento -"}
                  </td>
                  <td className="min-w-60 max-w-60 py-4 px-6 border-b">
                    {estudiante.Instituto?.Nombre_Instituto ||
                      "Instituto -"}
                  </td>
              
                  <td className="min-w-60 max-w-60 py-4 px-6 border-b">
                    {estudiante.Persona?.Municipio?.Nombre_Municipio ||
                      "Municipio -"}
                  </td>

                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.telefono ||
                      "-"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.direccion ||
                      "-"}
                  </td>
            
                  <td className="py-4 px-6 border-b">
                    <strong>
                      {estudiante?.Persona?.Estado === 1
                        ? "Activo"
                        : estudiante?.Persona?.Estado === 0
                        ? "Inactivo"
                        : "Estado -"}
                    </strong>
                  </td>

                  <td className="py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2) 
                   .map(relacion => {

                  const identidad = relacion.Persona.Identidad || '-';
   

                  return `
                  ${identidad}
                    
                  `;
                }).join('')}
              </ul>
                  </td>
                  <td className="min-w-60 max-w-60 py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2) 
                   .map(relacion => {
            
                  const primerNombre = relacion.Persona.Primer_Nombre || '-';
                  const primerApellido = relacion.Persona.Primer_Apellido || '-';


                  return `
                 ${primerNombre} ${primerApellido}
                    
                  `;
                }).join('')}
              </ul>
                  </td>

                  <td className="py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2) 
                   .map(relacion => {
            
                  const telefono = relacion.Persona.telefono || '-';
          


                  return `
                 ${telefono} 
                    
                  `;
                }).join('')}
              </ul>
                  </td>
                  <td className="py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2) 
                   .map(relacion => {
            
                  const direccion = relacion.Persona.direccion || '-';
          


                  return `
                 ${direccion} 
                    
                  `;
                }).join('')}
              </ul>
                  </td>
    
      {/* para benefactores             */}
                  <td className="py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3) 
                   .map(relacion => {
    
                  const identidad = relacion.Persona.Identidad || '-';
         

                  return `
                  ${identidad}
                    
                  `;
                }).join('')}
              </ul>
                  </td>
              
                  
                  <td className="min-w-60 max-w-60 py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3) 
                   .map(relacion => {

                  const primerNombre = relacion.Persona.Primer_Nombre || '-';
                  const primerApellido = relacion.Persona.Primer_Apellido || '-';
       

                  return `
                  ${primerNombre} ${primerApellido}
                    
                  `;
                }).join('')}
              </ul>
                  </td>
                  
                  <td className="min-w-60 max-w-60 py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3) 
                   .map(relacion => {
            
                  const telefono = relacion.Persona.telefono || '-';
          


                  return `
                 ${telefono} 
                    
                  `;
                }).join('')}
              </ul>
                  </td>
                  <td className="min-w-60 max-w-60 py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3) 
                   .map(relacion => {
            
                  const direccion = relacion.Persona.direccion || '-';
          


                  return `
                 ${direccion} 
                    
                  `;
                }).join('')}
              </ul>
                  </td>
                  
                  
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : (
          // Mostrar el mensaje si no tiene permisos para consultar

          <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
            <ShieldExclamationIcon className="h-12 w-12 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Sin permisos para consultar</h3>
              <p>No tienes permisos para consultar la información.</p>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-4">
        <div className="flex items-center mb-4">
        <span className="mr-2 text-gray-700">Mostrar:</span>
        <select
          className="border border-gray-300 rounded-md px-2 py-1"
          value={recordsPerPage}
          onChange={(e) => {
            setUsersPerPage(Number(e.target.value));
            setCurrentPage(1); // Reinicia a la página 1 al cambiar cantidad
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

      </div>

          {/* Páginas */}
          <div className="flex space-x-2">
                      {/* Botón "Anterior" */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
          >
            Anterior
          </button>
            {Array.from(
              {
                length: Math.ceil(filteredEstudiantes.length / recordsPerPage),
              },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
                    currentPage === index + 1
                      ? "bg-white-600 text-black shadow-lg scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
                {/* Botón "Siguiente" */}
          <button
            onClick={nextPage}
            disabled={
              currentPage ===
              Math.ceil(filteredEstudiantes.length / recordsPerPage)
            }
            className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
          >
            Siguiente
          </button>
          </div>

      
        </div>
      </div>
    </Layout>
  );
}};

export default EstudiantesReporte;
