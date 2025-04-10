// ✅ CÓDIGO REFACTORIZADO PARA MATRÍCULA MANAGEMENT USANDO COMPONENTE

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { obtenerEstados } from '../../src/utils/api';

import useModal from '../hooks/useModal';
import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';

import { exportToExcel } from "../utils/exportToExcel"; // Importar la función

import SearchBar from '../components/basicos/SearchBar';
import Pagination from '../components/basicos/Pagination';
import MatriculaForm from '../components/basicos/MatriculaForm';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const MatriculaManagement = () => {
  const { user } = useContext(AuthContext);
  const { modals, showModal, closeModal } = useModal();
  const [estados, setEstados] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [formData, setFormData] = useState(null);
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

  const fetchMatriculas = async () => {
    const response = await axios.get('/api/matriculas');
    setMatriculas(response.data);
  };

  useEffect(() => {
    if (user) {
      cargarEstados();
      fetchPermisos();
      fetchMatriculas();
    }
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/matriculas`, { data: { Id_Matricula: id } });
      fetchMatriculas();
      closeModal('modalConfirmacion');
    } catch (error) {
      alert('Error al eliminar la matrícula');
    }
  };



  const handleExportMatriculas = async () => {
    const headers = [
   //   { header: "ID Matrícula", key: "ID", width: 15 },

      { header: "Identidad", key: "Identidad", width: 20 },
      { header: "Fecha Matrícula", key: "Fecha_Matricula", width: 20 },
      { header: "Estudiante", key: "Estudiante", width: 30 },
      { header: "Modalidad", key: "Modalidad", width: 20 },
      { header: "Grado", key: "Grado", width: 15 },
      { header: "Sección", key: "Seccion", width: 15 },

      { header: "Estado", key: "Estado", width: 20 },
    ];
  
    const data = filteredMatriculas.map((matricula) => {
      const estado = estados.find((e) => e.Codigo_Estado === matricula.Estado)?.Nombre_Estado || "Desconocido";
  
      return {
        ID: matricula.Id_Matricula,
        Identidad: " "+matricula.Identidad || "-",
        Estudiante: `${matricula.Estudiante || ""} ${matricula.Primer_Apellido || ""}`,
        Modalidad: matricula.Modalidad || "-",
        Grado: matricula.Grado || "-",
        Seccion: matricula.Seccion || "-",
        Fecha_Matricula: matricula.Fecha_Matricula
          ? new Date(matricula.Fecha_Matricula).toLocaleDateString("es-ES")
          : "-",
        Estado: estado,
      };
    });
  
    await exportToExcel({
      fileName: "Matriculas.xlsx",
      title: "Reporte General de Matrículas",
      headers,
      data,
      searchQuery,
    });
  };
  


  const filteredMatriculas = matriculas.filter(m => {
    const query = searchQuery.general.toLowerCase();
    return (
      m.Estudiante?.toLowerCase().includes(query) ||
      m.Modalidad?.toLowerCase().includes(query) ||
      m.Grado?.toLowerCase().includes(query) ||
      m.Seccion?.toLowerCase().includes(query) ||
      String(m.Identidad || '').toLowerCase().includes(query)
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredMatriculas.slice(indexOfFirst, indexOfLast);

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos) return <p>No tienes permisos para acceder.</p>;
  if (!permisos) return <p>Cargando permisos...</p>;

  return (
    <div className="p-6">
      <SearchBar
        title="Matrícula General"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={() => setSearchQuery({ general: '' })}
        onAdd={() => { setFormData(null); setIsEditing(false); showModal('modalAddMatricula'); }}
        onExport={handleExportMatriculas}
      />

      <table className="xls_style-excel-table">
        <thead>
          <tr>
            
          <th>#</th>
          <th>Acciones</th>
            <th>Identidad</th>
            <th>Fecha Matrícula</th>
            <th>Estudiante</th>
            <th>Modalidad</th>
            <th>Grado</th>
            <th>Sección</th>
           
           
            <th>Estado</th>
           
          </tr>
        </thead>
        <tbody>
          {currentItems.map((m,index) => (
            <tr key={m.Id_Matricula}>
              <td>{index+1}</td>
              <td>
              <div className="flex justify-center gap-2">
                {permisos.Permiso_Actualizar === '1' && (
                  <button         className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => { setFormData(m); setIsEditing(true); showModal('modalAddMatricula'); }}><PencilSquareIcon className="h-5 w-5" /></button>
                )}
                {permisos.Permiso_Eliminar === '1' && (
                  <button  className="bg-red-500 hover:bg-red-600 text-white  px-1 py-1 rounded-md" onClick={() => { setFormData(m); showModal('modalConfirmacion'); }}><TrashIcon className="h-5 w-5" /></button>
                )}
              </div>
              </td>
              <td>{m.Identidad}</td>
              <td>{m.Fecha_Matricula ? new Date(m.Fecha_Matricula).toISOString().split('T')[0] : 'No disponible'}</td>
             
              <td>{m.Estudiante} {m.Primer_Apellido}</td>
     
              <td>{m.Modalidad}</td>
              <td>{m.Grado}</td>
              <td>{m.Seccion}</td>
            <td>{estados.find(e => e.Codigo_Estado === m.Estado)?.Nombre_Estado || 'Desconocido'}</td>
  
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredMatriculas.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        nextPage={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredMatriculas.length / itemsPerPage)))}
      />

      <ModalGenerico
        id="modalAddMatricula"
        isOpen={modals['modalAddMatricula']}
        onClose={() => closeModal('modalAddMatricula')}
        titulo={isEditing ? 'Editar Matrícula' : 'Agregar Matrícula'}
      >
        <MatriculaForm
          formData={formData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onClose={() => closeModal('modalAddMatricula')}
          fetchMatriculas={fetchMatriculas}
        />
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals['modalConfirmacion']}
        onClose={() => closeModal('modalConfirmacion')}
        onConfirm={() => handleDelete(formData.Id_Matricula)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar esta matrícula?"
        entidad={formData?.Estudiante}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default MatriculaManagement;