import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { ShieldExclamationIcon,PencilSquareIcon,TrashIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validarFormulario } from '../../utils/validaciones';
import { reglasValidacionArea } from '../../../models/ReglasValidacionModelos';
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from '../../hooks/useModal';
import SearchBar from '../../components/basicos/SearchBar';
import Pagination from '../../components/basicos/Pagination';
import ModalGenerico from '../../utils/ModalGenerico';
import { obtenerEstados } from '../../utils/api';
import { exportToExcel } from '../../utils/exportToExcel';
import { deepSearch } from '../../utils/deepSearch';
const AreaManagement = () => {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const { modals, showModal, closeModal } = useModal();

  const [areas, setAreas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    Id_Area: '',
    Nombre_Area: '',
    Tipo_Area: '',
    Responsable_Area: '',
    Estado: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);



  const filteredAreas = areas.filter((area) =>
    deepSearch(area, searchQuery, 0, 3)
  );
  
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAreas = filteredAreas.slice(indexOfFirst, indexOfLast);

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados('GENÉRICO');
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto: 6,
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

  const fetchAreas = async () => {
    const res = await axios.get('/api/apis_mantenimientos/area');
    setAreas(res.data);
  };

  useEffect(() => {
    cargarEstados();
    fetchAreas();
    fetchPermisos();
  }, [user]);

  const resetForm = () => {
    setFormData({
      Id_Area: '',
      Nombre_Area: '',
      Tipo_Area: '',
      Responsable_Area: '',
      Estado: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      Creado_Por: user.id,
      Modificado_Por: user.id,
      Fecha_Creacion: new Date().toISOString().split('T')[0],
      Fecha_Modificacion: new Date().toISOString().split('T')[0]
    };

    const errores = validarFormulario(payload, reglasValidacionArea);
    if (errores.length > 0) return;

    try {
      const res = await fetch('/api/apis_mantenimientos/area', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar');

      toast.success(`Área ${isEditing ? 'actualizada' : 'agregada'} exitosamente`);
      fetchAreas();
      resetForm();
      closeModal("modalAddArea");
    } catch (error) {
      toast.error('Error al guardar el área');
    }
  };

  const handleEdit = (area) => {
    setFormData(area);
    setIsEditing(true);
    showModal("modalAddArea");
  };

  const handleDelete = async (Id_Area) => {
    await axios.delete('/api/apis_mantenimientos/area', { data: { Id_Area } });
    toast.error("Área eliminada exitosamente");
    fetchAreas();
    resetForm();
    closeModal("modalConfirmacion");
  };

  const handleExport = async () => {
    const headers = [
   //   { header: "ID", key: "ID", width: 10 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Fecha de Creación", key: "Fecha_Creacion", width: 20 },
      { header: "Tipo", key: "Tipo", width: 20 },
      { header: "Responsable", key: "Responsable", width: 30 },
      { header: "Estado", key: "Estado", width: 15 },
    ];
    const data = filteredAreas.map((a) => ({
      ID: a.Id_Area,
      Nombre: a.Nombre_Area,
      Fecha_Creacion: a.Fecha_Creacion ? new Date(a.Fecha_Creacion).toLocaleDateString("es-ES") : "Fecha no disponible",
      Tipo: a.Tipo_Area,
      Responsable: a.Responsable_Area,
      Estado: estados.find(e => e.Codigo_Estado === a.Estado)?.Nombre_Estado || "Desconocido",
    }));
    await exportToExcel({
      fileName: "Areas.xlsx",
      title: "Reporte de Áreas",
      headers,
      data,
      searchQuery,
    });
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos)
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a Áreas</h3>
          <p>No tienes permisos para esta pantalla.</p>
        </div>
      </div>
    );

  return (
    <div>
      <SearchBar
        title="Listado de Áreas"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={() => setSearchQuery({ general: '' })}
        onAdd={() => {
          resetForm();
          showModal("modalAddArea");
        }}
        onExport={handleExport}
      />

      <ModalGenerico
        id="modalAddArea"
        isOpen={modals["modalAddArea"]}
        onClose={() => closeModal("modalAddArea")}
        titulo={isEditing ? "Editar Área" : "Agregar Área"}
      >
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input name="Nombre_Area" value={formData.Nombre_Area} onChange={handleInputChange} className="mb-4 p-3 w-full border rounded" required />

          <label>Tipo:</label>
          <input name="Tipo_Area" value={formData.Tipo_Area} onChange={handleInputChange} className="mb-4 p-3 w-full border rounded" required />

          <label>Responsable:</label>
          <input name="Responsable_Area" value={formData.Responsable_Area} onChange={handleInputChange} className="mb-4 p-3 w-full border rounded" required />

          <label>Estado:</label>
          <select name="Estado" value={formData.Estado || ''} onChange={handleInputChange} className="mb-4 p-3 w-full border rounded" required>
            <option value="">Seleccione un estado</option>
            {estados.map((estado) => (
              <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
                {estado.Nombre_Estado}
              </option>
            ))}
          </select>

          <div className="flex justify-end">
            {permisos?.Permiso_Actualizar === "1" && isEditing && <button type="submit" className="btn-guardar">Actualizar</button>}
            {permisos?.Permiso_Insertar === "1" && !isEditing && <button type="submit" className="btn-guardar">Agregar</button>}
            <button type="button" onClick={resetForm} className="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals["modalConfirmacion"]}
        onClose={() => closeModal("modalConfirmacion")}
        onConfirm={() => handleDelete(formData.Id_Area)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar el área?"
        entidad={formData.Nombre_Area}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

<table className="xls_style-excel-table">
  <thead className="bg-slate-200">
    <tr>
      <th>#</th> {/* Número de Registro */}
      <th>Acciones</th> {/* Botones de Acción */}
      {/* <th>ID</th> ID del Área */}
      <th>Nombre</th> {/* Nombre del Área */}
      <th>Fecha de Creación</th> {/* Fecha de Creación */}
      <th>Tipo</th> {/* Tipo del Área */}
      <th>Responsable</th> {/* Responsable del Área */}
      <th>Estado</th> {/* Estado del Área */}
    </tr>
  </thead>
  {permisos?.Permiso_Consultar === "1" && (
    <tbody>
      {currentAreas.map((a, index) => {
        const estadoDescripcion =
          estados.find((estado) => estado.Codigo_Estado === a.Estado)?.Nombre_Estado || "Desconocido";

        const fechaCreacion = a.Fecha_Creacion || "Fecha no disponible"; // Si no trae la fecha, coloca un valor por defecto

        return (
          <tr key={a.Id_Area} className="border-b hover:bg-gray-100 transition duration-300">
            {/* # */}
            <td>{index + 1}</td> {/* Número de Registro */}

            {/* Acciones */}
            <td>
              <div className="flex justify-center gap-2">
                {permisos.Permiso_Actualizar === "1" && (
                  <button
                    onClick={() => handleEdit(a)}
                    className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                )}
                {permisos.Permiso_Eliminar === "1" && (
                  <button
                    onClick={() => {
                      setFormData(a);
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
            {/* <td>{a.Id_Area}</td> ID del Área */}

            {/* Nombre */}
            <td>{a.Nombre_Area}</td> {/* Nombre del Área */}

            {/* Fecha de Creación */}
            <td>{fechaCreacion}</td> {/* Fecha de Creación */}

            {/* Tipo */}
            <td>{a.Tipo_Area}</td> {/* Tipo del Área */}

            {/* Responsable */}
            <td>{a.Responsable_Area}</td> {/* Responsable del Área */}

            {/* Estado */}
            <td>{estadoDescripcion}</td> {/* Estado del Área */}
          </tr>
        );
      })}
    </tbody>
  )}
</table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredAreas.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextPage={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredAreas.length / itemsPerPage))
          )
        }
      />
    </div>
  );
};

export default AreaManagement;