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

import ColumnSelection  from "../../components/basicos/ColumnSelection";

const EstudiantesReporte = ({token}) => {
  const { user } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
   

  });

  const [columnsVisible, setColumnsVisible] = useState({
    estudiante: true,
    persona: true,
    matricula: false,
    tutor: false,
    benefactor: false,
    estado: false,
  });

  const handleColumnChange = (updatedColumns) => {
    setColumnsVisible(updatedColumns);
  };

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
  



  


  const [anchoTabla , setAnchoPantalla] = useState(600); // Inicializa con 0 o null

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnchoPantalla(window.innerWidth);
  
      const handleResize = () => {
        setAnchoPantalla(window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getBase64ImageFromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extraer base64
        reader.readAsDataURL(blob);
    });
};







const limpiarDato = (valor) => {
  return typeof valor === "string" && valor.trim() !== ""
    ? valor
    : typeof valor === "number"
    ? valor
    : "-";
};

const exportToExcelv1 = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Estudiantes");

  const logoBase64 = await getBase64ImageFromUrl("/img/intur.png");
  const imageId = workbook.addImage({
    base64: logoBase64,
    extension: "png",
  });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 120, height: 50 },
  });

  worksheet.mergeCells("B1", "K1");
  worksheet.getCell("B1").value = "Reporte de Estudiantes";
  worksheet.getCell("B1").font = { bold: true, size: 16 };
  worksheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };

  worksheet.mergeCells("B2", "K2");
  worksheet.getCell("B2").value = `Fecha de Exportación: ${new Date().toLocaleDateString("es-ES")}`;
  worksheet.getCell("B2").font = { italic: true, size: 12 };
  worksheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

  const filterCriteria = Object.entries(searchQuery || {})
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ") || "Sin filtros";

  worksheet.mergeCells("B3", "K3");
  worksheet.getCell("B3").value = `Criterios de Búsqueda: ${filterCriteria}`;
  worksheet.getCell("B3").font = { italic: true, size: 12 };
  worksheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };

  worksheet.getRow(4).values = [];

  // 🔹 Definir headers
  const headers = [
    { header: "#", key: "Index", width: 5 },
    { header: "Fecha Registro", key: "Fecha_Creacion", width: 15 },
    { header: "Beneficio", key: "Beneficio", width: 20 },
    { header: "Área", key: "Area", width: 20 },
    { header: "Identidad", key: "Identidad", width: 20 },
    { header: "Nombre", key: "Nombre", width: 30 },
    { header: "Sexo", key: "Sexo", width: 10 },
    { header: "Lugar Nacimiento", key: "Lugar_Nacimiento", width: 20 },
    { header: "Instituto", key: "Instituto", width: 30 },
    { header: "Municipio", key: "Municipio", width: 20 },
    { header: "Dirección", key: "Direccion", width: 30 },
    { header: "Teléfono", key: "Telefono", width: 15 },
    { header: "Estado", key: "Estado", width: 15 },
  ];

  if (columnsVisible?.matricula) {
    headers.push(
      { header: "Año Matrícula", key: "Año_Matricula", width: 15 },
      { header: "Modalidad", key: "Modalidad", width: 20 },
      { header: "Grado", key: "Grado", width: 15 },
      { header: "Sección", key: "Seccion", width: 15 }
    );
  }

  if (columnsVisible?.tutor) {
    headers.push(
      { header: "Tutor Identidad", key: "Tutor_Identidad", width: 20 },
      { header: "Tutor Nombre", key: "Tutor_Nombre", width: 25 },
      { header: "Tutor Teléfono", key: "Tutor_Telefono", width: 15 },
      { header: "Tutor Dirección", key: "Tutor_Direccion", width: 30 }
    );
  }

  if (columnsVisible?.benefactor) {
    headers.push(
      { header: "Benefactor Identidad", key: "Benefactor_Identidad", width: 20 },
      { header: "Benefactor Nombre", key: "Benefactor_Nombre", width: 25 },
      { header: "Benefactor Teléfono", key: "Benefactor_Telefono", width: 15 },
      { header: "Benefactor Dirección", key: "Benefactor_Direccion", width: 30 }
    );
  }

 

  worksheet.getRow(5).values = headers.map((h) => h.header);
  worksheet.getRow(5).font = { bold: true, color: { argb: "FFFFFF" } };
  worksheet.getRow(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
  worksheet.getRow(5).alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(5).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  
  headers.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width;
  });
  

  worksheet.getRow(5).values = headers.map(h => h.header);
