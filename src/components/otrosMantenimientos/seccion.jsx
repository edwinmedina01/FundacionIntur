import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { validarFormulario } from '../../utils/validaciones';
import { reglasValidacionSeccion } from '../../../models/ReglasValidacionModelos';
import { obtenerEstados } from '../../utils/api';
import { exportToExcel } from '../../utils/exportToExcel';
import useModal from '../../hooks/useModal';

import ModalConfirmacion from '../../utils/ModalConfirmacion';
import ModalGenerico from '../../utils/ModalGenerico';
import SearchBar from '../../components/basicos/SearchBar';
import Pagination from '../../components/basicos/Pagination';

const SeccionManagement = () => {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);

  const { modals, showModal, closeModal } = useModal();
  const router = useRouter();

  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]);
  const [estados, setEstados] = useState([]);

  const [formData, setFormData] = useState({
    Id_Seccion: '',
    Nombre_Seccion: '',
    Id_Grado: '',
    Estado: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredSecciones = secciones.filter((s) =>
    s.Nombre_Seccion.toLowerCase().includes(searchQuery.general.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSecciones = filteredSecciones.slice(indexOfFirst, indexOfLast);

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados("GENÉRICO");
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto: 13
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

  const fetchSecciones = async () => {
    const res = await axios.get('/api/apis_mantenimientos/seccion');
    setSecciones(res.data);
  };

  const fetchGrados = async () => {
    const res = await axios.get('/api/apis_mantenimientos/grado');
    setGrados(res.data);
  };

  useEffect(() => {
    cargarEstados();
    fetchSecciones();
    fetchGrados();
    fetchPermisos();
  }, [user]);

  const resetForm = () => {
    setFormData({ Id_Seccion: '', Nombre_Seccion: '', Id_Grado: '', Estado: '' });
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
      Fecha_Modificacion: new Date().toISOString().split('T')[0],
    };
    const errores = validarFormulario(payload, reglasValidacionSeccion);
    if (errores.length > 0) return;

    try {
      const res = await fetch('/api/apis_mantenimientos/seccion', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar sección');
      toast.success(`Sección ${isEditing ? 'actualizada' : 'agregada'} exitosamente`);
      fetchSecciones();
      resetForm();
      closeModal("modalAddSeccion");
    } catch (error) {
      toast.error("Error al guardar sección");
    }
  };

  const handleEdit = (seccion) => {
    setFormData(seccion);
    setIsEditing(true);
    showModal("modalAddSeccion");
  };

  const handleDelete = async (Id_Seccion) => {
    await axios.delete('/api/apis_mantenimientos/seccion', { data: { Id_Seccion } });
    toast.error("Sección eliminada exitosamente");
    fetchSecciones();
    resetForm();
    closeModal("modalConfirmacion");
  };

  const handleExport = async () => {
    const headers = [
   //   { header: "Item", key: "Item", width: 10 },
      { header: "Nombre Sección", key: "Nombre_Seccion", width: 30 },
      { header: "Id", key: "Id_Seccion", width: 10 },
      { header: "Grado", key: "Nombre_Grado", width: 25 },
      { header: "Estado", key: "Estado", width: 15 },
    ];
  
    const data = currentSecciones.map((seccion, index) => ({
    //  Item: index + 1,
      Nombre_Seccion: seccion.Nombre_Seccion,
      Id_Seccion: seccion.Id_Seccion,
      Nombre_Grado: seccion.Nombre_Grado || "-", // puedes ajustar según tu modelo
      Estado:
        estados.find((e) => e.Codigo_Estado === seccion.Estado)?.Nombre_Estado ||
        "Desconocido",
    }));
  
    await exportToExcel({
      fileName: "Secciones.xlsx",
      title: "Reporte de Secciones",
      headers,
      data,
      searchQuery,
    });
  };
  

  const handleExportold = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Secciones");
    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Nombre Sección", key: "Nombre_Seccion", width: 30 },
      { header: "ID Grado", key: "Id_Grado", width: 15 }
    ];
    const data = currentSecciones.map((s) => ({
      ID: s.Id_Seccion,
      Nombre_Seccion: s.Nombre_Seccion,
      Id_Grado: s.Id_Grado
    }));
    data.forEach((row) => worksheet.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Secciones.xlsx");
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos)
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a Secciones</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div>
      <SearchBar
        title="Listado de Secciones"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={() => setSearchQuery({ general: '' })}
        onAdd={() => {
          resetForm();
          showModal("modalAddSeccion");
        }}
        onExport={handleExport}
      />

      <ModalGenerico
        id="modalAddSeccion"
        isOpen={modals["modalAddSeccion"]}
        onClose={() => closeModal("modalAddSeccion")}
        titulo={isEditing ? "Editar Sección" : "Agregar Sección"}
      >
        <form onSubmit={handleSubmit}>
          <label>Nombre de la Sección:</label>
          <input
            name="Nombre_Seccion"
            value={formData.Nombre_Seccion}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border rounded"
          />

          <label>Grado:</label>
          <select
            name="Id_Grado"
            value={formData.Id_Grado}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border rounded"
          >
            <option value="">Seleccione un grado</option>
            {grados.map((g) => (
              <option key={g.Id_Grado} value={g.Id_Grado}>{g.Nombre}</option>
            ))}
          </select>

          <label>Estado:</label>
          <select
            name="Estado"
            value={formData.Estado || ''}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border rounded"
          >
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
        onConfirm={() => handleDelete(formData.Id_Seccion)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar la sección"
        entidad={formData.Nombre_Seccion}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

<table className="xls_style-excel-table">
  <thead className="bg-slate-200">
    <tr>
    <th className=" text-left">Item</th>
      <th className=" text-left">Nombre Sección</th>
      <th className=" text-left">Id</th>
      <th className=" text-left">Grado</th>
      <th className=" text-left">Estado</th> {/* Nueva columna */}
      <th className=" center">Acciones</th>
    </tr>
  </thead>
  {permisos?.Permiso_Consultar === "1" && (
    <tbody>
      {currentSecciones.map((seccion,index) => (
        <tr key={seccion.Id_Seccion}>
          <td className="">{index+1}</td>
          <td className="">{seccion.Nombre_Seccion}</td>
          <td className="">{seccion.Id_Seccion}</td>
          <td className="">{seccion.Nombre_Grado}</td>

          {/* 📌 Mostrar el estado con su descripción */}
          <td className="">
            {estados.find((estado) => estado.Codigo_Estado === seccion.Estado)?.Nombre_Estado || "Desconocido"}
          </td>

          <td className="py-4 px-6 flex justify-center space-x-2">
            {permisos.Permiso_Actualizar === "1" && (
              <button
                onClick={() => handleEdit(seccion)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
              >
                Editar
              </button>
            )}
            {permisos.Permiso_Eliminar === "1" && (
              <button
                onClick={() => {
                  setFormData(seccion);
                  showModal("modalConfirmacion");
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
              >
                X
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  )}
</table>


      <Pagination
        currentPage={currentPage}
        totalItems={filteredSecciones.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextPage={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredSecciones.length / itemsPerPage))
          )
        }
      />
    </div>
  );
};

export default SeccionManagement;