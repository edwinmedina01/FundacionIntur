import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import Link from "next/link";
import * as XLSX from "xlsx"; // Importar la librería xlsx
import AuthContext from "../../context/AuthContext";
import {
  MagnifyingGlassIcon,
  ShieldExclamationIcon, TrashIcon, PencilSquareIcon , ArrowDownCircleIcon, UserPlusIcon
} from "@heroicons/react/24/outline";

const EstudiantesReporte = () => {
  const { user } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [recordsPerPage] = useState(10); // Registros por página
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    if (user && user.rol) {
      fetchEstudiantes();
      fetchPermisos(user.rol);
    }
  }, [user]);

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
      fetchEstudiantes();
    } catch (error) {
      console.error("Error al eliminar estudiante", error);
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar los estudiantes basados en el término de búsqueda
  const filteredEstudiantesold = estudiantes.filter((estudiante) =>
    `${estudiante.Persona?.Primer_Nombre} ${estudiante.Persona?.Primer_Apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const fullText = `
      ${estudiante.Persona?.Identidad || ""} 
      ${estudiante.Persona?.Primer_Nombre || ""} 
      ${estudiante.Persona?.Segundo_Nombre || ""} 
      ${estudiante.Persona?.Primer_Apellido || ""} 
      ${estudiante.Persona?.Segundo_Apellido || ""} 
      ${
        estudiante.Persona?.Sexo === 1
          ? "Masculino"
          : estudiante.Persona?.Sexo === 0
          ? "Femenino"
          : "Sexo no disponible"
      }
      
      ${estudiante.Persona?.Lugar_Nacimiento || ""} 
      ${estudiante.Instituto?.Nombre_Instituto || ""} 
      ${estudiante.Area?.Nombre_Area || ""} 
      ${estudiante.Beneficio?.Nombre_Beneficio || ""} 
      ${estudiante.Persona?.Municipio?.Nombre_Municipio || ""}
          ${
            estudiante.Fecha_Creacion
              ? new Date(estudiante.Fecha_Creacion).toLocaleDateString(
                  "es-ES",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )
              : ""
          }
      ${
        estudiante?.Persona?.Estado === 1
          ? "Activo"
          : estudiante?.Persona?.Estado === 0
          ? "Inactivo"
          : "Estado no disponible"
      }
    `;

    // Convertir todo el texto a minúsculas y buscar el término de búsqueda
    return fullText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Obtener los estudiantes para la página actual
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentEstudiantes = filteredEstudiantes.slice(
    indexOfFirst,
    indexOfLast
  );

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

  // Número total de páginas
  const totalPages = Math.ceil(filteredEstudiantes.length / recordsPerPage);

  // Función para exportar los datos a un archivo de Excel
  const exportToExcelOld = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEstudiantes.map((estudiante) => ({
        Identidad: estudiante.Persona?.Identidad || "N/A",
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
            : "No especificado",
        Lugar_Nacimiento: estudiante.Persona?.Lugar_Nacimiento || "N/A",
        Instituto: estudiante.Instituto?.Nombre_Instituto || "N/A",
        Area: estudiante.Area?.Nombre_Area || "N/A",
        Beneficio: estudiante.Beneficio?.Nombre_Beneficio || "N/A",
        Municipio: estudiante.Persona?.Municipio?.Nombre_Municipio || "N/A",
        Tutor: estudiante.Relaciones
        .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2) // Filtra solo tutores
        .map((relacion) => {
          const identidad = relacion.Persona.Identidad || "No disponible";
          const primerNombre = relacion.Persona.Primer_Nombre || "No disponible";
          const primerApellido = relacion.Persona.Primer_Apellido || "No disponible";
          return `${identidad} - ${primerNombre} ${primerApellido}`; // Concatenar los datos
        })
        .join(', '), // Unir las relaciones de tutores en una sola cadena separada por comas,
        Benefactor: estudiante.Relaciones
        .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3) // Filtra solo tutores
        .map((relacion) => {
          const identidad = relacion.Persona.Identidad || "No disponible";
          const primerNombre = relacion.Persona.Primer_Nombre || "No disponible";
          const primerApellido = relacion.Persona.Primer_Apellido || "No disponible";
          return `${identidad} - ${primerNombre} ${primerApellido}`; // Concatenar los datos
        })
        .join(', '), // Unir las relaciones de tutores en una sola cadena separada por comas,
        

      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

    // Generar y descargar el archivo Excel
    XLSX.writeFile(workbook, "reporte_estudiantes.xlsx");
  };








const exportToExcel = () => {
  const wsData = [
    // Encabezado de la tabla (primera fila)
    [
      "#",
      "Fecha Registro",
      "Beneficio",
      "Area",
      "Identidad",
      "Nombre",
      "Sexo",
      "Año Matricula",
      "Modalidad",
      "Grado",
      "Seccion",
      "Lugar Nacimiento",
      "Instituto",
      "Municipio",
      "Direccion",
      "Telefono",
      "Estado",
      "Tutor Identidad",
      "Tutor Nombre",
      "Benefactor Identidad",
      "Benefactor Nombre",
      "Benefactor Telefono",
      "Benefactor Direccion"
    ],
    // Datos de estudiantes
    ...currentEstudiantes.map((estudiante, index) => [
      index + 1,
      estudiante.Fecha_Creacion
        ? new Date(estudiante.Fecha_Creacion).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Fecha no disponible",
      estudiante.Beneficio?.Nombre_Beneficio || "Beneficio no disponible",
      estudiante.Area?.Nombre_Area || "Área no disponible",
      estudiante.Persona?.Identidad || "Identidad no disponible",
      `${estudiante.Persona?.Primer_Nombre || ""} ${estudiante.Persona?.Segundo_Nombre || ""} ${estudiante.Persona?.Primer_Apellido || ""} ${estudiante.Persona?.Segundo_Apellido || ""}`,
      estudiante.Persona?.Sexo === 1
        ? "Masculino"
        : estudiante.Persona?.Sexo === 0
        ? "Femenino"
        : "Sexo no disponible",
      Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Fecha_Matricula
        ? new Date(estudiante.Matriculas[0]?.Fecha_Matricula).getFullYear()
        : "-",
      Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Modalidad?.Nombre || "-",
      Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Grado?.Nombre || "-",
      Array.isArray(estudiante.Matriculas) && estudiante.Matriculas[0]?.Seccion?.Nombre_Seccion || "-",
      estudiante.Persona?.Lugar_Nacimiento || "Lugar de nacimiento no disponible",
      estudiante.Instituto?.Nombre_Instituto || "Instituto no disponible",
      estudiante.Persona?.Municipio?.Nombre_Municipio || "Municipio no disponible",
      estudiante.Persona?.direccion || "No disponible",
      estudiante.Persona?.telefono || "No disponible",
      estudiante.Persona?.Estado === 1
        ? "Activo"
        : estudiante.Persona?.Estado === 0
        ? "Inactivo"
        : "Estado no disponible",
      estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2
      )
        .map((relacion) => relacion.Persona.Identidad || "No disponible")
        .join(", "),
      estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2
      )
        .map(
          (relacion) =>
            `${relacion.Persona.Primer_Nombre || "No disponible"} ${
              relacion.Persona.Primer_Apellido || "No disponible"
            }`
        )
        .join(", "),
      estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3
      )
        .map((relacion) => relacion.Persona.Identidad || "No disponible")
        .join(", "),
      estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3
      )
        .map(
          (relacion) =>
            `${relacion.Persona.Primer_Nombre || "No disponible"} ${
              relacion.Persona.Primer_Apellido || "No disponible"
            }`
        )
        .join(", "),
      // Benefactor telefono y direccion
      estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3
      )
        .map((relacion) => relacion.Persona?.telefono || "No disponible")
        .join(", "),
      estudiante.Relaciones.filter(
        (relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3
      )
        .map((relacion) => relacion.Persona?.direccion || "No disponible")
        .join(", "),
    ]),
  ];

  // Crear la hoja de trabajo con estilo
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Estilos de encabezado
  const headerStyle = {
    fill: { fgColor: { rgb: "B7D8FF" } },
    font: { bold: true },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    },
  };

  // Aplicar el estilo al encabezado
  for (let i = 0; i < wsData[0].length; i++) {
    const cellAddress = { r: 0, c: i }; // Primera fila (encabezado)
    if (!worksheet[cellAddress]) worksheet[cellAddress] = {}; // Crear la celda si no existe
    worksheet[cellAddress].s = headerStyle; // Asignar estilo
  }

  // Estilo para las celdas de datos
  const dataStyle = {
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    },
  };

  // Aplicar estilo a las celdas de datos
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let row = 1; row <= range.e.r; row++) {
    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = { r: row, c: col };
      if (!worksheet[cellAddress]) worksheet[cellAddress] = {}; // Crear la celda si no existe
      worksheet[cellAddress].s = dataStyle; // Asignar estilo
    }
  }

  // Crear el libro y agregar la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

  // Descargar el archivo Excel
  XLSX.writeFile(workbook, "reporte_estudiantes.xlsx");
};

// Llama a esta función cuando desees exportar los datos
//exportToExcel(currentEstudiantes);


  return (
    <Layout>
      <div className="container mx-auto p-6  min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
          Estudiantes
        </h1>

        {/* Contenedor para la búsqueda y el botón de exportación */}
        <div className="mb-4 flex justify-between items-center">
          {/* Barra de búsqueda */}
          {permisos[1]?.consultar && (
            <div className="flex items-center w-1/2 border border-gray-300 rounded-lg p-3">
              <MagnifyingGlassIcon className="h-6 w-6 mr-1 text-black-500" />
              <input
                type="text"
                placeholder="Buscar estudiante"
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

        {permisos[1]?.consultar ? (
          <table className="xls_style-excel-table">
<thead>
  <tr>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      #
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Fecha Registro
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Beneficio
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Area
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Identidad
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Nombre
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Sexo
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Año Matricula
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Modalidad
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Grado
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Seccion
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Lugar Nacimiento
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Instituto
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Municipio
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Direccion
    </th>
    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Telefono
    </th>

    <th rowSpan="2" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Estado
    </th>

    {/* Subencabezado de Tutor y Benefactor */}
    <th colSpan="4" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Tutor
    </th>
    <th colSpan="4" className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Benefactor
    </th>

    <th rowSpan="2" className="py-4 px-12 bg-blue-200 text-blue-800 font-semibold text-left">
      Acciones
    </th>
  </tr>

  {/* Segunda fila con subcolumnas específicas de Tutor y Benefactor */}
  <tr>
    {/* Subcolumnas Tutor */}
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Identidad
    </th>
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Nombre
    </th>
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Telefono
    </th>
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
    Direccion
    </th>
 

    {/* Subcolumnas Benefactor */}
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Identidad
    </th>
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Nombre
    </th>
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
      Telefono
    </th>
    <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
    Direccion
    </th>

  </tr>
</thead>


            <tbody>
              {currentEstudiantes.map((estudiante,index) => (
                <tr key={estudiante.Id_Estudiante} className="hover:bg-blue-50">
                         <td className="py-4 px-6 border-b">
                         {index + 1}
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
                      : "Fecha no disponible"}
                  </td>
          
                  <td className="py-4 px-6 border-b">
                    {estudiante.Beneficio?.Nombre_Beneficio ||
                      "Beneficio no disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Area?.Nombre_Area || "Área no disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.Identidad || "Identidad no disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {`${estudiante.Persona?.Primer_Nombre || ""} ${
                      estudiante.Persona?.Segundo_Nombre || ""
                    } ${estudiante.Persona?.Primer_Apellido || ""} ${
                      estudiante.Persona?.Segundo_Apellido || ""
                    }`}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.Sexo === 1
                      ? "Masculino"
                      : estudiante.Persona?.Sexo === 0
                      ? "Femenino"
                      : "Sexo no disponible"}
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
                      "Lugar de nacimiento no disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Instituto?.Nombre_Instituto ||
                      "Instituto no disponible"}
                  </td>
              
                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.Municipio?.Nombre_Municipio ||
                      "Municipio no disponible"}
                  </td>

                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.telefono ||
                      "No disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.direccion ||
                      "No disponible"}
                  </td>
            
                  <td className="py-4 px-6 border-b">
                    <strong>
                      {estudiante?.Persona?.Estado === 1
                        ? "Activo"
                        : estudiante?.Persona?.Estado === 0
                        ? "Inactivo"
                        : "Estado no disponible"}
                    </strong>
                  </td>

                  <td className="py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2) 
                   .map(relacion => {

                  const identidad = relacion.Persona.Identidad || 'No disponible';
   

                  return `
                  ${identidad}
                    
                  `;
                }).join('')}
              </ul>
                  </td>
                  <td className="py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 2) 
                   .map(relacion => {
            
                  const primerNombre = relacion.Persona.Primer_Nombre || 'No disponible';
                  const primerApellido = relacion.Persona.Primer_Apellido || 'No disponible';


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
            
                  const telefono = relacion.Persona.telefono || 'No disponible';
          


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
            
                  const direccion = relacion.Persona.direccion || 'No disponible';
          


                  return `
                 ${direccion} 
                    
                  `;
                }).join('')}
              </ul>
                  </td>
    
                  
                  <td className="py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3) 
                   .map(relacion => {
    
                  const identidad = relacion.Persona.Identidad || 'No disponible';
         

                  return `
                  ${identidad}
                    
                  `;
                }).join('')}
              </ul>
                  </td>
              
                  
                  <td className="py-4 px-6 border-b">
                  <ul>
                   {estudiante.Relaciones
                    .filter((relacion) => relacion.TipoPersona?.Id_Tipo_Persona === 3) 
                   .map(relacion => {

                  const primerNombre = relacion.Persona.Primer_Nombre || 'No disponible';
                  const primerApellido = relacion.Persona.Primer_Apellido || 'No disponible';
       

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
            
                  const telefono = relacion.Persona.telefono || 'No disponible';
          


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
            
                  const direccion = relacion.Persona.direccion || 'No disponible';
          


                  return `
                 ${direccion} 
                    
                  `;
                }).join('')}
              </ul>
                  </td>
                  
                  <td className="py-4 px-6 border-b">
                    <div className="flex gap-2">

                      {permisos[1]?.eliminar && (
                        <button
                          onClick={() => handleDelete(estudiante.Id_Estudiante)}
                          className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                          <TrashIcon className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          {/* Botón "Anterior" */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-white-600 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
          >
            Anterior
          </button>

          {/* Páginas */}
          <div className="flex space-x-2">
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
          </div>

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
    </Layout>
  );
};

export default EstudiantesReporte;
