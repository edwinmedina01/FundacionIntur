import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchBar from "../components/basicos/SearchBar";
import Pagination from "../components/basicos/Pagination";
import useModal from "../hooks/useModal";
import ModalGenerico from "../utils/ModalGenerico";
import ModalConfirmacion from "../utils/ModalConfirmacion";
import { validarFormulario } from "../utils/validaciones";
import { reglasValidacionConfiguracion } from "../../models/ReglasValidacionModelos";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { exportToExcel } from "../utils/exportToExcel";
import { deepSearch } from "../utils/deepSearch";

const ConfiguracionManagement = () => {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const { modals, showModal, closeModal } = useModal();

  const [configuraciones, setConfiguraciones] = useState([]);
  const [formData, setFormData] = useState({
    Id_Configuracion: "",
    Clave: "",
    Valor: "",
    Descripcion: "",
    Creado_Por: "",
    Fecha_Creacion: "",
    Modificado_Por: "",
    Fecha_Modificacion: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredConfiguraciones = configuraciones.filter((c) => deepSearch(c, searchQuery));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredConfiguraciones.slice(indexOfFirst, indexOfLast);

  const handleClearSearch = () => {
    setSearchQuery({ general: "" });
    setCurrentPage(1);
  };

  const fetchConfiguraciones = async () => {
    try {
      const res = await axios.get("/api/configuracion");
      setConfiguraciones(res.data);
    } catch (error) {
      toast.error("Error al obtener configuraciones");
    }
  };

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post("/api/api_permiso", {
          idRol: user.rol,
          idObjeto: 2,
        });
        const permisosData = res.data;
        if (
          permisosData.Permiso_Insertar !== "1" &&
          permisosData.Permiso_Actualizar !== "1" &&
          permisosData.Permiso_Eliminar !== "1" &&
          permisosData.Permiso_Consultar !== "1"
        ) {
          setSinPermisos(true);
        } else {
          setPermisos(permisosData);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al obtener permisos");
    }
  };

  useEffect(() => {
    fetchConfiguraciones();
    fetchPermisos();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.Creado_Por = user.id;
    formData.Modificado_Por = user.id;
    const errores = validarFormulario(formData, reglasValidacionConfiguracion);
    if (errores.length > 0) return;

    try {
      const response = isEditing
        ? await axios.put("/api/configuracion", formData)
        : await axios.post("/api/configuracion", formData);

      toast.success(`Configuración ${isEditing ? "actualizada" : "agregada"} exitosamente`);
      fetchConfiguraciones();
      closeModal("modalAddConfiguracion");
      resetForm();
    } catch (error) {
      toast.error("Error: " + error.response?.data?.message);
    }
  };

  const handleEdit = (config) => {
    setFormData(config);
    setIsEditing(true);
    showModal("modalAddConfiguracion");
  };

  const handleDelete = async (Id_Configuracion) => {
    try {
      await axios.delete("/api/configuracion", {
        data: { Id_Configuracion,Modificado_Por:user.id  },
      });
      toast.error("Configuración eliminada exitosamente");
      fetchConfiguraciones();
      closeModal("modalConfirmacion");
    } catch (error) {
      toast.error("Error al eliminar configuración");
    }
  };

  const handleExport = async () => {
    const headers = [
      { header: "Clave", key: "Clave", width: 30 },
      { header: "Valor", key: "Valor", width: 40 },
      { header: "Descripción", key: "Descripcion", width: 50 },
    ];

    const data = filteredConfiguraciones.map((item) => ({
      Clave: item.Clave,
      Valor: item.Valor,
      Descripcion: item.Descripcion,
    }));

    await exportToExcel({
      fileName: "Configuraciones.xlsx",
      title: "Reporte de Configuraciones",
      headers,
      data,
      searchQuery,
    });
  };

  const resetForm = () => {
    setFormData({
      Id_Configuracion: "",
      Clave: "",
      Valor: "",
      Descripcion: "",
      Creado_Por: "",
      Fecha_Creacion: "",
      Modificado_Por: "",
      Fecha_Modificacion: "",
    });
    setIsEditing(false);
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos)
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a la pantalla</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div>
      <SearchBar
        title="Listado de Configuraciones"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        onAdd={() => {
          resetForm();
          showModal("modalAddConfiguracion");
        }}
        onExport={handleExport}
      />

      <ModalConfirmacion
        isOpen={modals["modalConfirmacion"]}
        onClose={() => closeModal("modalConfirmacion")}
        onConfirm={() => handleDelete(formData?.Id_Configuracion)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar la configuración?"
        entidad={formData?.Clave}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      <table className="xls_style-excel-table">
        <thead className="bg-slate-200">
          <tr>
            <th>Clave</th>
            <th>Valor</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.Id_Configuracion} className="border-b hover:bg-gray-100">
              <td>{item.Clave}</td>
              <td>{item.Valor}</td>
              <td>{item.Descripcion}</td>
              <td className="flex justify-center gap-2">
                {permisos.Permiso_Actualizar === "1" && (
                  <button onClick={() => handleEdit(item)} className="btn-editar">Editar</button>
                )}
                {permisos.Permiso_Eliminar === "1" && (
                  <button
                    onClick={() => {
                      setFormData(item);
                      showModal("modalConfirmacion");
                    }}
                    className="btn-eliminar"
                  >
                    X
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredConfiguraciones.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextPage={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredConfiguraciones.length / itemsPerPage))
          )
        }
      />

      <ModalGenerico
        id="modalAddConfiguracion"
        isOpen={modals["modalAddConfiguracion"]}
        onClose={() => closeModal("modalAddConfiguracion")}
        titulo={isEditing ? "Editar Configuración" : "Agregar Configuración"}
      >
       <form onSubmit={handleSubmit}>
  {/* Clave */}
  <label htmlFor="Clave" className="block mb-2 text-sm font-medium text-gray-700">
    Clave
  </label>
  <input
    type="text"
    name="Clave"
    id="Clave"
    value={formData.Clave}
    onChange={handleInputChange}
    required
    className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Valor */}
  <label htmlFor="Valor" className="block mb-2 text-sm font-medium text-gray-700">
    Valor
  </label>
  <input
    type="text"
    name="Valor"
    id="Valor"
    value={formData.Valor}
    onChange={handleInputChange}
    required
    className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Descripción */}
  <label htmlFor="Descripcion" className="block mb-2 text-sm font-medium text-gray-700">
    Descripción
  </label>
  <input
    type="text"
    name="Descripcion"
    id="Descripcion"
    value={formData.Descripcion}
    onChange={handleInputChange}
    className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Botones */}
  <div className="flex justify-end">
    {isEditing ? (
      permisos.Permiso_Actualizar === "1" && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Actualizar
        </button>
      )
    ) : (
      permisos.Permiso_Insertar === "1" && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Agregar
        </button>
      )
    )}

    <button
      type="button"
      onClick={() => {
        resetForm();
        closeModal("modalAddConfiguracion");
      }}
      className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Cancelar
    </button>
  </div>
</form>

      </ModalGenerico>
    </div>
  );
};

export default ConfiguracionManagement;