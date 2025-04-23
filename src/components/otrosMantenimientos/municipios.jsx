import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

import { ShieldExclamationIcon,PencilSquareIcon , TrashIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from "../../components/basicos/SearchBar";
import Pagination from "../../components/basicos/Pagination";
import { validarFormulario } from "../../utils/validaciones";
import { reglasValidacionMunicipio } from "../../../models/ReglasValidacionModelos";
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import ModalGenerico from '../../utils/ModalGenerico';
import useModal from "../../hooks/useModal";
import { obtenerEstados } from "../../utils/api";
import { exportToExcel } from "../../utils/exportToExcel";
import { deepSearch } from "../../utils/deepSearch";

const MunicipioManagement = () => {
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const { modals, showModal, closeModal } = useModal();
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);

  const [formData, setFormData] = useState({
    Id_Municipio: '',
    Id_Departamento: '',
    Nombre_Municipio: '',
    Estado: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);


const filteredMunicipios = municipios.filter((m) => deepSearch(m, searchQuery));


  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMunicipios = filteredMunicipios.slice(indexOfFirst, indexOfLast);

  const handleClearSearch = () => {
    setSearchQuery({ general: '' });
    setCurrentPage(1);
  };

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto: 12,
        });
        const permisosData = res.data;
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

  const fetchMunicipios = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/municipios');
      setMunicipios(response.data);
    } catch (err) {
      toast.error("Error al cargar municipios");
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('/api/departamentos');
      setDepartamentos(response.data);
    } catch (err) {
      toast.error("Error al cargar departamentos");
    }
  };

  useEffect(() => {
    cargarEstados();
    fetchMunicipios();
    fetchDepartamentos();
    fetchPermisos();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const obtenerFechaActual = () => new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      Creado_Por: user.id,
      Modificado_Por: user.id,
      Fecha_Creacion: obtenerFechaActual(),
      Fecha_Modificacion: obtenerFechaActual(),
      Estado: Number(formData.Estado)
    };
    const errores = validarFormulario(payload, reglasValidacionMunicipio);
    if (errores.length > 0) return;
    try {
      const res = await fetch('/api/apis_mantenimientos/municipios', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(`Municipio ${isEditing ? 'actualizado' : 'agregado'} exitosamente`);
      fetchMunicipios();
      resetForm();
      closeModal("modalAddMunicipio");
    } catch {
      toast.error("Error al guardar municipio");
    }
  };

  const handleEdit = (m) => {
   
    setFormData({
      ...m,
      Estado: m.Estado?.toString() || "", // <- Asegura que sea string
    });
    setIsEditing(true);
    showModal("modalAddMunicipio");
  };

  const handleDelete = async (Id_Municipio) => {
    try {
      await axios.delete('/api/apis_mantenimientos/municipios', {
        data: { Id_Municipio ,Modificado_Por: user.id },
      });
      fetchMunicipios();
      resetForm();
      toast.error("Municipio eliminado exitosamente");
      closeModal("modalConfirmacion");
    } catch {
      toast.error("Error al eliminar municipio");
    }
  };

  const resetForm = () => {
    setFormData({ Id_Municipio: '', Id_Departamento: '', Nombre_Municipio: '', Estado: '' });
    setIsEditing(false);
  };

  const handleExport = async () => {
    const headers = [
      // { header: "ID", key: "ID", width: 10 },
      { header: "Departamento", key: "Departamento", width: 25 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Fecha de Creación", key: "Fecha_Creacion", width: 20 },
      { header: "Estado", key: "Estado", width: 15 },
    ];
    const data = filteredMunicipios.map((m) => ({
      ID: m.Id_Municipio,
      Departamento: m.Nombre_Departamento,
      Nombre: m.Nombre_Municipio,
      Fecha_Creacion: m.Fecha_Creacion || "Fecha no disponible",
      Estado: m.Estado === 1 ? "Activo" : "Inactivo",
    }));
    await exportToExcel({ fileName: 'Municipios.xlsx', title: 'Reporte de Municipios', headers, data, searchQuery });
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos)
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a Municipios</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );

  return (
    <div>
      <SearchBar
        title="Listado de Municipios"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        onAdd={() => { resetForm(); showModal("modalAddMunicipio") }}
        onExport={handleExport}
      />

      <ModalGenerico
        id="modalAddMunicipio"
        isOpen={modals.modalAddMunicipio}
        onClose={() => { resetForm(); closeModal("modalAddMunicipio") }}
        titulo={isEditing ? "Editar Municipio" : "Agregar Municipio"}
      >
        <form onSubmit={handleSubmit}>
          <label>Departamento</label>
          <select
            name="Id_Departamento"
            value={formData.Id_Departamento}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar Departamento</option>
            {departamentos.map((d) => (
              <option key={d.Id_Departamento} value={d.Id_Departamento}>{d.Nombre_Departamento}</option>
            ))}
          </select>

          <label>Nombre del Municipio</label>
          <input
            type="text"
            name="Nombre_Municipio"
            value={formData.Nombre_Municipio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label>Estado</label>
          <select
            name="Estado"
            value={formData.Estado || ""}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un estado</option>
            {estados.map((e) => (
              <option key={e.Codigo_Estado} value={e.Codigo_Estado}>{e.Nombre_Estado}</option>
            ))}
          </select>

          <div className="flex justify-end">
            {isEditing && permisos?.Permiso_Actualizar === "1" && (
              <button type="submit" className="btn-guardar">Actualizar</button>
            )}
            {!isEditing && permisos?.Permiso_Insertar === "1" && (
              <button type="submit" className="btn-guardar">Agregar</button>
            )}
            <button
              type="button"
              onClick={() => { resetForm(); closeModal("modalAddMunicipio") }}
              className="btn-cancelar"
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals["modalConfirmacion"]}
        onClose={() => closeModal("modalConfirmacion")}
        onConfirm={() => handleDelete(formData?.Id_Municipio)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar a"
        entidad={formData?.Nombre_Municipio}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

<table className="xls_style-excel-table">
  <thead className="bg-slate-200">
    <tr>
      <th>#</th> {/* Número de Registro */}
      <th>Acciones</th> {/* Botones de Acción */}
      {/* <th>ID</th> ID del Municipio */}

      <th>Municipio</th> {/* Nombre del Municipio */}
      <th>Fecha de Creación</th> {/* Fecha de Creación */}
      <th>Departamento</th> {/* Nombre del Departamento */}
      <th>Estado</th> {/* Estado del Municipio */}
    </tr>
  </thead>
  {permisos?.Permiso_Consultar === "1" && (
    <tbody>
      {currentMunicipios.map((m, index) => {
        const estadoDescripcion = estados.find((estado) => estado.Codigo_Estado === m.Estado)?.Nombre_Estado || "Desconocido";
        const fechaCreacion = m.Fecha_Creacion || "Fecha no disponible"; // Si no trae la fecha, coloca un valor por defecto

        return (
          <tr key={m.Id_Municipio} className="border-b hover:bg-gray-100 transition duration-300">
            {/* # */}
            <td>{index + 1}</td> {/* Número de Registro */}

            {/* Acciones */}
            <td>
              <div className="flex justify-center gap-2">
                {permisos.Permiso_Actualizar === "1" && (
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                )}
                {permisos.Permiso_Eliminar === "1" && (
                  <button
                    onClick={() => {
                      setFormData(m);
                      showModal("modalConfirmacion");
                    }}
                    className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </td>

            {/* ID */}
            {/* <td>{m.Id_Municipio}</td> ID del Municipio */}

            {/* Departamento */}
         

            {/* Municipio */}
            <td>{m.Nombre_Municipio}</td> {/* Nombre del Municipio */}
          

            {/* Fecha de Creación */}
            <td>{fechaCreacion}</td> {/* Fecha de Creación */}
            <td>{m.Nombre_Departamento}</td> {/* Nombre del Departamento */}

            {/* Estado */}
            <td>{estadoDescripcion}</td> {/* Estado del Municipio */}
          </tr>
        );
      })}
    </tbody>
  )}
</table>


      <Pagination
        currentPage={currentPage}
        totalItems={filteredMunicipios.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        nextPage={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredMunicipios.length / itemsPerPage)))}
      />
    </div>
  );
};

export default MunicipioManagement;
