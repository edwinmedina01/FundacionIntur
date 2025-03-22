import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useModal from '../../hooks/useModal';
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import ModalGenerico from '../../utils/ModalGenerico';
import { validarFormulario } from '../../utils/validaciones';
import { reglasValidacionGrado } from '../../../models/ReglasValidacionModelos';
import { obtenerEstados } from '../../utils/api';
import { exportToExcel } from '../../utils/exportToExcel';
import SearchBar from '../../components/basicos/SearchBar';
import Pagination from '../../components/basicos/Pagination';

const GradoManagement = () => {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);

  const { modals, showModal, closeModal } = useModal();

  const [grados, setGrados] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    Id_Grado: '',
    Nombre: '',
    Descripcion: '',
    Nivel_Academico: '',
    Duracion: '',
    Cantidad_Materias: '',
    Estado: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredGrados = grados.filter((g) =>
    g.Nombre.toLowerCase().includes(searchQuery.general.toLowerCase())
    || g.Descripcion.toLowerCase().includes(searchQuery.general.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentGrados = filteredGrados.slice(indexOfFirst, indexOfLast);

  const handleClearSearch = () => {
    setSearchQuery({ general: '' });
    setCurrentPage(1);
  };

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados('GENÉRICO');
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto: 8,
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

  const fetchGrados = async () => {
    try {
      const res = await axios.get('/api/apis_mantenimientos/grado');
      setGrados(res.data);
    } catch (err) {
      toast.error('Error al obtener grados');
    }
  };

  useEffect(() => {
    cargarEstados();
    fetchGrados();
    fetchPermisos();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      Id_Grado: '',
      Nombre: '',
      Descripcion: '',
      Nivel_Academico: '',
      Duracion: '',
      Cantidad_Materias: '',
      Estado: '',
    });
    setIsEditing(false);
  };

  const obtenerFechaActual = () => new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarFormulario(formData, reglasValidacionGrado);
    if (errores.length > 0) return;

    const payload = {
      ...formData,
      Creado_Por: user.id,
      Modificado_Por: user.id,
      Fecha_Creacion: obtenerFechaActual(),
      Fecha_Modificacion: obtenerFechaActual(),
    };

    try {
      const res = await fetch('/api/apis_mantenimientos/grado', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al guardar grado');
      toast.success(`Grado ${isEditing ? 'actualizado' : 'agregado'} exitosamente`);
      fetchGrados();
      resetForm();
      closeModal("modalAddGrado");
    } catch (error) {
      toast.error("Error al guardar el grado");
    }
  };

  const handleEdit = (grado) => {
    setFormData(grado);
    setIsEditing(true);
    showModal("modalAddGrado");
  };

  const handleDelete = async (Id_Grado) => {
    try {
      await axios.delete('/api/apis_mantenimientos/grado', {
        data: { Id_Grado },
      });
      toast.error("Grado eliminado exitosamente");
      fetchGrados();
      closeModal("modalConfirmacion");
    } catch (error) {
      toast.error("Error al eliminar el grado");
    }
  };

  const handleExport = async () => {
    const headers = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Descripción", key: "Descripcion", width: 40 },
      { header: "Nivel Académico", key: "Nivel_Academico", width: 25 },
      { header: "Duración", key: "Duracion", width: 15 },
      { header: "Cantidad de Materias", key: "Cantidad_Materias", width: 25 },
    ];
    const data = filteredGrados.map((g) => ({
      ID: g.Id_Grado,
      Nombre: g.Nombre,
      Descripcion: g.Descripcion,
      Nivel_Academico: g.Nivel_Academico,
      Duracion: g.Duracion,
      Cantidad_Materias: g.Cantidad_Materias,
    }));
    await exportToExcel({ fileName: 'Grados.xlsx', title: 'Reporte de Grados', headers, data, searchQuery });
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a Grados</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  }
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div>
      <SearchBar
        title="Listado de Grados"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        onAdd={() => {
          resetForm();
          showModal("modalAddGrado");
        }}
        onExport={handleExport}
      />

      <ModalConfirmacion
        isOpen={modals["modalConfirmacion"]}
        onClose={() => closeModal("modalConfirmacion")}
        onConfirm={() => handleDelete(formData?.Id_Grado)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar a"
        entidad={formData?.Descripcion}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      <table className="xls_style-excel-table">
        <thead className="bg-slate-200">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Nivel Académico</th>
            <th>Duración</th>
            <th>Cantidad de Materias</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentGrados.map((g) => {
            const estadoDescripcion = estados.find((e) => e.Codigo_Estado === g.Estado)?.Nombre_Estado || "Desconocido";
            return (
              <tr key={g.Id_Grado}>
                <td>{g.Nombre}</td>
                <td>{g.Descripcion}</td>
                <td>{g.Nivel_Academico}</td>
                <td>{g.Duracion}</td>
                <td>{g.Cantidad_Materias}</td>
                <td>{estadoDescripcion}</td>
                <td className="flex gap-2">
                  {permisos?.Permiso_Actualizar === "1" && (
                    <button onClick={() => handleEdit(g)} className="btn-editar">Editar</button>
                  )}
                  {permisos?.Permiso_Eliminar === "1" && (
                    <button
                      onClick={() => {
                        setFormData(g);
                        showModal("modalConfirmacion");
                      }}
                      className="btn-eliminar"
                    >
                      X
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ModalGenerico
  id="modalAddGrado"
  isOpen={modals["modalAddGrado"]}
  onClose={() => {
    closeModal("modalAddGrado");
    resetForm();
  }}
  titulo={isEditing ? "Editar Grado" : "Agregar Grado"}
>
  <form onSubmit={handleSubmit}>
    {/* Nombre */}
    <label className="block mb-2 text-sm font-medium text-gray-700">Nombre del Grado</label>
    <input
      type="text"
      name="Nombre"
      value={formData.Nombre}
      onChange={handleInputChange}
      required
      className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Descripción */}
    <label className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
    <input
      type="text"
      name="Descripcion"
      value={formData.Descripcion}
      onChange={handleInputChange}
      required
      className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Nivel Académico */}
    <label className="block mb-2 text-sm font-medium text-gray-700">Nivel Académico</label>
    <input
      type="text"
      name="Nivel_Academico"
      value={formData.Nivel_Academico}
      onChange={handleInputChange}
      required
      className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Duración */}
    <label className="block mb-2 text-sm font-medium text-gray-700">Duración</label>
    <input
      type="text"
      name="Duracion"
      value={formData.Duracion}
      onChange={handleInputChange}
      required
      className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Cantidad de Materias */}
    <label className="block mb-2 text-sm font-medium text-gray-700">Cantidad de Materias</label>
    <input
      type="number"
      name="Cantidad_Materias"
      value={formData.Cantidad_Materias}
      onChange={handleInputChange}
      required
      className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Estado */}
    <label className="block mb-2 text-sm font-medium text-gray-700">Estado</label>
    <select
      name="Estado"
      value={formData.Estado || ""}
      onChange={handleInputChange}
      required
      className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Seleccione un estado</option>
      {estados.map((estado) => (
        <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
          {estado.Nombre_Estado}
        </option>
      ))}
    </select>

    {/* Botones */}
    <div className="flex justify-end">
      {isEditing && permisos?.Permiso_Actualizar === "1" && (
        <button type="submit" className="btn-guardar">Actualizar</button>
      )}
      {!isEditing && permisos?.Permiso_Insertar === "1" && (
        <button type="submit" className="btn-guardar">Agregar</button>
      )}
      <button
        type="button"
        onClick={() => {
          resetForm();
          closeModal("modalAddGrado");
        }}
        className="btn-cancelar"
      >
        Cancelar
      </button>
    </div>
  </form>
</ModalGenerico>


      <Pagination
        currentPage={currentPage}
        totalItems={filteredGrados.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextPage={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredGrados.length / itemsPerPage))
          )
        }
      />
    </div>
  );
};

export default GradoManagement;