headers.forEach((col, index) => {
  worksheet.getColumn(index + 1).width = col.width;
});

   // 🧠 Enlazar columnas directamente con los datos
  // worksheet.columns = headers;
  // 🔁 Agregar filas
  filteredEstudiantes.forEach((estudiante, index) => {
    const p = estudiante.Persona || {};
    const m = Array.isArray(estudiante.Matriculas) ? estudiante.Matriculas[0] || {} : {};
    const municipio = p.Municipio || {};
    const relaciones = estudiante.Relaciones || [];

    const dataRow = {
      Index: index + 1,
      Fecha_Creacion: estudiante.Fecha_Creacion
        ? new Date(estudiante.Fecha_Creacion).toLocaleDateString("es-ES")
        : "-",
      Beneficio: limpiarDato(estudiante.Beneficio?.Nombre_Beneficio),
      Area: limpiarDato(estudiante.Area?.Nombre_Area),
      Identidad: `'${limpiarDato(p.Identidad)}`,
      Nombre: limpiarDato(`${p.Primer_Nombre || ""} ${p.Segundo_Nombre || ""} ${p.Primer_Apellido || ""} ${p.Segundo_Apellido || ""}`.trim()),
      Sexo: p.Sexo === 1 ? "Masculino" : p.Sexo === 0 ? "Femenino" : "-",
      Lugar_Nacimiento: limpiarDato(p.Lugar_Nacimiento),
      Instituto: limpiarDato(estudiante.Instituto?.Nombre_Instituto),
      Municipio: limpiarDato(municipio.Nombre_Municipio),
      Direccion: limpiarDato(p.Direccion),
      Telefono: limpiarDato(p.Telefono),
      Estado: p.Estado === 1 ? "Activo" : p.Estado === 0 ? "Inactivo" : "-",
    };

    if (columnsVisible?.matricula) {
      dataRow["Año_Matricula"] = m.Fecha_Matricula
        ? new Date(m.Fecha_Matricula).getFullYear()
        : "-";
      dataRow["Modalidad"] = limpiarDato(m.Modalidad?.Nombre);
      dataRow["Grado"] = limpiarDato(m.Grado?.Nombre);
      dataRow["Seccion"] = limpiarDato(m.Seccion?.Nombre_Seccion);
    }

    if (columnsVisible?.tutor) {
      const tutores = relaciones.filter(r => r.TipoPersona?.Id_Tipo_Persona === 2);

      dataRow["Tutor_Nombre"] = tutores.map(t => `${limpiarDato(t.Persona?.Primer_Nombre)} ${limpiarDato(t.Persona?.Primer_Apellido)}`).join("\n");
      dataRow["Tutor_Identidad"] = tutores.map(t => `'${limpiarDato(t.Persona?.Identidad)}`).join("\n");
      dataRow["Tutor_Telefono"] = tutores.map(t => limpiarDato(t.Persona?.Telefono)).join("\n");
      dataRow["Tutor_Direccion"] = tutores.map(t => limpiarDato(t.Persona?.Direccion)).join("\n");
      
    }

    if (columnsVisible?.benefactor) {
      const benefactores = relaciones.filter(r => r.TipoPersona?.Id_Tipo_Persona === 3);
      dataRow["Benefactor_Identidad"] = benefactores.map(b => `'${limpiarDato(b.Persona?.Identidad)}`).join(", ");
      dataRow["Benefactor_Nombre"] = benefactores.map(b => `${limpiarDato(b.Persona?.Primer_Nombre)} ${limpiarDato(b.Persona?.Primer_Apellido)}`).join(", ");
      dataRow["Benefactor_Telefono"] = benefactores.map(b => limpiarDato(b.Persona?.Telefono)).join(", ");
      dataRow["Benefactor_Direccion"] = benefactores.map(b => limpiarDato(b.Persona?.Direccion)).join(", ");
    }

    const orderedRow = headers.map(h => dataRow[h.key]);
    worksheet.addRow(orderedRow);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Reporte_Estudiantes_${Date.now()}.xlsx`);
};

const exportToExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Estudiantes");

  const logoBase64 = await getBase64ImageFromUrl("/img/intur.png");
  const imageId = workbook.addImage({ base64: logoBase64, extension: "png" });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 120, height: 50 },
  });

  worksheet.mergeCells("B1", "K1");
  worksheet.getCell("B1").value = "Reporte de Estudiantes";
  worksheet.getCell("B1").font = { bold: true, size: 16 };
  worksheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };

  worksheet.mergeCells("B2", "K2");
  worksheet.getCell("B2").value = `Fecha de Exportación: ${new Date().toLocaleDateString("es-ES")}`;
  worksheet.getCell("B2").font = { italic: true, size: 12 };
  worksheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

  const filterCriteria = Object.entries(searchQuery || {})
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ") || "Sin filtros";

  worksheet.mergeCells("B3", "K3");
  worksheet.getCell("B3").value = `Criterios de Búsqueda: ${filterCriteria}`;
  worksheet.getCell("B3").font = { italic: true, size: 12 };
  worksheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };

  const headers = [
    { header: "#", key: "Index", width: 5 },
    { header: "Fecha Registro", key: "Fecha_Creacion", width: 15 },
    { header: "Beneficio", key: "Beneficio", width: 20 },
    { header: "Área", key: "Area", width: 20 },
    { header: "Identidad", key: "Identidad", width: 20 },
    { header: "Nombre", key: "Nombre", width: 30 },
    { header: "Sexo", key: "Sexo", width: 10 },
    { header: "Lugar Nacimiento", key: "Lugar_Nacimiento", width: 20 },
    { header: "Instituto", key: "Instituto", width: 30 },
    { header: "Municipio", key: "Municipio", width: 20 },
    { header: "Dirección", key: "Direccion", width: 30 },
    { header: "Teléfono", key: "Telefono", width: 15 },
    { header: "Estado", key: "Estado", width: 15 },
  ];

  if (columnsVisible?.matricula) {
    headers.push(
      { header: "Año Matrícula", key: "Año_Matricula", width: 15 },
      { header: "Modalidad", key: "Modalidad", width: 20 },
      { header: "Grado", key: "Grado", width: 15 },
      { header: "Sección", key: "Seccion", width: 15 }
    );
  }

  if (columnsVisible?.tutor) {
    headers.push(
      { header: "Tutor Identidad", key: "Tutor_Identidad", width: 20 },
      { header: "Tutor Nombre", key: "Tutor_Nombre", width: 25 },
      { header: "Tutor Teléfono", key: "Tutor_Telefono", width: 15 },
      { header: "Tutor Dirección", key: "Tutor_Direccion", width: 30 }
    );
  }

  if (columnsVisible?.benefactor) {
    headers.push(
      { header: "Benefactor Identidad", key: "Benefactor_Identidad", width: 20 },
      { header: "Benefactor Nombre", key: "Benefactor_Nombre", width: 25 },
      { header: "Benefactor Teléfono", key: "Benefactor_Telefono", width: 15 },
      { header: "Benefactor Dirección", key: "Benefactor_Direccion", width: 30 }
    );
  }

  worksheet.getRow(5).values = headers.map((h) => h.header);
  worksheet.getRow(5).font = { bold: true, color: { argb: "FFFFFF" } };
  worksheet.getRow(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
  worksheet.getRow(5).alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(5).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
    bottom: { style: "thin" },
  };

  headers.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width;
  });

  // 🔁 Agregar filas
  filteredEstudiantes.forEach((estudiante, index) => {
    const p = estudiante.Persona || {};
    const m = Array.isArray(estudiante.Matriculas) ? estudiante.Matriculas[0] || {} : {};
    const municipio = p.Municipio || {};
    const relaciones = estudiante.Relaciones || [];

    const dataRow = {
      Index: index + 1,
      Fecha_Creacion: estudiante.Fecha_Creacion
        ? new Date(estudiante.Fecha_Creacion).toLocaleDateString("es-ES")
        : "-",
      Beneficio: limpiarDato(estudiante.Beneficio?.Nombre_Beneficio),
      Area: limpiarDato(estudiante.Area?.Nombre_Area),
      Identidad: `'${limpiarDato(p.Identidad)}`,
      Nombre: limpiarDato(`${p.Primer_Nombre || ""} ${p.Segundo_Nombre || ""} ${p.Primer_Apellido || ""} ${p.Segundo_Apellido || ""}`.trim()),
      Sexo: p.Sexo === 1 ? "Masculino" : p.Sexo === 0 ? "Femenino" : "-",
      Lugar_Nacimiento: limpiarDato(p.Lugar_Nacimiento),
      Instituto: limpiarDato(estudiante.Instituto?.Nombre_Instituto),
      Municipio: limpiarDato(municipio.Nombre_Municipio),
      Direccion: limpiarDato(p.Direccion),
      Telefono: limpiarDato(p.Telefono),
      Estado: p.Estado === 1 ? "Activo" : p.Estado === 0 ? "Inactivo" : "-",
    };

    if (columnsVisible?.matricula) {
      dataRow["Año_Matricula"] = m.Fecha_Matricula ? new Date(m.Fecha_Matricula).getFullYear() : "-";
      dataRow["Modalidad"] = limpiarDato(m.Modalidad?.Nombre);
      dataRow["Grado"] = limpiarDato(m.Grado?.Nombre);
      dataRow["Seccion"] = limpiarDato(m.Seccion?.Nombre_Seccion);
    }

    if (columnsVisible?.tutor) {
      const tutores = relaciones.filter(r => r.TipoPersona?.Id_Tipo_Persona === 2);
      dataRow["Tutor_Identidad"] = tutores.map(t => `'${limpiarDato(t.Persona?.Identidad)}`).join("\n");
      dataRow["Tutor_Nombre"] = tutores.map(t => `${limpiarDato(t.Persona?.Primer_Nombre)} ${limpiarDato(t.Persona?.Primer_Apellido)}`).join("\n");
      dataRow["Tutor_Telefono"] = tutores.map(t => limpiarDato(t.Persona?.Telefono)).join("\n");
      dataRow["Tutor_Direccion"] = tutores.map(t => limpiarDato(t.Persona?.Direccion)).join("\n");
    }

    if (columnsVisible?.benefactor) {
      const benefactores = relaciones.filter(r => r.TipoPersona?.Id_Tipo_Persona === 3);
      dataRow["Benefactor_Identidad"] = benefactores.map(b => `'${limpiarDato(b.Persona?.Identidad)}`).join("\n");
      dataRow["Benefactor_Nombre"] = benefactores.map(b => `${limpiarDato(b.Persona?.Primer_Nombre)} ${limpiarDato(b.Persona?.Primer_Apellido)}`).join("\n");
      dataRow["Benefactor_Telefono"] = benefactores.map(b => limpiarDato(b.Persona?.Telefono)).join("\n");
      dataRow["Benefactor_Direccion"] = benefactores.map(b => limpiarDato(b.Persona?.Direccion)).join("\n");
    }

    const orderedRow = headers.map(h => dataRow[h.key]);
    const row = worksheet.addRow(orderedRow);

    // 🧠 Activar wrapText si corresponde
    headers.forEach((col, i) => {
      const wrapKeys = [
        "Tutor_Identidad", "Tutor_Nombre", "Tutor_Telefono", "Tutor_Direccion",
        "Benefactor_Identidad", "Benefactor_Nombre", "Benefactor_Telefono", "Benefactor_Direccion"
      ];
      if (wrapKeys.includes(col.key)) {
        row.getCell(i + 1).alignment = { wrapText: true, vertical: "top" };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Reporte_Estudiantes_${Date.now()}.xlsx`);
};


if(!token){
 console.log(token)
  return (
    <Layout>
    
    <div style={{with:'100%'}}>
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
   <p>
   <p className="text-3xl font-bold text-blue-700">📋Reporte de Estudiantes
  

 </p>
 <ColumnSelection onColumnChange={handleColumnChange} />
   </p>
   


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
            <div >
 <div className="table-container"  style={{ overflowX: 'auto', width: "75vw"  }}>




  <table className="xls_style-excel-table min-w-max">
<thead>
<tr className="bg-blue-200 text-black uppercase text-sm font-semibold">
<th
          rowSpan="2"
          className="py-2 px-4 border sticky left-0 bg-white z-10 bg-blue-400"
          style={{ position: 'sticky', left: 0, zIndex: 10 ,backgroundColor:"#BFDBFE",border:"1px"}}
        >
          #
        </th>
        <th
          rowSpan="2"
          className="py-2 px-4 bg-orange-300 sticky left-0 bg-white z-10 bg-blue-400"
          style={{ position: 'sticky', left: '1rem', zIndex: 10,backgroundColor:"#BFDBFE" }}
        >
          Acciones
        </th>
        <th
          rowSpan="2"
          className="py-2 px-4 border sticky left-32 bg-white z-10 bg-blue-400"
          style={{ position: 'sticky', left: '5rem', zIndex: 10 ,backgroundColor:"#BFDBFE"}}
        >
          Identidad
        </th>
        <th
          rowSpan="2"
          className="py-2 px-5 border sticky left-48 bg-white z-10 bg-blue-400"
          style={{ position: 'sticky', left: '11rem', zIndex: 10,backgroundColor:"#BFDBFE" }}
        >
          Nombre
        </th>
        <th rowSpan="2" className="py-2 px-4 border">Fecha Registro</th>
        <th rowSpan="2" className="py-2 px-4 border">Beneficio</th>
        <th rowSpan="2" className="py-2 px-4 border">Área</th>

        <th rowSpan="2" className="py-2 px-4 border">Sexo</th>

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
       

   {/* Columna de Matrícula */}
   {columnsVisible.matricula && (
      <th colSpan="4" className="py-2 px-4 bg-blue-400">Matrícula</th>
    )}

{columnsVisible.tutor && (
           <th colSpan="4" className="py-2 px-4 bg-violet-400">Tutor</th>
    )}

{columnsVisible.benefactor && (
                  <th colSpan="4" className="py-2 px-4 bg-emerald-400">Benefactor</th>
    )}

 


      </tr>

  {/* Segunda fila con subcolumnas específicas de Tutor y Benefactor */}
  <tr className="bg-blue-200 text-black uppercase text-sm font-semibold">

        {/* Subcolumnas de Matricula */}
 

        {columnsVisible.matricula && (
      <>
        <th className="py-2 px-4 bg-blue-400">Año</th>
        <th className="py-2 px-4 bg-blue-400">Modalidad</th>
        <th className="py-2 px-4 bg-blue-400">Grado</th>
        <th className="py-2 px-4 bg-blue-400">Sección</th>
      </>
    )}

{columnsVisible.tutor && (
      <>
         <th className="py-2 px-4 bg-violet-400 ">Identidad</th>
        <th className="py-2 px-4 bg-violet-400">Nombre</th>
        <th className="py-2 px-4 bg-violet-400">Teléfono</th>
        <th className="py-2 px-4 bg-violet-400">Dirección</th>
      </>
    )}
        {/* Subcolumnas de Tutor */}
    
        {/* Subcolumnas de Benefactor */}

        {columnsVisible.benefactor && (
      <>
         <th className="py-2 px-4 bg-emerald-400 ">Identidad</th>
        <th className="py-2 px-4 bg-emerald-400">Nombre</th>
        <th className="py-2 px-4 bg-emerald-400">Teléfono</th>
        <th className="py-2 px-4 bg-emerald-400">Dirección</th>
      </>
    )}


      </tr>
</thead>


            <tbody>
              {currentEstudiantes.map((estudiante,index) => (
                <tr key={estudiante.Id_Estudiante} className="hover:bg-blue-50">
                         <td className=""   style={{ position: 'sticky', left: '0rem', zIndex: 10, backgroundColor: '#f3f4f6' }}>
                         {index + 1}
                  </td>
                  <td className="" style={{ position: 'sticky', left: '1rem', zIndex: 10, backgroundColor: '#f3f4f6' }}>
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
                  <td className="" style={{ position: 'sticky', left: '6rem', zIndex: 10 ,     backgroundColor: '#f3f4f6'}}>
                    {estudiante.Persona?.Identidad || "Identidad -"}
                  </td>
                  <td className="x5" style={{ position: 'sticky', left: '12rem', zIndex: 10, backgroundColor: '#f3f4f6' }}>
                    <div className="max-w-[15rem] whitespace-nowrap truncate">
                    {`${estudiante.Persona?.Primer_Nombre || ""} ${
                      estudiante.Persona?.Segundo_Nombre || ""
                    } ${estudiante.Persona?.Primer_Apellido || ""} ${
                      estudiante.Persona?.Segundo_Apellido || ""
                    }`}</div>
                  </td>
                  <td className="">
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
          
                  <td className="">
                    {estudiante.Beneficio?.Nombre_Beneficio ||
                      "Beneficio -"}
                  </td>
                  <td className="">
                    {estudiante.Area?.Nombre_Area || "Área -"}
                  </td>
  
                  <td className="">
                    {estudiante.Persona?.Sexo === 1
                      ? "Masculino"
                      : estudiante.Persona?.Sexo === 0
                      ? "Femenino"
                      : "Sexo -"}
                  </td>
                  
      

                  <td className="max-w-[15rem] whitespace-nowrap truncate">
                    {estudiante.Persona?.Lugar_Nacimiento ||
                      "Lugar de nacimiento -"}
                  </td>
                  <td className=" ">
                  <div className="max-w-[15rem] whitespace-nowrap truncate">
                    {estudiante.Instituto?.Nombre_Instituto ||
                      "Instituto -"}</div>
                  </td>
              
                  <td className="max-w-[15rem] whitespace-nowrap truncate">
                    {estudiante.Persona?.Municipio?.Nombre_Municipio ||
                      "Municipio -"}
                  </td>

                  <td className="">
                    {estudiante.Persona?.Telefono ||
                      "-"}                  </td>
<td className="max-w-[20rem] whitespace-pre-wrap break-words align-top px-2 py-2">
  {estudiante.Persona?.Direccion || "-"}
</td>


            
                  <td className="">
                    <strong>
                      {estudiante?.Persona?.Estado === 1
                        ? "Activo"
                        : estudiante?.Persona?.Estado === 0
                        ? "Inactivo"
                        : "Estado -"}
                    </strong>
                  </td>

                  {columnsVisible.matricula && (
      <>
     
                  <td className="">
  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Fecha_Matricula
    ? new Date(estudiante.Matriculas[0]?.Fecha_Matricula).getFullYear()
    : "-"}
</td>

                  <td className="">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Modalidad?.Nombre || "-"}
                  </td>

                  <td className="">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Grado?.Nombre || "-"}
                  </td>
                  <td className="">
                  {Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Seccion?.Nombre_Seccion || "-"}
                  </td>


      </>
    )}

 {/* Fila con subtabla de tutores */}
 {columnsVisible.tutor && (
    
      <td colSpan={4}>
  

        
  <table style={{ width: "100%",  }}>
  <thead>
    <tr>
     

    </tr>
  </thead>
  <tbody>
    {estudiante.Relaciones?.filter(r => r.TipoPersona?.Id_Tipo_Persona === 2).map((relacion, index) => (
      <tr key={`tutor-${estudiante.Id_Estudiante}-${index}`}>
        <td style={{ width: "25%" }}>{relacion.Persona?.Identidad || '-'}</td>
        <td style={{ width: "25%" }}>{`${relacion.Persona?.Primer_Nombre || ''} ${relacion.Persona?.Primer_Apellido || ''}`}</td>
        <td style={{ width: "25%" }}>{relacion.Persona?.Telefono || '-'}</td>
        <td style={{ width: "25%" }}>{relacion.Persona?.Direccion || '-'}</td>
      </tr>
    ))}
  </tbody>
</table>

      </td>
   
  )}

{columnsVisible.benefactor && (
    
    <td colSpan={4}>


      
<table style={{ width: "100%",  }}>
<thead>
  <tr>
   

  </tr>
</thead>
<tbody>
  {estudiante.Relaciones?.filter(r => r.TipoPersona?.Id_Tipo_Persona === 3).map((relacion, index) => (
    <tr key={`tutor-${estudiante.Id_Estudiante}-${index}`}>
      <td style={{ width: "25%" }}>{relacion.Persona?.Identidad || '-'}</td>
      <td style={{ width: "25%" }}>{`${relacion.Persona?.Primer_Nombre || ''} ${relacion.Persona?.Primer_Apellido || ''}`}</td>
      <td style={{ width: "25%" }}>{relacion.Persona?.Telefono || '-'}</td>
      <td style={{ width: "25%" }}>{relacion.Persona?.Direccion || '-'}</td>
    </tr>
  ))}
</tbody>
</table>

    </td>
 
)}
                </tr>
              ))}
            </tbody>
          </table></div></div>
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
