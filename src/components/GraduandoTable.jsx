// ✅ CÓDIGO COMPLETO REESTRUCTURADO PARA GraduandoForm (con SearchBar, Paginación y tabla original)

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';
import useModal from '../hooks/useModal';
import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import { validarFormulario } from '../utils/validaciones';
import { reglasValidacionGraduando } from '../../models/ReglasValidacionModelos';
import { obtenerEstados } from '../utils/api';
import { exportToExcel } from '../utils/exportToExcel';
import { getBase64ImageFromUrl } from '../utils/getBase64ImageFromUrl';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SearchBar from '../components/basicos/SearchBar';
import Pagination from '../components/basicos/Pagination';
import Select from 'react-select';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';


const GraduandoForm = () => {
  const { user } = useContext(AuthContext);
  const [graduandos, setGraduandos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({ Anio: '', Fecha_Inicio: '', Fecha_Final: '', Estado: '', Id_Estudiante: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const { modals, showModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados('GENÉRICO');
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      const idObjeto = 14;
      const response = await axios.post('/api/api_permiso', {
        idRol: user.rol,
        idObjeto,
      });
      const data = response.data;
      if (Object.values(data).every(v => v !== '1')) setSinPermisos(true);
      else setPermisos(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener permisos');
    }
  };

  const fetchGraduandos = async () => {
    const response = await axios.get('/api/graduando');
    setGraduandos(response.data);
  };

  const fetchEstudiantes = async () => {
    const response = await axios.get('/api/estudiantes');
    setEstudiantes(response.data);
  };

  const opcionesEstudiantes = estudiantes
  .filter(est => !graduandos.some(g => g.Id_Estudiante === est.Id_Estudiante)) // Solo los que NO tienen matrícula
  .map(e => ({
    value: e.Id_Estudiante,
    label: `${e.Persona.Identidad} - ${e.Persona.Primer_Nombre} ${e.Persona.Primer_Apellido}`,
  }));


  useEffect(() => {
    if (user) {
      cargarEstados();
      fetchPermisos();
      fetchGraduandos();
      fetchEstudiantes();
    }
  }, [user]);

  const resetForm = () => {
    setFormData({ Anio: '', Fecha_Inicio: '', Fecha_Final: '', Estado: '', Id_Estudiante: '' });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarFormulario(formData, reglasValidacionGraduando);
    if (errores.length > 0) return;// toast.error(errores.join('\n'));

    try {
      if (isEditing) {
        await axios.put(`/api/graduando/${formData.Id_Graduando}`, formData);
        toast.success('Graduando actualizado correctamente');
      } else {
        await axios.post('/api/graduando', formData);
        toast.success('Graduando agregado correctamente');
      }
      resetForm();
      closeModal('modalAddRow');
      fetchGraduandos();
    } catch (error) {
      toast.error('Error al guardar el graduando');
    }
  };

  const handleDelete = async (Id_Graduando) => {
    try {
      await axios.delete(`/api/graduando/${Id_Graduando}`);
      toast.success('Graduando eliminado correctamente');
      closeModal('modalConfirmacion');
      fetchGraduandos();
    } catch (err) {
      toast.error('Error al eliminar el graduando');
    }
  };

  const handleExportGraduandos = async () => {
    const headers = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Identidad", key: "Identidad", width: 20 },
      { header: "Nombre Completo", key: "Nombre", width: 40 },
      { header: "Año", key: "Anio", width: 10 },
      { header: "Fecha de Inicio", key: "Fecha_Inicio", width: 18 },
      { header: "Fecha de Finalización", key: "Fecha_Final", width: 18 },
      { header: "Estado", key: "Estado", width: 20 },
      { header: "Fecha de Creación", key: "Fecha_Creacion", width: 20 },
    ];
  
    const data = filteredGraduandos.map((graduando) => {
      const estado = estados.find(e => e.Codigo_Estado === graduando.Estado)?.Nombre_Estado || "Desconocido";
  
      return {
        ID: graduando.Id_Graduando,
        Identidad: graduando.Estudiante.Persona.Identidad.toString(),
        Nombre: `${graduando.Estudiante.Persona.Primer_Nombre} ${graduando.Estudiante.Persona.Primer_Apellido}`,
        Anio: graduando.Anio,
        Fecha_Inicio: graduando.Fecha_Inicio || "-",
        Fecha_Final: graduando.Fecha_Final || "-",
        Estado: estado,
        Fecha_Creacion: graduando.Fecha_Creacion || "-",
      };
    });
  
    await exportToExcel({
      fileName: "Graduandos.xlsx",
      title: "Reporte de Graduandos",
      headers,
      data,
      searchQuery, // para mostrar los filtros aplicados en la exportación
    });
  };
  
  const filteredGraduandos = graduandos.filter(g => JSON.stringify(g).toLowerCase().includes(searchQuery.general.toLowerCase()));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredGraduandos.slice(indexOfFirst, indexOfLast);

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos) return <p>No tienes permisos para acceder.</p>;
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div className="p-6">
      <SearchBar
        title="Listado de Graduandos"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={() => setSearchQuery({ general: '' })}
        onAdd={() => { resetForm(); showModal('modalAddRow'); }}
        onExport={handleExportGraduandos}
      />

      <table className="xls_style-excel-table">
      <thead className="bg-slate-200">
      <tr>
            <th>#</th>
            <th>Acciones</th>
            <th>ID</th>
            <th>Identidad</th>
            <th>Fecha de Creación</th>
            <th>Nombre Completo</th>
            <th>Año</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Finalización</th>
            <th>Estado</th>
 
          
          </tr>
        </thead>
        <tbody>
          {currentItems.map((g,index) => (
            <tr key={g.Id_Graduando}>
        
              <td>{index+1}</td>
              <div className="flex justify-center gap-2">
    <button
      className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={() => { setFormData(g); setIsEditing(true); showModal('modalAddRow'); }}
    >
      <PencilSquareIcon className="h-5 w-5" />
    </button>
    <button
      className="bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
      onClick={() => { setFormData(g); showModal('modalConfirmacion'); }}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  </div>
  <td>{g.Id_Graduando}</td>
              <td>{g.Estudiante.Persona.Identidad}</td>
              <td>{g.Fecha_Creacion}</td>
              <td>{g.Estudiante.Persona.Primer_Nombre} {g.Estudiante.Persona.Primer_Apellido}</td>
              <td>{g.Anio}</td>
              <td>{g.Fecha_Inicio}</td>
              <td>{g.Fecha_Final}</td>
              <td>{estados.find(e => e.Codigo_Estado === g.Estado)?.Nombre_Estado || 'Desconocido'}</td>
    


            </tr>
          ))}
          {filteredGraduandos.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">No se encontraron registros.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredGraduandos.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        nextPage={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredGraduandos.length / itemsPerPage)))}
      />

      <ModalGenerico
        id="modalAddRow"
        isOpen={modals['modalAddRow']}
        onClose={() => closeModal('modalAddRow')}
        titulo={isEditing ? 'Editar Graduando' : 'Agregar Graduando'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
        {isEditing ? (
  <div className="w-full border p-2 rounded bg-gray-100 text-gray-700">
    {formData?.Estudiante?.Persona?.Identidad} - {formData?.Estudiante?.Persona?.Primer_Nombre} {formData?.Estudiante?.Persona?.Primer_Apellido}
  </div>
) : (
  <Select
    options={estudiantes
      .filter(est => !graduandos.some(g => g.Id_Estudiante === est.Id_Estudiante))
      .map(e => ({
        value: e.Id_Estudiante,
        label: `${e.Persona.Identidad} - ${e.Persona.Primer_Nombre} ${e.Persona.Primer_Apellido}`,
      }))
    }
    placeholder="Seleccione un estudiante sin matrícula"
    value={
      estudiantes
        .filter(est => !graduandos.some(g => g.Id_Estudiante === est.Id_Estudiante))
        .map(e => ({
          value: e.Id_Estudiante,
          label: `${e.Persona.Identidad} - ${e.Persona.Primer_Nombre} ${e.Persona.Primer_Apellido}`,
        }))
        .find(opt => opt.value === formData.Id_Estudiante) || null
    }
    onChange={(selectedOption) =>
      setFormData({
        ...formData,
        Id_Estudiante: selectedOption?.value || '',
      })
    }
    isClearable
    className="w-full"
  />
)}

          <input name="Anio" value={formData.Anio} onChange={e => setFormData({ ...formData, Anio: e.target.value })} placeholder="Año" className="w-full border p-2 rounded" />
          <input type="date" name="Fecha_Inicio" value={formData.Fecha_Inicio} onChange={e => setFormData({ ...formData, Fecha_Inicio: e.target.value })} className="w-full border p-2 rounded" />
          <input type="date" name="Fecha_Final" value={formData.Fecha_Final} onChange={e => setFormData({ ...formData, Fecha_Final: e.target.value })} className="w-full border p-2 rounded" />
          <select name="Estado" value={formData.Estado} onChange={e => setFormData({ ...formData, Estado: e.target.value })} className="w-full border p-2 rounded">
            <option value="">Seleccione un estado</option>
            {estados.map(e => <option key={e.Codigo_Estado} value={e.Codigo_Estado}>{e.Nombre_Estado}</option>)}
          </select>
          {/* <select name="Id_Estudiante" value={formData.Id_Estudiante} onChange={e => setFormData({ ...formData, Id_Estudiante: e.target.value })} className="w-full border p-2 rounded">
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map(e => <option key={e.Id_Estudiante} value={e.Id_Estudiante}>{`${e.Persona.Identidad} - ${e.Persona.Primer_Nombre} ${e.Persona.Primer_Apellido}`}</option>)}
          </select> */}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>
        </form>
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals['modalConfirmacion']}
        onClose={() => closeModal('modalConfirmacion')}
        onConfirm={() => handleDelete(formData.Id_Graduando)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar este graduando?"
        entidad={formData?.Id_Graduando}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default GraduandoForm;
