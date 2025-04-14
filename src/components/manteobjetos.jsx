import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchBar from "../components/basicos/SearchBar";
import Pagination from "../components/basicos/Pagination";
import useModal from "../hooks/useModal";
import ModalGenerico from "../utils/ModalGenerico";
import ModalConfirmacion from "../utils/ModalConfirmacion";
import { validarFormulario } from "../utils/validaciones";
import { reglasValidacion } from "../../models/ObjetoDto";
import { exportToExcel } from "../utils/exportToExcel";
import { deepSearch } from "../utils/deepSearch";

const ManejoObjetos = () => {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);

  const { modals, showModal, closeModal } = useModal();

  const [objetos, setObjetos] = useState([]);
  const [formData, setFormData] = useState({
    Id_Objeto: "",
    Objeto: "",
    Descripcion: "",
    Tipo_Objeto: "",
    Estado: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredObjetos = objetos.filter((obj) => deepSearch(obj, searchQuery));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentObjetos = filteredObjetos.slice(indexOfFirst, indexOfLast);

  const handleClearSearch = () => {
    setSearchQuery({ general: "" });
    setCurrentPage(1);
  };

  const fetchObjetos = async () => {
    try {
      const res = await axios.get("/api/objetos");
      setObjetos(res.data);
    } catch (error) {
      toast.error("Error al obtener los objetos");
    }
  };

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post("/api/api_permiso", {
          idRol: user.rol,
          idObjeto: 3,
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
    fetchObjetos();
    fetchPermisos();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarFormulario(formData, reglasValidacion);
    if (errores.length > 0) return;

    try {
      const response = isEditing
        ? await axios.put("/api/objetos", formData)
        : await axios.post("/api/objetos", formData);

      toast.success(`Objeto ${isEditing ? "actualizado" : "agregado"} exitosamente`);
      fetchObjetos();
      closeModal("modalAddObjeto");
      resetForm();
    } catch (error) {
      toast.error("Error: " + error.response?.data?.message);
    }
  };

  const handleEdit = (objeto,edit) => {
    setFormData(objeto);
    setIsEditing(true);
    if (edit){
      showModal("modalAddObjeto");
    }
  
  };

  const handleDelete = async (Id_Objeto) => {
    try {
      await axios.delete("/api/objetos", {
        data: { Id_Objeto },
      });
      toast.error("Objeto eliminado exitosamente");
      fetchObjetos();
      closeModal("modalConfirmacion");
    } catch (error) {
      toast.error("Error al eliminar el objeto");
    }
  };

  const handleExport = async () => {
    const headers = [
      // { header: "ID", key: "Id_Objeto", width: 10 },
      { header: "Nombre", key: "Objeto", width: 30 },
      { header: "Descripción", key: "Descripcion", width: 40 },
      { header: "Tipo", key: "Tipo_Objeto", width: 20 },
      { header: "Estado", key: "Estado", width: 15 },
    ];

    const data = filteredObjetos.map((obj) => ({
      // Id_Objeto: obj.Id_Objeto,
      Objeto: obj.Objeto,
      Descripcion: obj.Descripcion,
      Tipo_Objeto: obj.Tipo_Objeto,
      Estado: obj.Estado === "1" ? "Activo" : "Inactivo",
    }));

    await exportToExcel({
      fileName: "Objetos.xlsx",
      title: "Reporte de Objetos",
      headers,
      data,
      searchQuery,
    });
  };

  const resetForm = () => {
    setFormData({
      Id_Objeto: "",
      Objeto: "",
      Descripcion: "",
      Tipo_Objeto: "",
      Estado: "",
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
          <h3 className="font-bold text-lg">
            Sin permisos para Acceder a la Pantalla de Objetos
          </h3>
          <p>No tienes permisos para Acceder a la información.</p>
        </div>
      </div>
    );
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div>
      <SearchBar
        title="Listado de Objetos"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        onAdd={() => {
          resetForm();
          showModal("modalAddObjeto");
        }}
        onExport={handleExport}
      />

      <ModalConfirmacion
        isOpen={modals["modalConfirmacion"]}
        onClose={() => closeModal("modalConfirmacion")}
        onConfirm={() => handleDelete(formData?.Id_Objeto)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar a"
        entidad={formData?.Objeto}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

<table className="xls_style-excel-table">
          <thead className="bg-slate-200">
            <tr>
              <th className="">#</th>
              <th className="">Nombre</th>
              <th className="">Descripción</th>
              <th className="">Tipo</th>
              <th className="">Estado</th>
              <th className="">Acciones</th>
            </tr>
          </thead>
          {permisos?.Permiso_Consultar === "1" && (
          <tbody>
            {currentObjetos.map((objeto,index) => (
              <tr key={objeto.Id_Objeto} className="border-b hover:bg-gray-100">
                <td className="py-4 px-6">{index+1}</td>
                <td className="py-4 px-6">
                  <strong>{objeto.Objeto}</strong>
                </td>
                <td className="py-4 px-6">{objeto.Descripcion}</td>
                <td className="py-4 px-6">{objeto.Tipo_Objeto}</td>
                <td className="py-4 px-6">
                  {objeto.Estado === 1 ? "Activo" : "Inactivo"}
                </td>
                <td className="py-4 px-6 flex justify-center space-x-2">
                {/*Agregar la condicional para verificar si tiene permiso*/}
                  {permisos.Permiso_Actualizar === "1" && (
                    <button
                    onClick={() => {
                      handleEdit(objeto,true);
                      showModal("modalAddObjeto")
                    }}
                    
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  )}
                   {/*Agregar la condicional para verificar si tiene permiso*/}
                  {permisos.Permiso_Eliminar === "1" && (
                    <button
                    onClick={() => {
                      handleEdit(objeto);
                      showModal("modalConfirmacion");
                    }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      X
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>)}
        </table>
      <Pagination
        currentPage={currentPage}
        totalItems={filteredObjetos.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextPage={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredObjetos.length / itemsPerPage))
          )
        }
      />

      <ModalGenerico
        id="modalAddObjeto"
        isOpen={modals["modalAddObjeto"]}
        onClose={() => closeModal("modalAddObjeto")}
        titulo={isEditing ? "Editar Objeto" : "Agregar Objeto"}
      >
     <form onSubmit={handleSubmit}>
          {/* Input de Objeto */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Objeto
          </label>
          <input
            type="text"
            name="Objeto"
            value={formData.Objeto}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg uppercase"
          />

          {/* Input de Descripción */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Descripción
          </label>
          <input
            type="text"
            name="Descripcion"
            value={formData.Descripcion}
            required
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          />

          {/* Input de Tipo de Objeto */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tipo de Objeto
          </label>
          <input
            type="text"
            name="Tipo_Objeto"
            required
            value={formData.Tipo_Objeto}
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          />

          {/* Estado */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            name="Estado"
            value={formData.Estado}
            required
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          >
            <option value="">Selecciona Estado</option>
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>

          <div className="flex justify-end">
            {isEditing
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
              onClick={() => {
                resetForm();
                closeModal("modalAddObjeto");
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

export default ManejoObjetos;
