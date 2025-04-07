import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { ShieldExclamationIcon,PencilSquareIcon ,TrashIcon  } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { validarFormulario } from '../../utils/validaciones';
import { reglasValidacionInstituto } from '../../../models/ReglasValidacionModelos';
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from '../../hooks/useModal';
import SearchBar from '../../components/basicos/SearchBar';
import Pagination from '../../components/basicos/Pagination';
import ModalGenerico from '../../utils/ModalGenerico';
import { exportToExcel } from '../../utils/exportToExcel';
import { obtenerEstados } from '../../utils/api';

const InstitucionManagement = () => {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const { modals, showModal, closeModal } = useModal();

  const [instituciones, setInstituciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    Id_Instituto: '',
    Nombre_Instituto: '',
    Direccion: '',
    Telefono: '',
    Correo: '',
    Director: '',
    Estado: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredInstituciones = instituciones.filter((inst) =>
    inst.Nombre_Instituto.toLowerCase().includes(searchQuery.general.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentInstituciones = filteredInstituciones.slice(indexOfFirst, indexOfLast);

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto: 9
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

  const fetchInstituciones = async () => {
    const res = await axios.get('/api/apis_mantenimientos/instituciones');
    setInstituciones(res.data);
  };

  useEffect(() => {
    cargarEstados();
    fetchInstituciones();
    fetchPermisos();
  }, [user]);

  const resetForm = () => {
    setFormData({
      Id_Instituto: '',
      Nombre_Instituto: '',
      Direccion: '',
      Telefono: '',
      Correo: '',
      Director: '',
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

    const errores = validarFormulario(payload, reglasValidacionInstituto);
    if (errores.length > 0) return;

    try {
      const res = await fetch('/api/apis_mantenimientos/instituciones', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar institución');

      toast.success(`Institución ${isEditing ? 'actualizada' : 'agregada'} exitosamente`);
      fetchInstituciones();
      resetForm();
      closeModal("modalAddInstitucion");
    } catch (error) {
      toast.error("Error al guardar la institución");
    }
  };

  const handleEdit = (instituto) => {
    setFormData(instituto);
    setIsEditing(true);
    showModal("modalAddInstitucion");
  };

  const handleDelete = async (Id_Instituto) => {
    await axios.delete('/api/apis_mantenimientos/instituciones', { data: { Id_Instituto } });
    toast.error("Institución eliminada exitosamente");
    fetchInstituciones();
    resetForm();
    closeModal("modalConfirmacion");
  };

  const handleExport = async () => {
    const headers = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Dirección", key: "Direccion", width: 40 },
      { header: "Teléfono", key: "Telefono", width: 15 },
      { header: "Correo", key: "Correo", width: 30 },
      { header: "Director", key: "Director", width: 25 },
    ];

    const data = currentInstituciones.map((i) => ({
      ID: i.Id_Instituto,
      Nombre: i.Nombre_Instituto,
      Direccion: i.Direccion,
      Telefono: i.Telefono,
      Correo: i.Correo,
      Director: i.Director
    }));

    await exportToExcel({
      fileName: "Instituciones.xlsx",
      title: "Reporte de Instituciones",
      headers,
      data,
      searchQuery
    });
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos)
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a Instituciones</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div>
      <SearchBar
        title="Listado de Instituciones"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={() => setSearchQuery({ general: '' })}
        onAdd={() => {
          resetForm();
          showModal("modalAddInstitucion");
        }}
        onExport={handleExport}
      />

      <ModalGenerico
        id="modalAddInstitucion"
        isOpen={modals["modalAddInstitucion"]}
        onClose={() => closeModal("modalAddInstitucion")}
        titulo={isEditing ? "Editar Institución" : "Agregar Institución"}
      >
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input name="Nombre_Instituto" value={formData.Nombre_Instituto} onChange={handleInputChange} required className="mb-4 p-3 w-full border rounded" />

          <label>Dirección:</label>
          <input name="Direccion" value={formData.Direccion} onChange={handleInputChange} required className="mb-4 p-3 w-full border rounded" />

          <label>Teléfono:</label>
          <input name="Telefono" value={formData.Telefono} onChange={handleInputChange} required className="mb-4 p-3 w-full border rounded" />

          <label>Correo:</label>
          <input name="Correo" type="email" value={formData.Correo} onChange={handleInputChange} required className="mb-4 p-3 w-full border rounded" />

          <label>Director:</label>
          <input name="Director" value={formData.Director} onChange={handleInputChange} required className="mb-4 p-3 w-full border rounded" />

          <label>Estado:</label>
          <select name="Estado" value={formData.Estado || ''} onChange={handleInputChange} required className="mb-4 p-3 w-full border rounded">
            <option value="">Seleccione un estado</option>
            {estados.map((estado) => (
              <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>{estado.Nombre_Estado}</option>
            ))}
          </select>

          <div className="flex justify-end">
            {isEditing && permisos.Permiso_Actualizar === "1" && <button type="submit" className="btn-guardar">Actualizar</button>}
            {!isEditing && permisos.Permiso_Insertar === "1" && <button type="submit" className="btn-guardar">Agregar</button>}
            <button type="button" onClick={resetForm} className="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals["modalConfirmacion"]}
        onClose={() => closeModal("modalConfirmacion")}
        onConfirm={() => handleDelete(formData.Id_Instituto)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar la institución"
        entidad={formData.Nombre_Instituto}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

<table className="xls_style-excel-table">
  <thead className="bg-slate-200">
    <tr>
      <th>#</th> {/* Número de Registro */}
      <th>Acciones</th> {/* Botones de Acción */}
      <th>ID</th> {/* ID del Instituto */}
      <th>Nombre</th> {/* Nombre del Instituto */}
      <th>Fecha de Creación</th> {/* Fecha de Creación */}
      <th>Dirección</th> {/* Dirección del Instituto */}
      <th>Teléfono</th> {/* Teléfono del Instituto */}
      <th>Correo</th> {/* Correo del Instituto */}
      <th>Director</th> {/* Nombre del Director */}
      <th>Estado</th> {/* Estado del Instituto */}
    </tr>
  </thead>
  {permisos?.Permiso_Consultar === "1" && (
    <tbody>
      {currentInstituciones.map((i, index) => {
        const estadoDescripcion =
          estados.find((estado) => estado.Codigo_Estado === i.Estado)?.Nombre_Estado || "Desconocido";

        const fechaCreacion = i.Fecha_Creacion || "Fecha no disponible"; // Si no trae la fecha, coloca un valor por defecto
        
        return (
          <tr key={i.Id_Instituto} className="border-b hover:bg-gray-100 transition duration-300">
            {/* # */}
            <td>{index + 1}</td> {/* Número de Registro */}

            {/* Acciones */}
            <td>
              <div className="flex justify-center gap-2">
                {permisos.Permiso_Actualizar === "1" && (
                  <button
                    onClick={() => handleEdit(i)}
                    className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                )}
                {permisos.Permiso_Eliminar === "1" && (
                  <button
                    onClick={() => {
                      setFormData(i);
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
            <td>{i.Id_Instituto}</td> {/* ID del Instituto */}

            {/* Nombre */}
            <td>{i.Nombre_Instituto}</td> {/* Nombre del Instituto */}

            {/* Fecha de Creación */}
            <td>{fechaCreacion}</td> {/* Fecha de Creación */}

            {/* Dirección */}
            <td>{i.Direccion}</td> {/* Dirección del Instituto */}

            {/* Teléfono */}
            <td>{i.Telefono}</td> {/* Teléfono del Instituto */}

            {/* Correo */}
            <td>{i.Correo}</td> {/* Correo del Instituto */}

            {/* Director */}
            <td>{i.Director}</td> {/* Director del Instituto */}

            {/* Estado */}
            <td>{estadoDescripcion}</td> {/* Estado del Instituto */}
          </tr>
        );
      })}
    </tbody>
  )}
</table>


      <Pagination
        currentPage={currentPage}
        totalItems={filteredInstituciones.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextPage={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredInstituciones.length / itemsPerPage))
          )
        }
      />
    </div>
  );
};

export default InstitucionManagement;
