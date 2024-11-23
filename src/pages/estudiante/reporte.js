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
  const exportToExcel = () => {
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
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

    // Generar y descargar el archivo Excel
    XLSX.writeFile(workbook, "reporte_estudiantes.xlsx");
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
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
          <table className="min-w-full bg-white shadow-lg rounded-lg mb-6">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Identidad
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Nombre
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Sexo
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Lugar Nacimiento
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Instituto
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Area
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Beneficio
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Municipio
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Fecha Registro
                </th>
                <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">
                  Estado
                </th>
                <th className="py-4 px-12 bg-blue-200 text-blue-800 font-semibold text-left">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEstudiantes.map((estudiante) => (
                <tr key={estudiante.Id_Estudiante} className="hover:bg-blue-50">
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
                    {estudiante.Persona?.Lugar_Nacimiento ||
                      "Lugar de nacimiento no disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Instituto?.Nombre_Instituto ||
                      "Instituto no disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Area?.Nombre_Area || "Área no disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Beneficio?.Nombre_Beneficio ||
                      "Beneficio no disponible"}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {estudiante.Persona?.Municipio?.Nombre_Municipio ||
                      "Municipio no disponible"}
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
                    <strong>
                      {estudiante?.Persona?.Estado === 1
                        ? "Activo"
                        : estudiante?.Persona?.Estado === 0
                        ? "Inactivo"
                        : "Estado no disponible"}
                    </strong>
                  </td>
                  <td className="py-4 px-6 border-b">
                    <div className="flex gap-2">
                      {permisos[1]?.actualizar && (
                        <Link href={`/estudiante/${estudiante.Id_Estudiante}`}>
                          <button className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition-colors">
                          <PencilSquareIcon className="h-6 w-6" />
                          </button>
                        </Link>
                      )}

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
