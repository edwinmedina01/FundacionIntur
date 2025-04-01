// ✅ CÓDIGO REFACTORIZADO PARA TUTORES/PADRES CON ESTRUCTURA COMPLETA

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import useModal from '../hooks/useModal';
import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import { obtenerEstados } from '../../src/utils/api';
import { getBase64ImageFromUrl } from '../../src/utils/getBase64ImageFromUrl';
import { validarFormulario } from '../utils/validaciones';
import { reglasValidacionTutores } from '../../models/ReglasValidacionModelos';
import { deepSearch } from '../../src/utils/deepSearch';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SearchBar from '../components/basicos/SearchBar';
import Pagination from '../components/basicos/Pagination';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const TutorPadreManagement = () => {
  const { user } = useContext(AuthContext);
  const { modals, showModal, closeModal } = useModal();
  const [tutores, setTutores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    Id_Persona: '',
    Persona_Nombre: '',
    Persona_Apellido: '',
    Persona_Telefono: '',
    Persona_Direccion: '',
    Estado: '',
    Tipo_Persona: 2
  });
  const [isEditing, setIsEditing] = useState(false);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ general: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados('GENÉRICO');
    setEstados(data);
  }, []);

  const fetchPermisos = async () => {
    try {
      const idObjeto = 15;
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

  const fetchTutores = async () => {
    const response = await axios.get('/api/tutorpadre');
    setTutores(response.data);
  };

  useEffect(() => {
    if (user) {
      cargarEstados();
      fetchPermisos();
      fetchTutores();
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      Id_Persona: '', Persona_Nombre: '', Persona_Apellido: '', Persona_Telefono: '', Persona_Direccion: '', Estado: '', Tipo_Persona: 2
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarFormulario(formData, reglasValidacionTutores);
    if (errores.length > 0) return alert(errores.join('\n'));

    try {
      if (isEditing) {
        await axios.put(`/api/tutorpadre/${formData.Id_Persona}`, formData);
      } else {
        await axios.post('/api/tutorpadre', formData);
      }
      resetForm();
      closeModal('modalAddRow');
      fetchTutores();
    } catch (error) {
      alert('Error al guardar tutor');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tutorpadre/${id}`);
      fetchTutores();
      closeModal('modalConfirmacion');
    } catch (error) {
      alert('Error al eliminar tutor');
    }
  };

  const exportToExcel = async () => {
    const headers = [
      { header: 'Identidad', key: 'Identidad', width: 20 },
      { header: 'Nombre', key: 'Nombre', width: 30 },
      { header: 'Teléfono', key: 'Telefono', width: 20 },
      { header: 'Dirección', key: 'Direccion', width: 40 },
      { header: 'Estudiante', key: 'Estudiante', width: 30 },
      { header: 'Estado', key: 'Estado', width: 20 }
    ];

    const data = tutores.map(t => {
      const estado = estados.find(e => e.Codigo_Estado === t.Estado)?.Nombre_Estado || 'Desconocido';
      return {
        Identidad: t.Identidad,
        Nombre: `${t.Persona_Nombre} ${t.Persona_Apellido}`,
        Telefono: t.Persona_Telefono,
        Direccion: t.Persona_Direccion,
        Estudiante: `${t.Estudiante_Nombre} ${t.Estudiante_Apellido}`,
        Estado: estado,
      };
    });

    const logoBase64 = await getBase64ImageFromUrl('/img/intur.png');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tutores');
    const imageId = workbook.addImage({ base64: logoBase64, extension: 'png' });
    worksheet.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 120, height: 50 } });

    worksheet.mergeCells('B1:G1');
    worksheet.getCell('B1').value = 'Reporte de Tutores';
    worksheet.getCell('B1').font = { bold: true, size: 16 };
    worksheet.getCell('B1').alignment = { horizontal: 'center' };

    worksheet.getRow(4).values = headers.map(h => h.header);
    worksheet.columns = headers;
    data.forEach(d => worksheet.addRow(d));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'Tutores.xlsx');
  };

  const filteredTutores = tutores.filter(t => deepSearch(t, searchQuery));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredTutores.slice(indexOfFirst, indexOfLast);

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos) return <p>No tienes permisos para acceder.</p>;
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div className="p-6">
      <SearchBar
        title="Listado de Tutores"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={() => setSearchQuery({ general: '' })}
        onAdd={() => { resetForm(); showModal('modalAddRow'); }}
        onExport={exportToExcel}
      />

      <table className="xls_style-excel-table">
        <thead>
          <tr>
            <th>Identidad</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estudiante</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(t => (
            <tr key={t.Id_Persona}>
              <td>{t.Identidad}</td>
              <td>{t.Persona_Nombre} {t.Persona_Apellido}</td>
              <td>{t.Persona_Telefono}</td>
              <td>{t.Persona_Direccion}</td>
              <td>{t.Estudiante_Nombre} {t.Estudiante_Apellido}</td>
              <td>{estados.find(e => e.Codigo_Estado === t.Estado)?.Nombre_Estado || 'Desconocido'}</td>
              <td>
                <button onClick={() => { setFormData(t); setIsEditing(true); showModal('modalAddRow'); }}><PencilSquareIcon className="h-5 w-5" /></button>
                <button onClick={() => { setFormData(t); showModal('modalConfirmacion'); }}><TrashIcon className="h-5 w-5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredTutores.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        nextPage={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredTutores.length / itemsPerPage)))}
      />

      <ModalGenerico
        id="modalAddRow"
        isOpen={modals['modalAddRow']}
        onClose={() => closeModal('modalAddRow')}
        titulo={isEditing ? 'Editar Tutor' : 'Agregar Tutor'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="Persona_Nombre" value={formData.Persona_Nombre} onChange={e => setFormData({ ...formData, Persona_Nombre: e.target.value })} placeholder="Nombre" className="w-full border p-2 rounded" />
          <input name="Persona_Apellido" value={formData.Persona_Apellido} onChange={e => setFormData({ ...formData, Persona_Apellido: e.target.value })} placeholder="Apellido" className="w-full border p-2 rounded" />
          <input name="Persona_Telefono" value={formData.Persona_Telefono} onChange={e => setFormData({ ...formData, Persona_Telefono: e.target.value })} placeholder="Teléfono" className="w-full border p-2 rounded" />
          <input name="Persona_Direccion" value={formData.Persona_Direccion} onChange={e => setFormData({ ...formData, Persona_Direccion: e.target.value })} placeholder="Dirección" className="w-full border p-2 rounded" />
          <select name="Estado" value={formData.Estado} onChange={e => setFormData({ ...formData, Estado: e.target.value })} className="w-full border p-2 rounded">
            <option value="">Seleccione Estado</option>
            {estados.map(e => <option key={e.Codigo_Estado} value={e.Codigo_Estado}>{e.Nombre_Estado}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEditing ? 'Actualizar' : 'Guardar'}</button>
        </form>
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals['modalConfirmacion']}
        onClose={() => closeModal('modalConfirmacion')}
        onConfirm={() => handleDelete(formData.Id_Persona)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar este tutor?"
        entidad={formData?.Persona_Nombre}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default TutorPadreManagement;
