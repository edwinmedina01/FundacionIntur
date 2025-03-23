import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validarFormulario } from '../../utils/validaciones';
import { reglasValidacionDepartamento } from '../../../models/ReglasValidacionModelos';
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import useModal from '../../hooks/useModal';
import SearchBar from '../../components/basicos/SearchBar';
import Pagination from '../../components/basicos/Pagination';
import ModalGenerico from '../../utils/ModalGenerico';
import { obtenerEstados } from '../../utils/api';
import { exportToExcel } from '../../utils/exportToExcel';

const DepartamentoManagement = () => {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const { modals, showModal, closeModal } = useModal();

  const [departamentos, setDepartamentos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    Id_Departamento: '',
    Nombre_Departamento: '',
    Estado: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredDepartamentos = departamentos.filter((d) =>
    d.Nombre_Departamento.toLowerCase().includes(searchQuery.general.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDepartamentos = filteredDepartamentos.slice(indexOfFirst, indexOfLast);

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto: 7,
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

  const fetchDepartamentos = async () => {
    const res = await axios.get('/api/apis_mantenimientos/departamentos');
    setDepartamentos(res.data);
  };

  useEffect(() => {
    cargarEstados();
    fetchDepartamentos();
    fetchPermisos();
  }, [user]);

  const resetForm = () => {
    setFormData({ Id_Departamento: '', Nombre_Departamento: '', Estado: '' });
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

    const errores = validarFormulario(payload, reglasValidacionDepartamento);
    if (errores.length > 0) return;

    try {
      const res = await fetch('/api/apis_mantenimientos/departamentos', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar');

      toast.success(`Departamento ${isEditing ? 'actualizado' : 'agregado'} exitosamente`);
      fetchDepartamentos();
      resetForm();
      closeModal("modalAddDepartamento");
    } catch (error) {
      toast.error("Error al guardar el departamento");
    }
  };

  const handleEdit = (dep) => {
    setFormData(dep);
    setIsEditing(true);
    showModal("modalAddDepartamento");
  };

  const handleDelete = async (Id_Departamento) => {
    await axios.delete('/api/apis_mantenimientos/departamentos', { data: { Id_Departamento } });
    toast.error("Departamento eliminado exitosamente");
    fetchDepartamentos();
    resetForm();
    closeModal("modalConfirmacion");
  };

  const handleExport = async () => {
    const headers = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Estado", key: "Estado", width: 15 },
    ];
    const data = departamentos.map((d) => ({
      ID: d.Id_Departamento,
      Nombre: d.Nombre_Departamento,
      Estado: estados.find((e) => e.Codigo_Estado === d.Estado)?.Nombre_Estado || "Desconocido",
    }));
    await exportToExcel({
      fileName: 'Departamentos.xlsx',
      title: 'Reporte de Departamentos',
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
          <h3 className="font-bold text-lg">Sin permisos para acceder a Departamentos</h3>
          <p>No tienes permisos para esta pantalla.</p>
        </div>
      </div>
    );

  return (
    <div>
      <SearchBar
        title="Listado de Departamentos"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={() => setSearchQuery({ general: '' })}
        onAdd={() => {
          resetForm();
          showModal("modalAddDepartamento");
        }}
        onExport={handleExport}
      />

      <ModalGenerico
        id="modalAddDepartamento"
        isOpen={modals["modalAddDepartamento"]}
        onClose={() => closeModal("modalAddDepartamento")}
        titulo={isEditing ? "Editar Departamento" : "Agregar Departamento"}
      >
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input name="Nombre_Departamento" value={formData.Nombre_Departamento} onChange={handleInputChange} className="mb-4 p-3 w-full border rounded" required />

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
            <button type="button" onClick={() => { resetForm(); closeModal("modalAddDepartamento"); }} className="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals["modalConfirmacion"]}
        onClose={() => closeModal("modalConfirmacion")}
        onConfirm={() => handleDelete(formData.Id_Departamento)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar el departamento?"
        entidad={formData.Nombre_Departamento}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      <table className="xls_style-excel-table">
        <thead className="bg-slate-200">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {permisos?.Permiso_Consultar === "1" && currentDepartamentos.map((d) => (
            <tr key={d.Id_Departamento}>
              <td>{d.Id_Departamento}</td>
              <td>{d.Nombre_Departamento}</td>
              <td>{estados.find((e) => e.Codigo_Estado === d.Estado)?.Nombre_Estado || "Desconocido"}</td>
              <td className="py-4 px-6 flex justify-center space-x-2">
                {permisos?.Permiso_Actualizar === "1" && <button onClick={() => handleEdit(d)} className="btn-editar">Editar</button>}
                {permisos?.Permiso_Eliminar === "1" && <button onClick={() => { setFormData(d); showModal("modalConfirmacion"); }} className="btn-eliminar">X</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredDepartamentos.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextPage={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredDepartamentos.length / itemsPerPage))
          )
        }
      />
    </div>
  );
};

export default DepartamentoManagement;
